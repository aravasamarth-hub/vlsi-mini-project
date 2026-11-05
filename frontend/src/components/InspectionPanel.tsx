import React, { useState } from 'react'
import {
  Cpu,
  Layers,
  Zap,
  Info,
  RotateCcw,
  Maximize2,
  CheckSquare,
  Square,
  ChevronDown
} from 'lucide-react'

interface InspectionPanelProps {
  readonly activeBlock: number | null
  readonly onSelectBlock: (id: number) => void
  readonly telemetry: any
  readonly simulating: boolean
}

export default function InspectionPanel({
  activeBlock,
  onSelectBlock,
  telemetry,
  simulating
}: Readonly<InspectionPanelProps>) {
  const [showPackage, setShowPackage] = useState(true)
  const [showDieLayers, setShowDieLayers] = useState(true)
  const [showRouting, setShowRouting] = useState(true)
  const [showStdCells, setShowStdCells] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [selectedLayer, setSelectedLayer] = useState('All Layers')
  const [renderMode, setRenderMode] = useState('Realistic')
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'BLOCK'>('SUMMARY')

  const currentBlockId = activeBlock !== null && activeBlock >= 0 ? activeBlock : 0
  const blockData = telemetry?.blocks?.[currentBlockId]
  const isSkipActive = Boolean(blockData?.skip_active)

  return (
    <div className="w-full flex flex-col space-y-4 font-mono text-xs">
      {/* CARD 1: LAYOUT OVERVIEW (CSKA) (Reference 1) */}
      <div className="glass-panel p-4 rounded-xl border border-[#00F0FF]/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]"></span>
            <span className="font-bold text-white tracking-wider text-[11px]">
              LAYOUT OVERVIEW (CSKA)
            </span>
          </div>
          <span className="text-[10px] text-[#00F0FF] font-bold">45.0 × 35.0 µm</span>
        </div>

        {/* Micro SVG Placement Layout Representation */}
        <div className="relative bg-[#040812] rounded-lg p-2 border border-[#1E293B] flex items-center justify-center">
          <svg viewBox="0 0 450 350" className="w-full h-32 rounded">
            {/* Background Grid */}
            <defs>
              <pattern id="layoutGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0F172A" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="450" height="350" fill="url(#layoutGrid)" />

            {/* Die Outer Boundary */}
            <rect
              x="10"
              y="10"
              width="430"
              height="330"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2"
              rx="4"
            />

            {/* VDD Outer Ring (Amber) */}
            <rect
              x="25"
              y="25"
              width="400"
              height="300"
              fill="none"
              stroke="#FF7A00"
              strokeWidth="3"
              strokeDasharray="16, 8"
              opacity="0.85"
            />

            {/* VSS Inner Ring (Cyan) */}
            <rect
              x="38"
              y="38"
              width="374"
              height="274"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeDasharray="16, 8"
              opacity="0.85"
            />

            {/* Core Area Boundary */}
            <rect
              x="55"
              y="55"
              width="340"
              height="240"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.5"
              strokeDasharray="6, 4"
              opacity="0.5"
            />

            {/* Standard Cell Placement Rows */}
            {[75, 100, 125, 150, 175, 200, 225, 250, 275].map((ry, rIdx) => (
              <line
                key={rIdx}
                x1="60"
                y1={ry}
                x2="390"
                y2={ry}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4, 4"
              />
            ))}

            {/* 4 CSKA Standard-Cell Block Regions */}
            {[
              { x: 65, color: '#10B981', label: 'BLK 0' },
              { x: 145, color: '#10B981', label: 'BLK 1' },
              { x: 225, color: '#10B981', label: 'BLK 2' },
              { x: 305, color: '#10B981', label: 'BLK 3' }
            ].map((blk, idx) => (
              <g key={idx}>
                {/* Full Adder Cells */}
                <rect
                  x={blk.x}
                  y="85"
                  width="70"
                  height="160"
                  fill={blk.color}
                  fillOpacity="0.3"
                  stroke={blk.color}
                  strokeWidth="1.5"
                  rx="3"
                />
                {/* AND4 Group Gate */}
                <rect
                  x={blk.x + 10}
                  y="255"
                  width="22"
                  height="25"
                  fill="#F59E0B"
                  fillOpacity="0.75"
                  stroke="#FBBF24"
                  strokeWidth="1"
                />
                {/* MUX2:1 Bypass Gate */}
                <rect
                  x={blk.x + 38}
                  y="255"
                  width="22"
                  height="25"
                  fill="#FF7A00"
                  fillOpacity="0.85"
                  stroke="#FFAA33"
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Metal-2 Carry Skip Highway Spanning Across Blocks */}
            <line
              x1="60"
              y1="267"
              x2="390"
              y2="267"
              stroke="#FF7A00"
              strokeWidth="2.5"
              strokeDasharray="8, 4"
            />
          </svg>

          {/* Dimension Label Badges */}
          <span className="absolute bottom-1 right-2 text-[9px] text-[#94A3B8]">
            35.0 µm
          </span>
          <span className="absolute top-1 left-2 text-[9px] text-[#94A3B8]">
            45.0 µm
          </span>
        </div>
      </div>

      {/* CARD 2: DESIGN SUMMARY (Reference 1) */}
      <div className="glass-panel p-4 rounded-xl border border-[#00F0FF]/25 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-bold text-white tracking-wider text-[11px]">DESIGN SUMMARY</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
            SKY130HD
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Std. Cells:</span>
            <span className="text-[#00DF72] font-bold">48 (56 Hierarchical)</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Cell Area:</span>
            <span className="text-white font-bold">440.42 µm²</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Die Size:</span>
            <span className="text-[#00F0FF] font-bold">45.0 µm × 35.0 µm</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Core Size:</span>
            <span className="text-white font-bold">35.0 µm × 24.5 µm</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Utilization:</span>
            <span className="text-[#FF7A00] font-bold">51.4 %</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Rows:</span>
            <span className="text-white">9 (Alternating R0/R180)</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
            <span className="text-[#94A3B8]">Layout:</span>
            <span className="text-[#FF7A00] font-bold">Placement-only (Unrouted)</span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span className="text-[#94A3B8]">PDK:</span>
            <span className="text-white font-bold">SkyWater SKY130HD</span>
          </div>
        </div>
      </div>

      {/* CARD 3: VIEW CONTROLS (Reference 1) */}
      <div className="glass-panel p-4 rounded-xl border border-[#00F0FF]/25 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-bold text-white tracking-wider text-[11px]">VIEW CONTROLS</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setActiveTab(activeTab === 'SUMMARY' ? 'BLOCK' : 'SUMMARY')}
              className="text-[10px] text-[#00F0FF] hover:underline"
            >
              {activeTab === 'SUMMARY' ? 'INSPECT BLOCKS →' : '← VIEW CONTROLS'}
            </button>
          </div>
        </div>

        {activeTab === 'SUMMARY' ? (
          <div className="space-y-3">
            {/* Checkboxes List */}
            <div className="space-y-2 text-[11px]">
              {[
                { label: 'Show Package', state: showPackage, set: setShowPackage },
                { label: 'Show Die Layers', state: showDieLayers, set: setShowDieLayers },
                { label: 'Show Routing (M1–M3)', state: showRouting, set: setShowRouting },
                { label: 'Show Standard Cells', state: showStdCells, set: setShowStdCells },
                { label: 'Show Labels', state: showLabels, set: setShowLabels }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.set(!item.state)}
                  className="flex items-center space-x-2.5 cursor-pointer text-[#CBD5E1] hover:text-white transition"
                >
                  {item.state ? (
                    <CheckSquare className="w-4 h-4 text-[#00F0FF]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B]" />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Dropdown Selectors: Layer & Render Mode */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E293B]">
              <div>
                <span className="text-[10px] text-[#64748B] block mb-1">Layer</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-[#070D1A] border border-[#1E293B] text-white flex items-center justify-between cursor-pointer">
                  <span className="truncate">{selectedLayer}</span>
                  <ChevronDown className="w-3 h-3 text-[#64748B] shrink-0" />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block mb-1">Render</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-[#070D1A] border border-[#1E293B] text-white flex items-center justify-between cursor-pointer">
                  <span>{renderMode}</span>
                  <ChevronDown className="w-3 h-3 text-[#64748B] shrink-0" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onSelectBlock(-1)}
                className="py-1.5 px-3 rounded-lg bg-[#0A1224] hover:bg-[#1E293B] text-white transition flex items-center justify-center space-x-1.5 border border-[#1E293B]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Reset View</span>
              </button>
              <button
                onClick={() => {
                  const elem = document.documentElement
                  if (!document.fullscreenElement) elem.requestFullscreen?.()
                  else document.exitFullscreen?.()
                }}
                className="py-1.5 px-3 rounded-lg bg-[#0A1224] hover:bg-[#1E293B] text-white transition flex items-center justify-center space-x-1.5 border border-[#1E293B]"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>
        ) : (
          /* BLOCK INSPECTOR SUB-VIEW */
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Block Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#070D1A] rounded-lg border border-[#1E293B]">
              {[0, 1, 2, 3].map((bId) => {
                const b = telemetry?.blocks?.[bId]
                const isBypass = b?.skip_active
                const isSel = activeBlock === bId
                return (
                  <button
                    key={bId}
                    onClick={() => onSelectBlock(bId)}
                    className={`py-1 rounded text-center text-[10px] ${
                      isSel
                        ? 'bg-[#00F0FF] text-black font-bold shadow-md shadow-[#00F0FF]/25'
                        : isBypass
                        ? 'bg-[#FF7A00]/20 text-[#FF7A00] font-bold'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    BLK {bId}
                  </button>
                )
              })}
            </div>

            {blockData && (
              <div className="bg-[#050A14] p-2.5 rounded-lg border border-[#1E293B] space-y-1.5 text-[10px]">
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span className="text-[#94A3B8]">Bit Range:</span>
                  <span className="text-white font-bold">{blockData.bit_range}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span className="text-[#94A3B8]">Operands:</span>
                  <span className="text-white">A={blockData.a_hex} • B={blockData.b_hex}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span className="text-[#94A3B8]">P_group (AND4):</span>
                  <span className={blockData.p_group ? 'text-[#FF7A00] font-bold' : 'text-[#64748B]'}>
                    {blockData.p_group ? '1 (Bypass Active)' : '0 (Ripple)'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span className="text-[#94A3B8]">Carry-In (Cin):</span>
                  <span className="text-white font-bold">{blockData.cin}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#94A3B8]">Carry-Out (Cout):</span>
                  <span className="text-[#00F0FF] font-bold">{blockData.cout_actual}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
