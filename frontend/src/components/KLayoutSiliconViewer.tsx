import React, { useState, useRef, useMemo, useEffect } from 'react'
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  CheckSquare,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react'
import rawLayouts from '../data/openroad_physical_layouts.json'

interface CellInstance {
  id: string
  macro: string
  x: number
  y: number
  w: number
  h: number
  orient: string
  group: string
}

interface PinInstance {
  name: string
  dir: string
  layer: string
  x: number
  y: number
  dx1: number
  dy1: number
  dx2: number
  dy2: number
  orient: string
}

interface StripeInstance {
  net: string
  layer: string
  width: number
  shape: string
  x1: number
  y1: number
  x2: number
  y2: number
}

interface WireInstance {
  net: string
  layer: string
  x1: number
  y1: number
  x2: number
  y2: number
}

interface PhysicalLayout {
  die: { x1: number; y1: number; x2: number; y2: number }
  rows: Array<{ name: string; x: number; y: number; orient: string; numX: number; stepX: number }>
  components: CellInstance[]
  pins: PinInstance[]
  stripes: StripeInstance[]
  wires: WireInstance[]
  meta: {
    title: string
    pdk: string
    gds: string
    component_count: number
    wire_count: number
    pin_count: number
    stripe_count: number
  }
}

const layouts = rawLayouts as Record<string, PhysicalLayout>

// Exact SkyWater 130nm KLayout .lyp Layer Definitions (Matching Photo 1)
const KLAYOUT_LAYERS = [
  { name: 'prBoundary', gds: '1/0', color: '#00F0FF', visible: true, pattern: 'solid' },
  { name: 'pwell.drawing', gds: '64/20', color: '#C084FC', visible: true, pattern: 'stipple' },
  { name: 'pwell.pin', gds: '64/16', color: '#A855F7', visible: false, pattern: 'solid' },
  { name: 'pwell.label', gds: '64/5', color: '#E879F9', visible: true, pattern: 'outline' },
  { name: 'nwell.drawing', gds: '64/20', color: '#7E22CE', visible: true, pattern: 'stipple' },
  { name: 'nwell.pin', gds: '64/16', color: '#3B82F6', visible: false, pattern: 'solid' },
  { name: 'nwell.label', gds: '64/5', color: '#60A5FA', visible: true, pattern: 'outline' },
  { name: 'diff.drawing', gds: '65/20', color: '#22C55E', visible: true, pattern: 'solid' },
  { name: 'diff.pin', gds: '65/16', color: '#16A34A', visible: false, pattern: 'solid' },
  { name: 'tap.drawing', gds: '65/48', color: '#EAB308', visible: true, pattern: 'solid' },
  { name: 'poly.drawing', gds: '66/20', color: '#EF4444', visible: true, pattern: 'solid' },
  { name: 'polypin', gds: '66/16', color: '#DC2626', visible: false, pattern: 'solid' },
  { name: 'licon1.drawing', gds: '66/44', color: '#92400E', visible: true, pattern: 'stipple' },
  { name: 'li1.drawing', gds: '67/20', color: '#8B5CF6', visible: true, pattern: 'solid' },
  { name: 'li1.pin', gds: '67/16', color: '#1E293B', visible: false, pattern: 'solid' },
  { name: 'met1.drawing', gds: '68/20', color: '#2563EB', visible: true, pattern: 'solid' },
  { name: 'met2.drawing', gds: '69/20', color: '#EA580C', visible: true, pattern: 'solid' },
  { name: 'met3.drawing', gds: '70/20', color: '#65A30D', visible: true, pattern: 'solid' },
  { name: 'met4.drawing', gds: '71/20', color: '#D946EF', visible: true, pattern: 'solid' },
  { name: 'met5.drawing', gds: '72/20', color: '#06B6D4', visible: true, pattern: 'solid' }
]

