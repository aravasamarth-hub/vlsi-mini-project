import React, { useState, useRef, useMemo, useEffect } from 'react'
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Cpu,
  Activity,
  Info,
  Download,
  Crosshair,
  Compass,
  Play
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

// Layer Palette matching SkyWater 130nm KLayout .lyp definition
const LAYER_COLORS: Record<string, { color: string; label: string; gdsLayer: string }> = {
  die: { color: '#00F0FF', label: 'prBoundary [1/0]', gdsLayer: '1/0' },
  li1: { color: '#9333EA', label: 'li1 Local Interconnect [64/16]', gdsLayer: '64/16' },
  met1: { color: '#2563EB', label: 'met1 Routing & Rails [68/20]', gdsLayer: '68/20' },
  met2: { color: '#EA580C', label: 'met2 Vertical Interconnect [69/20]', gdsLayer: '69/20' },
  met3: { color: '#65A30D', label: 'met3 Horizontal Interconnect [70/20]', gdsLayer: '70/20' },
  met4: { color: '#D946EF', label: 'met4 Power Distribution Straps [71/20]', gdsLayer: '71/20' },
  met5: { color: '#06B6D4', label: 'met5 Top Level Power Grid [72/20]', gdsLayer: '72/20' },
  fa: { color: '#10B981', label: 'Full Adder (sky130_fa_1)', gdsLayer: 'CELL' },
  ha: { color: '#14B8A6', label: 'Half Adder (sky130_ha_1)', gdsLayer: 'CELL' },
  mux: { color: '#FF7A00', label: 'Carry Skip 2:1 MUX (mux2_1)', gdsLayer: 'CELL' },
  and: { color: '#F59E0B', label: 'Group Propagate AND4 (and4_2)', gdsLayer: 'CELL' },
  xor: { color: '#38BDF8', label: 'Bit Propagate XOR2 (xor2_1)', gdsLayer: 'CELL' },
  buf: { color: '#818CF8', label: 'Timing Buffers (buf_1)', gdsLayer: 'CELL' },
  fill: { color: '#334155', label: 'Fill / Decap Cells (fill_*)', gdsLayer: 'CELL' },
  tap: { color: '#64748B', label: 'Well Tap Cells (tap_*)', gdsLayer: 'CELL' }
}