export default function KLayoutSiliconViewer() {
  const [selectedDesignKey, setSelectedDesignKey] = useState<string>('sky130hs_cska')
  const [viewTheme, setViewTheme] = useState<'KLAYOUT_PHOTO' | 'DARK_EDA'>('KLAYOUT_PHOTO')
  const [selectedCell, setSelectedCell] = useState<CellInstance | null>(null)
  const [hoveredCell, setHoveredCell] = useState<CellInstance | null>(null)
  const [highlightMacro, setHighlightMacro] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLaunchingKLayout, setIsLaunchingKLayout] = useState<boolean>(false)
  const [launchMessage, setLaunchMessage] = useState<string | null>(null)

  // Zoom & Pan transforms
  const [zoom, setZoom] = useState<number>(1.0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Real-time cursor coordinates (in micrometers)
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: -9.06229, y: 40.42759 })

  // Active layer visibility
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    diff: true,
    poly: true,
    licon: true,
    li1: true,
    met1: true,
    met2: true,
    met3: true,
    met4: true,
    met5: true,
    cells: true,
    labels: true,
    pins: true,
    ruler: true
  })

  const svgRef = useRef<SVGSVGElement | null>(null)
  const currentLayout: PhysicalLayout = layouts[selectedDesignKey] || layouts['sky130hs_cska']
  const die = currentLayout.die
  const dieW = die.x2 - die.x1
  const dieH = die.y2 - die.y1

  // Set default selected cell to MUX in Block 0
  useEffect(() => {
    const defaultMux = currentLayout.components.find((c) => c.macro.includes('mux2'))
    if (defaultMux) setSelectedCell(defaultMux)
  }, [selectedDesignKey])

  // Macro Summary Counts for left sidebar hierarchy tree
  const macroSummary = useMemo(() => {
    const counts: Record<string, { count: number; group: string; sample: CellInstance }> = {}
    currentLayout.components.forEach((c) => {
      if (!counts[c.macro]) {
        counts[c.macro] = { count: 0, group: c.group, sample: c }
      }
      counts[c.macro].count += 1
    })
    return Object.entries(counts).sort((a, b) => {
      if (a[1].group === 'SKIP_MUX') return -1
      if (b[1].group === 'SKIP_MUX') return 1
      if (a[1].group === 'FULL_ADDER') return -1
      if (b[1].group === 'FULL_ADDER') return 1
      return b[1].count - a[1].count
    })
  }, [currentLayout])

  // Filtered components
  const filteredComponents = useMemo(() => {
    if (!searchTerm) return currentLayout.components
    const lower = searchTerm.toLowerCase()
    return currentLayout.components.filter(
      (c) =>
        c.id.toLowerCase().includes(lower) ||
        c.macro.toLowerCase().includes(lower) ||
        c.group.toLowerCase().includes(lower)
    )
  }, [currentLayout, searchTerm])

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85
    setZoom((prev) => Math.min(8.0, Math.max(0.6, prev * zoomFactor)))
  }

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
    // Update live coordinate tracker
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const relX = (e.clientX - rect.left - pan.x) / zoom
      const relY = (e.clientY - rect.top - pan.y) / zoom
      const svgW = dieW + 8000
      const svgH = dieH + 8000
      const defX = (relX / rect.width) * svgW + (die.x1 - 4000)
      const defY = (relY / rect.height) * svgH + (die.y1 - 4000)
      setCursorCoords({
        x: defX / 1000,
        y: defY / 1000
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleResetView = () => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    setHighlightMacro(null)
  }

  const handleLaunchDesktopKLayout = async (engine: 'auto' | 'wsl' | 'windows' = 'auto') => {
    setIsLaunchingKLayout(true)
    setLaunchMessage('Launching KLayout 0.28.16 GDS viewer...')
    try {
      const designParam = selectedDesignKey.replace('sky130', '')
      const res = await fetch('http://127.0.0.1:8000/api/launch-klayout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design: designParam, engine })
      })
      const data = await res.json()
      if (res.ok) {
        setLaunchMessage(
          `✅ ${data.engine || 'KLayout'} opened successfully for ${selectedDesignKey}! Check taskbar.`
        )
      } else {
        setLaunchMessage(`Failed: ${data.detail || 'Error'}`)
      }
    } catch {
      setLaunchMessage('Backend offline: Make sure FastAPI backend is running.')
    } finally {
      setTimeout(() => setLaunchMessage(null), 5000)
      setIsLaunchingKLayout(false)
    }
  }

  const isPhotoMatch = viewTheme === 'KLAYOUT_PHOTO'

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Top Controls Header */}
      <div className="glass-panel p-3.5 rounded-2xl border border-[#00F0FF]/30 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white tracking-wide glow-cyan">
                KLAYOUT GDSII SILICON LAYOUT VIEW
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D946EF]/20 text-[#D946EF] border border-[#D946EF]/40">
                0.28.16 REPLICA
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              SkyWater 130nm 16-Bit Carry Skip Adder • Magenta Standard Cells • Green Diffusion • Red Poly Gates • 4 µm Ruler
            </p>
          </div>
        </div>

        {/* Theme and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#060A14] border border-[#1E293B]">
            <button
              onClick={() => setViewTheme('KLAYOUT_PHOTO')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 ${
                isPhotoMatch
                  ? 'bg-gradient-to-r from-[#D946EF] to-[#A855F7] text-white shadow-md shadow-[#D946EF]/30'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>KLAYOUT GUI (PHOTO MATCH)</span>
            </button>
            <button
              onClick={() => setViewTheme('DARK_EDA')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 ${
                !isPhotoMatch
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <span>DARK EDA</span>
            </button>
          </div>

          {/* Design Selection */}
          <div className="flex items-center space-x-1">
            {[
              { id: 'sky130hs_cska', label: 'HS CSKA (53.9µm)', badge: 'EXACT' },
              { id: 'sky130hd_cska', label: 'HD CSKA (49.8µm)', badge: 'HD' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDesignKey(d.id)
                  handleResetView()
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                  selectedDesignKey === d.id
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                    : 'bg-[#0A1224] text-[#94A3B8] border-[#1E293B] hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Launch Desktop KLayout Button */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLaunchDesktopKLayout('auto')}
              disabled={isLaunchingKLayout}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-black font-bold text-[11px] flex items-center space-x-1.5 shadow-lg shadow-[#FF7A00]/25 hover:opacity-90 active:scale-95 transition"
              title="Launch genuine KLayout 0.28.16 GUI desktop window"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>LAUNCH KLAYOUT GUI</span>
            </button>
            <button
              onClick={() => handleLaunchDesktopKLayout('windows')}
              disabled={isLaunchingKLayout}
              className="px-2 py-1.5 rounded-xl bg-[#0A1224] text-[#94A3B8] hover:text-white border border-[#1E293B] font-bold text-[10px]"
              title="Launch via Windows native executable"
            >
              WIN
            </button>
          </div>
        </div>
      </div>

      {launchMessage && (
        <div className="p-2.5 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-center font-bold text-xs animate-bounce">
          {launchMessage}
        </div>
      )}

      {/* KLAYOUT 0.28.16 AUTHENTIC WINDOW WRAPPER (Photo 1 Matching) */}
      <div
        className={`rounded-xl overflow-hidden border shadow-2xl transition-all ${
          isPhotoMatch
            ? 'bg-[#ECE9D8] border-[#A0A0A0] text-black'
            : 'bg-[#060A14] border-[#1E293B] text-white'
        }`}
      >
        {/* Authentic KLayout Window Titlebar */}
        <div
          className={`px-3 py-1.5 flex items-center justify-between text-xs font-sans border-b ${
            isPhotoMatch
              ? 'bg-gradient-to-r from-[#E3E3E3] via-[#F5F5F5] to-[#E3E3E3] border-[#B0B0B0] text-[#222222]'
              : 'bg-[#0A1224] border-[#1E293B] text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded bg-[#C026D3] inline-block border border-black/30" />
            <span className="font-semibold text-[11px]">
              KLayout 0.28.16 - 6_final.gds [carry_skip_adder]
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-black/10 hover:bg-black/20 cursor-pointer">_</span>
            <span className="px-1.5 py-0.5 rounded bg-black/10 hover:bg-black/20 cursor-pointer">□</span>
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-700 hover:bg-red-500 hover:text-white cursor-pointer">✕</span>
          </div>
        </div>

        {/* Authentic KLayout Menu Bar */}
        <div
          className={`px-3 py-1 flex items-center space-x-4 text-[11px] font-sans border-b ${
            isPhotoMatch
              ? 'bg-[#F0F0F0] border-[#D0D0D0] text-[#333333]'
              : 'bg-[#080E1B] border-[#1E293B] text-[#94A3B8]'
          }`}
        >
          {['File', 'Edit', 'View', 'Bookmarks', 'Display', 'Tools', 'Macros', 'Help'].map((menu) => (
            <span key={menu} className="hover:bg-blue-500/10 hover:text-blue-600 px-1.5 py-0.5 rounded cursor-pointer">
              {menu}
            </span>
          ))}
        </div>

        {/* Authentic KLayout Toolbar */}
        <div
          className={`px-3 py-1 flex items-center justify-between border-b text-[10px] font-sans ${
            isPhotoMatch
              ? 'bg-[#F7F7F7] border-[#D8D8D8] text-[#444444]'
              : 'bg-[#060B16] border-[#1E293B] text-[#94A3B8]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom((z) => Math.min(8.0, z * 1.25))}
              className="p-1 rounded bg-white/80 border border-gray-300 hover:bg-white flex items-center space-x-1"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3 text-blue-600" />
              <span>Zoom In</span>
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z * 0.8))}
              className="p-1 rounded bg-white/80 border border-gray-300 hover:bg-white flex items-center space-x-1"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3 text-blue-600" />
              <span>Zoom Out</span>
            </button>
            <button
              onClick={handleResetView}
              className="p-1 rounded bg-white/80 border border-gray-300 hover:bg-white flex items-center space-x-1"
              title="Fit to Screen"
            >
              <Maximize2 className="w-3 h-3 text-gray-700" />
              <span>Fit (F)</span>
            </button>
            <span className="text-gray-400">|</span>
            <span className="font-mono text-[10px] text-gray-600">
              Zoom: {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Active Layout Tab Indicator */}
          <div className="flex items-center space-x-1">
            <span className="px-2 py-0.5 bg-white border border-gray-300 rounded-t text-blue-600 font-bold text-[10px]">
              6_final.gds [carry_skip_adder] ✕
            </span>
          </div>
        </div>

        {/* 3-Column Layout: Left Hierarchy, Center GDS Canvas, Right Layers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 h-[680px]">
          {/* Left Column: Authentic KLayout Hierarchy Tree (Photo 1) */}
          <div
            className={`lg:col-span-2 border-r flex flex-col h-full overflow-hidden text-[10px] font-sans ${
              isPhotoMatch
                ? 'bg-[#F9F9F9] border-[#D0D0D0] text-[#333333]'
                : 'bg-[#080E1B] border-[#1E293B] text-[#94A3B8]'
            }`}
          >
            <div className="p-1.5 bg-[#EAEAEA] border-b border-[#D0D0D0] font-bold text-[11px] flex justify-between items-center text-gray-700">
              <span>Cells</span>
              <span className="text-[9px] text-gray-500">{currentLayout.meta.component_count}</span>
            </div>

            {/* Tree List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="font-bold flex items-center space-x-1 text-blue-700 cursor-pointer">
                <ChevronRight className="w-3 h-3" />
                <span>carry_skip_adder</span>
              </div>
              <div className="pl-4 space-y-1">
                {macroSummary.map(([macroName, info]) => {
                  const isSelected = highlightMacro === macroName
                  const isMux = info.group === 'SKIP_MUX'
                  const isFA = info.group === 'FULL_ADDER'
                  return (
                    <div
                      key={macroName}
                      onClick={() => {
                        setHighlightMacro(isSelected ? null : macroName)
                        setSelectedCell(info.sample)
                      }}
                      className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center justify-between text-[10px] ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold'
                          : isMux
                          ? 'text-orange-700 hover:bg-orange-100 font-semibold'
                          : isFA
                          ? 'text-emerald-700 hover:bg-emerald-100 font-semibold'
                          : 'hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="truncate">
                        {macroName.replace('sky130_fd_sc_hs__', '').replace('sky130_fd_sc_hd__', '')}
                      </span>
                      <span className="text-[9px] px-1 bg-black/5 rounded">{info.count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Level Controls Matching Photo 1 */}
            <div className="p-2 border-t border-[#D0D0D0] bg-[#F0F0F0] text-[10px] flex items-center justify-between">
              <span>Levels:</span>
              <div className="flex items-center space-x-1">
                <span className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono">0</span>
                <span>..</span>
                <span className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono">2</span>
              </div>
            </div>

            {/* Libraries Panel Matching Photo 1 */}
            <div className="p-1.5 border-t border-[#D0D0D0] bg-[#EAEAEA] font-bold text-gray-700">
              Libraries
            </div>
            <div className="p-2 text-[9px] text-gray-500 space-y-0.5 h-24 overflow-y-auto bg-white">
              <div>ARC</div>
              <div>CIRCLE</div>
              <div>DONUT</div>
              <div>ELLIPSE</div>
              <div>PIE</div>
              <div>ROUND_PATH</div>
              <div>ROUND_POLYGON</div>
              <div>STROKED_BOX</div>
              <div>STROKED_POLYGON</div>
              <div>TEXT</div>
            </div>
          </div>

          {/* Center Column: Silicon GDSII Canvas Matching Photo 1 */}
          <div
            className={`lg:col-span-8 flex flex-col h-full relative overflow-hidden ${
              isPhotoMatch ? 'bg-[#FFFFFF]' : 'bg-[#02050D]'
            }`}
          >
            {/* SVG Interactive Canvas */}
            <div
              className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center relative"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* KLayout Dot Grid Background (Light Mode dot grid in photo) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: isPhotoMatch
                    ? 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)'
                    : 'radial-gradient(circle, #00F0FF 0.75px, transparent 0.75px)',
                  backgroundSize: '24px 24px',
                  opacity: isPhotoMatch ? 0.8 : 0.25
                }}
              />

              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`${die.x1 - 2500} ${die.y1 - 2000} ${dieW + 5000} ${dieH + 6500}`}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                <defs>
                  {/* Stipple Patterns for KLayout */}
                  <pattern id="stipple-pwell" width="800" height="800" patternUnits="userSpaceOnUse">
                    <circle cx="200" cy="200" r="80" fill="#C084FC" opacity="0.4" />
                    <circle cx="600" cy="600" r="80" fill="#C084FC" opacity="0.4" />
                  </pattern>
                  <pattern id="stipple-nwell" width="800" height="800" patternUnits="userSpaceOnUse">
                    <circle cx="400" cy="400" r="90" fill="#7E22CE" opacity="0.3" />
                  </pattern>
                </defs>

                {/* 1. Die Outer Boundary (prBoundary [1/0]) */}
                <rect
                  x={die.x1}
                  y={die.y1}
                  width={dieW}
                  height={dieH}
                  fill={isPhotoMatch ? '#FFFFFF' : '#060C18'}
                  stroke={isPhotoMatch ? '#C026D3' : '#00F0FF'}
                  strokeWidth="350"
                  strokeOpacity="0.9"
                />

                {/* 2. Standard Cell Rows (Placement Rows) */}
                {currentLayout.rows.map((r, rIdx) => (
                  <rect
                    key={`row-${rIdx}`}
                    x={r.x}
                    y={r.y}
                    width={r.numX * r.stepX}
                    height={selectedDesignKey.includes('hs') ? 3330 : 2720}
                    fill={isPhotoMatch ? (rIdx % 2 === 0 ? '#FAFAFA' : '#F4F4F5') : rIdx % 2 === 0 ? '#0B1324' : '#080E1B'}
                    stroke={isPhotoMatch ? '#E4E4E7' : '#1E293B'}
                    strokeWidth="40"
                  />
                ))}

                {/* 3. N-Well and P-Well Substrate Regions */}
                {currentLayout.rows.map((r, rIdx) => (
                  <g key={`well-${rIdx}`}>
                    {/* N-Well Stripe */}
                    <rect
                      x={r.x}
                      y={r.y + 1600}
                      width={r.numX * r.stepX}
                      height={selectedDesignKey.includes('hs') ? 1730 : 1360}
                      fill="url(#stipple-nwell)"
                      opacity="0.3"
                    />
                  </g>
                ))}

                {/* 4. Followpin Metal 1 Rails (VDD/VSS rails along rows) */}
                {currentLayout.rows.map((r, rIdx) => (
                  <line
                    key={`rail-${rIdx}`}
                    x1={r.x}
                    y1={r.y}
                    x2={r.x + r.numX * r.stepX}
                    y2={r.y}
                    stroke={isPhotoMatch ? '#3B82F6' : '#2563EB'}
                    strokeWidth="380"
                    strokeOpacity="0.65"
                  />
                ))}

                {/* 5. STANDARD CELLS (Magenta Bounding Boxes, Green Diffusion, Red Poly Gates) Matching Photo 1 */}
                {filteredComponents.map((c, cIdx) => {
                  const isSelected = selectedCell?.id === c.id
                  const isHovered = hoveredCell?.id === c.id
                  const isMacroMatch = highlightMacro === c.macro
                  const isFill = c.group === 'DECAP_FILL'

                  // Visual styling matching photo 1
                  // Magenta box `#D946EF` or `#C026D3` for standard cell boundary
                  const boxStroke = isSelected
                    ? '#0284C7'
                    : isMacroMatch
                    ? '#F59E0B'
                    : isHovered
                    ? '#000000'
                    : '#C026D3'

                  const boxStrokeWidth = isSelected || isMacroMatch ? 220 : 100

                  // Calculate gate finger positions (2 to 5 gates depending on width)
                  const numGates = Math.max(2, Math.floor(c.w / 600))
                  const gateStep = c.w / (numGates + 1)

                  return (
                    <g
                      key={`comp-${cIdx}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCell(c)
                      }}
                      onMouseEnter={() => setHoveredCell(c)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="cursor-pointer"
                    >
                      {/* Cell Outer Box (Magenta/Pink border as in photo) */}
                      <rect
                        x={c.x}
                        y={c.y}
                        width={c.w}
                        height={c.h}
                        fill={isPhotoMatch ? (isFill ? '#F5F3FF' : '#FDF4FF') : isFill ? '#1E293B' : '#0F172A'}
                        fillOpacity={isPhotoMatch ? 0.35 : 0.8}
                        stroke={boxStroke}
                        strokeWidth={boxStrokeWidth}
                      />

                      {/* Green Active/Diffusion Regions inside standard cell (diff.drawing in photo) */}
                      {activeLayers.diff && (
                        <>
                          {/* NMOS Diffusion Bar */}
                          <rect
                            x={c.x + 80}
                            y={c.y + 150}
                            width={Math.max(100, c.w - 160)}
                            height={c.h * 0.32}
                            fill="#22C55E"
                            fillOpacity={isPhotoMatch ? 0.45 : 0.6}
                            stroke="#16A34A"
                            strokeWidth="30"
                          />
                          {/* PMOS Diffusion Bar */}
                          <rect
                            x={c.x + 80}
                            y={c.y + c.h * 0.58}
                            width={Math.max(100, c.w - 160)}
                            height={c.h * 0.32}
                            fill="#22C55E"
                            fillOpacity={isPhotoMatch ? 0.45 : 0.6}
                            stroke="#16A34A"
                            strokeWidth="30"
                          />
                        </>
                      )}

                      {/* Red Polysilicon Gates (poly.drawing vertical strips in photo) */}
                      {activeLayers.poly &&
                        Array.from({ length: numGates }).map((_, gIdx) => {
                          const gx = c.x + (gIdx + 1) * gateStep
                          return (
                            <line
                              key={`gate-${gIdx}`}
                              x1={gx}
                              y1={c.y + 80}
                              x2={gx}
                              y2={c.y + c.h - 80}
                              stroke="#EF4444"
                              strokeWidth="80"
                              strokeOpacity="0.85"
                            />
                          )
                        })}

                      {/* Local Interconnect (li1) & Contacts (licon) */}
                      {activeLayers.licon && (
                        <circle
                          cx={c.x + c.w * 0.5}
                          cy={c.y + c.h * 0.5}
                          r="120"
                          fill="#92400E"
                          opacity="0.8"
                        />
                      )}

                      {/* Blue Instance Name Floating Text (Matching Photo 1 e.g. buf_1, fa_1) */}
                      {activeLayers.labels && zoom > 0.85 && (
                        <text
                          x={c.x + c.w / 2}
                          y={c.y + c.h / 2 + 180}
                          fontSize={Math.min(500, Math.max(220, c.w * 0.22))}
                          fill={isPhotoMatch ? '#2563EB' : '#38BDF8'}
                          textAnchor="middle"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          opacity={0.9}
                          pointerEvents="none"
                        >
                          {c.id.length > 14 ? c.id.slice(0, 12) + '..' : c.id}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* 6. Vertical Met4 Power Stripes */}
                {currentLayout.stripes.map((st, sIdx) => (
                  <rect
                    key={`stripe-${sIdx}`}
                    x={Math.min(st.x1, st.x2) - st.width / 2}
                    y={Math.min(st.y1, st.y2)}
                    width={Math.max(st.width, Math.abs(st.x2 - st.x1))}
                    height={Math.max(st.width, Math.abs(st.y2 - st.y1))}
                    fill="#D946EF"
                    fillOpacity={isPhotoMatch ? 0.25 : 0.5}
                    stroke="#C026D3"
                    strokeWidth="80"
                  />
                ))}

                {/* 7. Detailed Routed Signal Net Wires */}
                {currentLayout.wires.map((w, wIdx) => {
                  let wireColor = '#2563EB'
                  if (w.layer === 'met2') wireColor = '#EA580C'
                  if (w.layer === 'met3') wireColor = '#65A30D'
                  if (w.layer === 'met4') wireColor = '#D946EF'
                  return (
                    <line
                      key={`wire-${wIdx}`}
                      x1={w.x1}
                      y1={w.y1}
                      x2={w.x2}
                      y2={w.y2}
                      stroke={wireColor}
                      strokeWidth="140"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                  )
                })}

                {/* 8. 4 µm Scale Ruler at Bottom-Left of Die (Exact Match to Photo 1) */}
                {activeLayers.ruler && (
                  <g transform={`translate(${die.x1 + 1000}, ${die.y2 + 2000})`}>
                    {/* Horizontal Ruler Bar 4 µm = 4000 nm */}
                    <line x1="0" y1="0" x2="4000" y2="0" stroke="#000000" strokeWidth="120" />
                    {/* Left Tick */}
                    <line x1="0" y1="-300" x2="0" y2="300" stroke="#000000" strokeWidth="120" />
                    {/* Right Tick */}
                    <line x1="4000" y1="-300" x2="4000" y2="300" stroke="#000000" strokeWidth="120" />
                    {/* 4 µm Text Label */}
                    <text
                      x="2000"
                      y="-450"
                      fontSize="650"
                      fill="#000000"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      4 µm
                    </text>
                  </g>
                )}
              </svg>

              {/* Hover Box Info Overlay */}
              {hoveredCell && (
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/85 text-white font-mono text-[10px] shadow-lg pointer-events-none border border-white/20">
                  <span className="text-pink-400 font-bold">{hoveredCell.id}</span> |{' '}
                  <span className="text-cyan-300">{hoveredCell.macro}</span> (
                  {(hoveredCell.x / 1000).toFixed(2)}, {(hoveredCell.y / 1000).toFixed(2)} µm)
                </div>
              )}
            </div>

            {/* Authentic KLayout Bottom Status Bar (Exact Replica of Photo 1) */}
            <div
              className={`px-3 py-1 border-t text-[10px] font-mono flex items-center justify-between ${
                isPhotoMatch
                  ? 'bg-[#EAEAEA] border-[#D0D0D0] text-[#222222]'
                  : 'bg-[#0A1224] border-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="font-bold text-gray-700">T (Default)</span>
                <span className="text-gray-400">|</span>
                <span className="truncate">
                  {hoveredCell
                    ? `G box(${hoveredCell.x.toFixed(1)} ${hoveredCell.y.toFixed(1)}) on diff.drawing - 65/20 in carry_skip_adder/${hoveredCell.id}`
                    : `G box(-190.1860 2110.3520) on nwell.drawing - 64/20 in carry_skip_adder/sky130_fd_sc_hs_buf_1@1`}
                </span>
              </div>
              <div className="shrink-0 font-bold text-gray-800">
                xy {cursorCoords.x.toFixed(5)} {cursorCoords.y.toFixed(5)}
              </div>
            </div>
          </div>

          {/* Right Column: Authentic KLayout Layer Toolbox Panel (Photo 1) */}
          <div
            className={`lg:col-span-2 border-l flex flex-col h-full overflow-hidden text-[10px] font-sans ${
              isPhotoMatch
                ? 'bg-[#F9F9F9] border-[#D0D0D0] text-[#333333]'
                : 'bg-[#080E1B] border-[#1E293B] text-[#94A3B8]'
            }`}
          >
            <div className="p-1.5 bg-[#EAEAEA] border-b border-[#D0D0D0] font-bold text-[11px] flex justify-between items-center text-gray-700">
              <span>Layers</span>
              <span className="text-[9px] text-gray-500">PDK: Sky130</span>
            </div>

            {/* Layer Table Matching Photo 1 Right Panel */}
            <div className="flex-1 overflow-y-auto p-1 space-y-0.5 bg-white">
              {KLAYOUT_LAYERS.map((ly) => (
                <div
                  key={ly.name}
                  className="flex items-center justify-between px-1.5 py-0.5 rounded hover:bg-blue-50 cursor-pointer text-[10px]"
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 border border-black/40"
                      style={{ backgroundColor: ly.color }}
                    />
                    <span className="truncate text-gray-800">{ly.name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 shrink-0">{ly.gds}</span>
                </div>
              ))}
            </div>

            {/* Layer Toolbox Footer Matching Photo 1 */}
            <div className="border-t border-[#D0D0D0] bg-[#EAEAEA]">
              <div className="p-1.5 font-bold text-[10px] text-gray-700 flex justify-between items-center">
                <span>Layer Toolbox</span>
                <span className="text-[9px] text-gray-500">KLayout</span>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2 bg-[#F0F0F0] text-[9px] text-gray-700">
                <div className="p-1 bg-white border border-gray-300 rounded text-center">Color</div>
                <div className="p-1 bg-white border border-gray-300 rounded text-center">Frame color</div>
                <div className="p-1 bg-white border border-gray-300 rounded text-center">Stipple</div>
                <div className="p-1 bg-white border border-gray-300 rounded text-center">Animation</div>
                <div className="p-1 bg-white border border-gray-300 rounded text-center">Style</div>
                <div className="p-1 bg-white border border-gray-300 rounded text-center">Visibility</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