export default function KLayoutSiliconViewer() {
  const [selectedDesignKey, setSelectedDesignKey] = useState<string>('sky130hs_cska')
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

  // Layer Visibility
  const [layerVis, setLayerVis] = useState({
    boundary: true,
    rows: true,
    powerGrid: true,
    signalWires: true,
    logicCells: true,
    fillCells: true,
    pinLabels: true,
    cellLabels: true
  })

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
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleResetView = () => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    setHighlightMacro(null)
  }

  const handleLaunchDesktopKLayout = async () => {
    setIsLaunchingKLayout(true)
    setLaunchMessage('Launching KLayout via WSL...')
    try {
      const designParam = selectedDesignKey.replace('sky130', '')
      const res = await fetch('http://127.0.0.1:8000/api/launch-klayout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design: designParam })
      })
      const data = await res.json()
      if (res.ok) {
        setLaunchMessage(`KLayout launched for ${selectedDesignKey}! Check taskbar.`)
      } else {
        setLaunchMessage(`Failed: ${data.detail || 'Error'}`)
      }
    } catch {
      setLaunchMessage('Backend offline: Use .\\scripts\\view_layout.bat in terminal.')
    } finally {
      setTimeout(() => setLaunchMessage(null), 4000)
      setIsLaunchingKLayout(false)
    }
  }

  // Helper for cell fill color
  const getCellFill = (c: CellInstance) => {
    if (c.group === 'SKIP_MUX') return '#FF7A00'
    if (c.group === 'FULL_ADDER') return '#10B981'
    if (c.group === 'HALF_ADDER') return '#14B8A6'
    if (c.group === 'AND_GATE') return '#F59E0B'
    if (c.group === 'XOR_GATE') return '#0284C7'
    if (c.group === 'BUFFER') return '#6366F1'
    if (c.group === 'INVERTER') return '#8B5CF6'
    if (c.group === 'WELL_TAP') return '#475569'
    return '#1E293B' // fills
  }

  return (
    <div className="space-y-4 font-mono text-xs select-none">
      {/* Top Banner Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#00F0FF]/30 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-wide glow-cyan">
                OPENROAD POST-ROUTE GDSII SILICON VIEWER
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                KLAYOUT 0.30 STREAM
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Micrometer-Accurate Standard Cell Placement • Metal 1-5 Detailed Routing • PDN Power Stripes
            </p>
          </div>
        </div>

        {/* Design Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'sky130hs_cska', label: 'SKY130HS CSKA (53.9µm)', badge: 'PHOTO MATCH', color: '#00F0FF' },
            { id: 'sky130hd_cska', label: 'SKY130HD CSKA (49.8µm)', badge: 'HIGH DENSITY', color: '#10B981' },
            { id: 'sky130hs_rca', label: 'SKY130HS RCA', badge: 'HS BASELINE', color: '#F59E0B' },
            { id: 'sky130hd_rca', label: 'SKY130HD RCA', badge: 'HD BASELINE', color: '#94A3B8' }
          ].map((d) => {
            const isSelected = selectedDesignKey === d.id
            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDesignKey(d.id)
                  handleResetView()
                }}
                className={`px-3 py-1.5 rounded-xl transition text-[11px] font-bold flex items-center space-x-1.5 border ${
                  isSelected
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF] shadow-lg shadow-[#00F0FF]/20'
                    : 'bg-[#060A14] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#334155]'
                }`}
              >
                <span>{d.label}</span>
                {d.badge === 'PHOTO MATCH' && (
                  <span className="px-1 py-0.2 rounded text-[9px] bg-[#FF7A00] text-black font-extrabold">
                    EXACT
                  </span>
                )}
              </button>
            )
          })}

          {/* Native KLayout Launch Button */}
          <button
            onClick={handleLaunchDesktopKLayout}
            disabled={isLaunchingKLayout}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-black font-bold text-[11px] flex items-center space-x-1.5 shadow-lg shadow-[#FF7A00]/25 hover:opacity-90 active:scale-95 transition"
            title="Launch genuine KLayout desktop window in Windows 11 via WSLg"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>LAUNCH KLAYOUT DESKTOP</span>
          </button>
        </div>
      </div>

      {launchMessage && (
        <div className="p-2.5 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-center font-bold text-xs animate-bounce">
          {launchMessage}
        </div>
      )}

      {/* Main Workspace: 3-Column Studio Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: KLayout Cell Hierarchy Panel (Photo 4) */}
        <div className="xl:col-span-3 glass-panel rounded-2xl border border-[#1E293B] bg-[#060A14]/95 flex flex-col h-[650px] overflow-hidden">
          <div className="p-3.5 border-b border-[#1E293B] bg-[#0A1224] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-bold text-white text-xs">CELL HIERARCHY</span>
            </div>
            <span className="text-[10px] text-[#94A3B8]">
              {currentLayout.meta.component_count} Cells Placed
            </span>
          </div>

          {/* Search Bar */}
          <div className="p-2.5 border-b border-[#1E293B]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter macro (fa_1, mux2, buf)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#040812] border border-[#1E293B] text-white text-[11px] focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>

          {/* Tree View */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[11px]">
            {/* Top Root Cell */}
            <div className="p-2 rounded-lg bg-[#0E1A30] border border-[#00F0FF]/30 text-white font-bold flex items-center justify-between">
              <span className="text-[#00F0FF]">carry_skip_adder (TOP)</span>
              <span className="text-[10px] text-[#94A3B8]">{currentLayout.meta.pdk}</span>
            </div>

            {/* Cell Macro Groups */}
            <div className="pl-3 pt-1 space-y-1">
              {macroSummary.map(([macroName, info]) => {
                const isHighlighted = highlightMacro === macroName
                const isSkipMux = info.group === 'SKIP_MUX'
                const isFA = info.group === 'FULL_ADDER'
                return (
                  <button
                    key={macroName}
                    onClick={() => {
                      if (highlightMacro === macroName) {
                        setHighlightMacro(null)
                      } else {
                        setHighlightMacro(macroName)
                        setSelectedCell(info.sample)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                      isHighlighted
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                        : isSkipMux
                        ? 'bg-[#FF7A00]/10 text-[#FF7A00] hover:bg-[#FF7A00]/20 font-bold'
                        : isFA
                        ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 font-bold'
                        : 'text-[#94A3B8] hover:bg-[#0E1626] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            isSkipMux ? '#FF7A00' : isFA ? '#10B981' : info.group === 'DECAP_FILL' ? '#475569' : '#38BDF8'
                        }}
                      />
                      <span className="truncate">{macroName.replace('sky130_fd_sc_hs__', '').replace('sky130_fd_sc_hd__', '')}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0A1224] border border-[#1E293B]">
                      {info.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cell Inspector Box at bottom of hierarchy */}
          {selectedCell && (
            <div className="p-3 border-t border-[#1E293B] bg-[#0A1224] space-y-1.5 text-[10px]">
              <div className="text-[11px] font-bold text-white flex items-center justify-between">
                <span className="text-[#00F0FF]">SELECTED CELL</span>
                <span className="px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono">
                  {selectedCell.orient}
                </span>
              </div>
              <div className="text-white truncate font-mono">{selectedCell.id}</div>
              <div className="text-[#94A3B8] truncate">{selectedCell.macro}</div>
              <div className="grid grid-cols-2 gap-1 text-[#64748B] pt-1">
                <div>X: <span className="text-white font-bold">{(selectedCell.x / 1000).toFixed(3)} µm</span></div>
                <div>Y: <span className="text-white font-bold">{(selectedCell.y / 1000).toFixed(3)} µm</span></div>
                <div>W: <span className="text-white">{(selectedCell.w / 1000).toFixed(3)} µm</span></div>
                <div>H: <span className="text-white">{(selectedCell.h / 1000).toFixed(3)} µm</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Center Column: Interactive KLayout Canvas (Photos 1, 2, 3) */}
        <div className="xl:col-span-6 glass-panel rounded-2xl border border-[#1E293B] bg-[#040711] flex flex-col h-[650px] relative overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="p-2.5 border-b border-[#1E293B] bg-[#070D1A] flex items-center justify-between text-[11px] z-10">
            <div className="flex items-center space-x-2">
              <span className="text-[#00F0FF] font-bold">
                DIE: {(dieW / 1000).toFixed(1)} × {(dieH / 1000).toFixed(1)} µm
              </span>
              <span className="text-[#64748B]">|</span>
              <span className="text-[#94A3B8]">
                Zoom: <span className="text-white font-bold">{Math.round(zoom * 100)}%</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setZoom((z) => Math.min(8.0, z * 1.25))}
                className="p-1 rounded bg-[#0E1626] border border-[#1E293B] text-[#94A3B8] hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z * 0.8))}
                className="p-1 rounded bg-[#0E1626] border border-[#1E293B] text-[#94A3B8] hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1 rounded bg-[#0E1626] border border-[#1E293B] text-[#94A3B8] hover:text-white"
                title="Fit to Screen (Key: F)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Canvas with Pan & Zoom */}
          <div
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center relative bg-[#02050D]"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Subtle KLayout Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #00F0FF 0.75px, transparent 0.75px), radial-gradient(circle, #38BDF8 0.5px, transparent 0.5px)',
                backgroundSize: '24px 24px, 12px 12px'
              }}
            />

            <svg
              width="100%"
              height="100%"
              viewBox={`${die.x1 - 4000} ${die.y1 - 4000} ${dieW + 8000} ${dieH + 8000}`}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <defs>
                {/* KLayout Stipple Patterns for Fills */}
                <pattern id="klayout-hatch" width="800" height="800" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="800" y2="800" stroke="#475569" strokeWidth="100" opacity="0.3" />
                  <line x1="800" y1="0" x2="0" y2="800" stroke="#475569" strokeWidth="100" opacity="0.3" />
                </pattern>
                {/* Metal 4 Stripe Pattern */}
                <pattern id="met4-strap" width="1600" height="1600" patternUnits="userSpaceOnUse">
                  <rect width="1600" height="1600" fill="#D946EF" fillOpacity="0.4" />
                  <line x1="0" y1="0" x2="1600" y2="1600" stroke="#C026D3" strokeWidth="200" opacity="0.8" />
                </pattern>
                {/* Glow Filter */}
                <filter id="glow-highlight" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="300" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Die Boundary (prBoundary) */}
              {layerVis.boundary && (
                <rect
                  x={die.x1}
                  y={die.y1}
                  width={dieW}
                  height={dieH}
                  fill="#060C18"
                  stroke="#00F0FF"
                  strokeWidth="350"
                  strokeOpacity="0.85"
                />
              )}

              {/* 2. Standard Cell Rows */}
              {layerVis.rows &&
                currentLayout.rows.map((r, rIdx) => (
                  <g key={`row-${rIdx}`}>
                    <rect
                      x={r.x}
                      y={r.y}
                      width={r.numX * r.stepX}
                      height={selectedDesignKey.includes('hs') ? 3330 : 2720}
                      fill={rIdx % 2 === 0 ? '#0B1324' : '#080E1B'}
                      stroke="#1E293B"
                      strokeWidth="60"
                      strokeDasharray="400, 400"
                    />
                  </g>
                ))}

              {/* 3. Followpin Rails (Metal 1 Power Rails on Rows) */}
              {layerVis.powerGrid &&
                currentLayout.rows.map((r, rIdx) => (
                  <line
                    key={`rail-${rIdx}`}
                    x1={r.x}
                    y1={r.y}
                    x2={r.x + r.numX * r.stepX}
                    y2={r.y}
                    stroke="#2563EB"
                    strokeWidth="480"
                    strokeOpacity="0.75"
                  />
                ))}

              {/* 4. Vertical Metal 4 / Metal 5 Power Distribution Straps */}
              {layerVis.powerGrid &&
                currentLayout.stripes.map((st, sIdx) => (
                  <rect
                    key={`stripe-${sIdx}`}
                    x={Math.min(st.x1, st.x2) - st.width / 2}
                    y={Math.min(st.y1, st.y2)}
                    width={Math.max(st.width, Math.abs(st.x2 - st.x1))}
                    height={Math.max(st.width, Math.abs(st.y2 - st.y1))}
                    fill={st.layer === 'met4' ? 'url(#met4-strap)' : '#06B6D4'}
                    stroke={st.net === 'VDD' ? '#FB923C' : '#38BDF8'}
                    strokeWidth="120"
                    opacity={st.layer === 'met5' ? 0.8 : 0.6}
                  />
                ))}

              {/* 5. Placed Standard Cells (Fillers, Taps, Logic Gates) */}
              {filteredComponents.map((c, cIdx) => {
                const isSelected = selectedCell?.id === c.id
                const isHovered = hoveredCell?.id === c.id
                const isMacroMatch = highlightMacro === c.macro
                const isFill = c.group === 'DECAP_FILL'
                const isTap = c.group === 'WELL_TAP'

                // Skip fills if toggled off
                if (isFill && !layerVis.fillCells) return null
                if (!isFill && !layerVis.logicCells) return null

                const fillColor = isFill ? 'url(#klayout-hatch)' : getCellFill(c)
                const strokeColor = isSelected
                  ? '#00F0FF'
                  : isMacroMatch
                  ? '#FACC15'
                  : isHovered
                  ? '#FFFFFF'
                  : isFill
                  ? '#334155'
                  : '#0F172A'

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
                    <rect
                      x={c.x}
                      y={c.y}
                      width={c.w}
                      height={c.h}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected || isMacroMatch ? 280 : 70}
                      filter={isSelected || isMacroMatch ? 'url(#glow-highlight)' : undefined}
                      opacity={isFill ? 0.45 : isTap ? 0.7 : 0.95}
                    />

                    {/* Cell Name Label on Zoom */}
                    {layerVis.cellLabels && zoom > 1.8 && !isFill && (
                      <text
                        x={c.x + c.w / 2}
                        y={c.y + c.h / 2 + 300}
                        fontSize={Math.min(700, c.w * 0.28)}
                        fill="#FFFFFF"
                        textAnchor="middle"
                        fontWeight="bold"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {c.macro.includes('mux2')
                          ? 'MUX2'
                          : c.macro.includes('fa_1')
                          ? 'FA1'
                          : c.macro.includes('ha_1')
                          ? 'HA1'
                          : c.macro.includes('and4')
                          ? 'AND4'
                          : c.macro.includes('buf')
                          ? 'BUF'
                          : ''}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* 6. Routed Signal Wires (OpenROAD Detailed Routing) */}
              {layerVis.signalWires &&
                currentLayout.wires.map((w, wIdx) => {
                  let wireStroke = '#2563EB'
                  let strokeW = 180
                  if (w.layer === 'met2') {
                    wireStroke = '#EF4444'
                    strokeW = 200
                  } else if (w.layer === 'met3') {
                    wireStroke = '#84CC16'
                    strokeW = 220
                  } else if (w.layer === 'met4') {
                    wireStroke = '#D946EF'
                    strokeW = 250
                  } else if (w.layer === 'li1') {
                    wireStroke = '#A855F7'
                    strokeW = 160
                  }

                  return (
                    <line
                      key={`wire-${wIdx}`}
                      x1={w.x1}
                      y1={w.y1}
                      x2={w.x2}
                      y2={w.y2}
                      stroke={wireStroke}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  )
                })}

              {/* 7. Peripheral I/O Pins & Text Labels */}
              {layerVis.pinLabels &&
                currentLayout.pins.map((p, pIdx) => {
                  const isSum = p.name.startsWith('Sum')
                  const isA = p.name.startsWith('A')
                  const isB = p.name.startsWith('B')
                  const isCout = p.name === 'Cout'
                  const pinColor = isSum
                    ? '#00DF72'
                    : isCout
                    ? '#FF7A00'
                    : isA
                    ? '#00F0FF'
                    : isB
                    ? '#F59E0B'
                    : '#FFFFFF'

                  return (
                    <g key={`pin-${pIdx}`}>
                      <rect
                        x={p.x + p.dx1}
                        y={p.y + p.dy1}
                        width={Math.max(600, p.dx2 - p.dx1)}
                        height={Math.max(600, p.dy2 - p.dy1)}
                        fill={pinColor}
                        stroke="#000000"
                        strokeWidth="80"
                      />
                      <text
                        x={p.x}
                        y={p.y < 3000 ? p.y - 600 : p.y > dieH - 3000 ? p.y + 1200 : p.y + 200}
                        fontSize="900"
                        fill={pinColor}
                        textAnchor="middle"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {p.name}
                      </text>
                    </g>
                  )
                })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredCell && (
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#070D1A]/95 border border-[#00F0FF]/40 text-white font-mono text-[10px] shadow-xl pointer-events-none">
                <span className="text-[#00F0FF] font-bold">{hoveredCell.id}</span> •{' '}
                <span className="text-white">{hoveredCell.macro}</span> (
                {(hoveredCell.x / 1000).toFixed(2)}, {(hoveredCell.y / 1000).toFixed(2)} µm)
              </div>
            )}
          </div>
        </div>

        {/* Right Column: KLayout Layer Toolbox (Photos 1, 3) */}
        <div className="xl:col-span-3 glass-panel rounded-2xl border border-[#1E293B] bg-[#060A14]/95 flex flex-col h-[650px] overflow-hidden">
          <div className="p-3.5 border-b border-[#1E293B] bg-[#0A1224] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#FF7A00]" />
              <span className="font-bold text-white text-xs">LAYER TOOLBOX (KLAYOUT)</span>
            </div>
            <span className="text-[10px] text-[#94A3B8]">PDK: Sky130</span>
          </div>

          {/* Layer List Matching KLayout Properties Panel */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[11px]">
            <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mb-1">
              PHYSICAL MASKS & ROUTING
            </div>

            {[
              { key: 'signalWires', label: 'met1 - met5 Routed Signal Wires', color: '#2563EB', desc: 'Detailed net arcs' },
              { key: 'powerGrid', label: 'VDD/VSS PDN Grid & Straps', color: '#D946EF', desc: 'Met4 straps & Met1 rails' },
              { key: 'logicCells', label: 'Standard Cell Logic (FA, MUX, etc.)', color: '#10B981', desc: 'Silicon gate diffusion' },
              { key: 'fillCells', label: 'Decap / Fill Cells (fill_*)', color: '#475569', desc: 'DRC density & capacitance' },
              { key: 'pinLabels', label: 'I/O Pin Markers & Text (A, B, S)', color: '#00F0FF', desc: 'Perimeter bond pads' },
              { key: 'cellLabels', label: 'Cell Type Text Tags', color: '#F59E0B', desc: 'Visible on high zoom' },
              { key: 'rows', label: 'Standard Cell Rows (N/FS)', color: '#1E293B', desc: 'Base cell placement pitch' },
              { key: 'boundary', label: 'prBoundary Die Area', color: '#00F0FF', desc: 'Chip outline' }
            ].map((ly) => {
              const active = (layerVis as any)[ly.key]
              return (
                <div
                  key={ly.key}
                  onClick={() =>
                    setLayerVis((prev) => ({ ...prev, [ly.key]: !((prev as any)[ly.key]) }))
                  }
                  className="flex items-center justify-between p-2 rounded-xl bg-[#0A1224] border border-[#1E293B] hover:border-[#334155] cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/20"
                      style={{ backgroundColor: ly.color }}
                    />
                    <div>
                      <div className="text-white font-medium text-[11px] leading-tight">{ly.label}</div>
                      <div className="text-[9px] text-[#64748B]">{ly.desc}</div>
                    </div>
                  </div>
                  {active ? (
                    <CheckSquare className="w-4 h-4 text-[#00F0FF]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#475569]" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Metrics Footer */}
          <div className="p-3 border-t border-[#1E293B] bg-[#0A1224] space-y-1 text-[10px]">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Routed Nets:</span>
              <span className="text-white font-bold">{currentLayout.meta.wire_count} segments</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Primary Pins:</span>
              <span className="text-[#00F0FF] font-bold">{currentLayout.meta.pin_count} pins</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>PDN Power Stripes:</span>
              <span className="text-[#FF7A00] font-bold">{currentLayout.meta.stripe_count} stripes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

