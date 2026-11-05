import React, { useState } from 'react'
import {
  Layers,
  HardDrive,
  Download,
  CheckCircle,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  Box,
  Eye,
  EyeOff,
  Code2
} from 'lucide-react'

// The exact 48 placed standard cells extracted directly from cska_sky130.def
const DEF_COMPONENTS = [
  { id: '_31_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 5440, orient: 'N', func: 'SUM XOR/XNOR Stage (b0)' },
  { id: '_32_', type: 'sky130_fd_sc_hd__maj3_1', x: 9760, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b0)' },
  { id: '_33_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 5440, orient: 'N', func: 'SUM Stage (b1)' },
  { id: '_34_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b1)' },
  { id: '_35_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 5440, orient: 'N', func: 'SUM Stage (b2)' },
  { id: '_36_', type: 'sky130_fd_sc_hd__maj3_1', x: 20800, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b2)' },
  { id: '_37_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 5440, orient: 'N', func: 'SUM Stage (b3)' },
  { id: '_38_', type: 'sky130_fd_sc_hd__maj3_1', x: 26320, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b3)' },
  { id: '_39_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 5440, orient: 'N', func: 'SUM Stage (b4)' },
  { id: '_40_', type: 'sky130_fd_sc_hd__maj3_1', x: 31840, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b4)' },
  { id: '_41_', type: 'sky130_fd_sc_hd__xnor2_1', x: 34600, y: 5440, orient: 'N', func: 'SUM Stage (b5)' },
  { id: '_42_', type: 'sky130_fd_sc_hd__maj3_1', x: 7000, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b5)' },
  { id: '_43_', type: 'sky130_fd_sc_hd__xnor2_1', x: 9760, y: 8160, orient: 'FS', func: 'SUM Stage (b6)' },
  { id: '_44_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 8160, orient: 'FS', func: 'Propagate XOR (b6)' },
  { id: '_45_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b6)' },
  { id: '_46_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 8160, orient: 'FS', func: 'SUM Stage (b7)' },
  { id: '_47_', type: 'sky130_fd_sc_hd__maj3_1', x: 20800, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b7)' },
  { id: '_48_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 8160, orient: 'FS', func: 'SUM Stage (b8)' },
  { id: '_49_', type: 'sky130_fd_sc_hd__maj3_1', x: 26320, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b8)' },
  { id: '_50_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 8160, orient: 'FS', func: 'SUM Stage (b9)' },
  { id: '_51_', type: 'sky130_fd_sc_hd__xnor2_1', x: 31840, y: 8160, orient: 'FS', func: 'Propagate XOR (b9)' },
  { id: '_52_', type: 'sky130_fd_sc_hd__maj3_1', x: 34600, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b9)' },
  { id: '_53_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 10880, orient: 'N', func: 'SUM Stage (b10)' },
  { id: '_54_', type: 'sky130_fd_sc_hd__maj3_1', x: 9760, y: 10880, orient: 'N', func: 'Carry Generation Maj3 (b10)' },
  { id: '_55_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 10880, orient: 'N', func: 'SUM Stage (b11)' },
  { id: '_56_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 10880, orient: 'N', func: 'Carry Generation Maj3 (b11)' },
  { id: '_57_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 10880, orient: 'N', func: 'SUM Stage (b12)' },
  { id: '_58_', type: 'sky130_fd_sc_hd__xnor2_1', x: 20800, y: 10880, orient: 'N', func: 'Propagate XOR (b12)' },
  { id: '_59_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 10880, orient: 'N', func: 'SUM Stage (b13)' },
  { id: '_60_', type: 'sky130_fd_sc_hd__xnor2_1', x: 26320, y: 10880, orient: 'N', func: 'SUM Stage (b14)' },
  { id: '_61_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 10880, orient: 'N', func: 'SUM Stage (b15)' },
  { id: '_62_', type: 'sky130_fd_sc_hd__xnor2_1', x: 31840, y: 10880, orient: 'N', func: 'Propagate XOR (b15)' },
  { id: '_63_', type: 'sky130_fd_sc_hd__maj3_1', x: 34600, y: 10880, orient: 'N', func: 'Carry Generation Maj3 (b12)' },
  { id: '_64_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 13600, orient: 'FS', func: 'Inverter/Buffer Logic' },
  { id: '_65_', type: 'sky130_fd_sc_hd__xnor2_1', x: 9760, y: 13600, orient: 'FS', func: 'Carry Buffer' },
  { id: '_66_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 13600, orient: 'FS', func: 'Intermediate Propagate' },
  { id: '_67_', type: 'sky130_fd_sc_hd__xnor2_1', x: 15280, y: 13600, orient: 'FS', func: 'Intermediate Sum' },
  { id: '_68_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 13600, orient: 'FS', func: 'Intermediate Carry' },
  { id: '_69_', type: 'sky130_fd_sc_hd__xnor2_1', x: 20800, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_70_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_71_', type: 'sky130_fd_sc_hd__xnor2_1', x: 26320, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_72_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_73_', type: 'sky130_fd_sc_hd__xnor2_1', x: 31840, y: 13600, orient: 'FS', func: 'Cout Buffer' },
  { id: '_74_', type: 'sky130_fd_sc_hd__maj3_1', x: 34600, y: 13600, orient: 'FS', func: 'Carry Generation Maj3 (b13)' },
  { id: '_75_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 16320, orient: 'N', func: 'Output Register Drive' },
  { id: '_76_', type: 'sky130_fd_sc_hd__maj3_1', x: 9760, y: 16320, orient: 'N', func: 'Carry Generation Maj3 (b14)' },
  { id: '_77_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 16320, orient: 'N', func: 'Final Sum Stage' },
  { id: '_78_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 16320, orient: 'N', func: 'Carry-Out Maj3 (C16)' }
]

export default function PhysicalDesignViewer() {
  const [selectedCell, setSelectedCell] = useState<any>(DEF_COMPONENTS[1])
  const [viewTab, setViewTab] = useState<'MAP' | 'DEF'>('MAP')
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [showPowerRing, setShowPowerRing] = useState<boolean>(true)
  const [showRows, setShowRows] = useState<boolean>(true)
  const [showLabels, setShowLabels] = useState<boolean>(true)

  // Die: 45000 x 35000 DBU (0.001 um/DBU) -> 45.0 x 35.0 um
  // Core: 35.0 x 24.5 um
  const dieW = 45000
  const dieH = 35000
  const scale = 0.016 * zoomLevel

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wide text-white glow-cyan flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#00F0FF]" />
              <span>SKYWATER 130NM ASIC PHYSICAL IMPLEMENTATION</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Standard Cell Placement • Floorplan Geometry • DEF Database • GDSII Stream Format
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-[#00DF72]/15 border border-[#00DF72]/40 text-[#00DF72] rounded-lg font-bold flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>GDSII GENERATED (4.09 MB)</span>
            </span>

            <div className="flex items-center bg-[#070D1A] rounded-lg p-0.5 border border-[#1E293B]">
              <button
                onClick={() => setViewTab('MAP')}
                className={`px-3 py-1 rounded transition text-xs font-bold ${
                  viewTab === 'MAP'
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                LAYOUT MAP
              </button>
              <button
                onClick={() => setViewTab('DEF')}
                className={`px-3 py-1 rounded transition text-xs font-bold ${
                  viewTab === 'DEF'
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                DEF SOURCE
              </button>
            </div>
          </div>
        </div>

        {/* View Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">DISPLAY LAYERS:</span>
            <button
              onClick={() => setShowPowerRing(!showPowerRing)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 ${
                showPowerRing
                  ? 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/40'
                  : 'bg-[#090F1E] text-[#64748B] border-[#1E293B]'
              }`}
            >
              <span>VDD/VSS POWER RINGS</span>
            </button>
            <button
              onClick={() => setShowRows(!showRows)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 ${
                showRows
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40'
                  : 'bg-[#090F1E] text-[#64748B] border-[#1E293B]'
              }`}
            >
              <span>STANDARD CELL ROWS</span>
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 ${
                showLabels
                  ? 'bg-[#00DF72]/15 text-[#00DF72] border-[#00DF72]/40'
                  : 'bg-[#090F1E] text-[#64748B] border-[#1E293B]'
              }`}
            >
              <span>CELL LABELS</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 rounded bg-[#070D1A] border border-[#1E293B] text-[#94A3B8] hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-white font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
              className="p-1.5 rounded bg-[#070D1A] border border-[#1E293B] text-[#94A3B8] hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      {viewTab === 'MAP' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive SVG Placement Canvas */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#1E293B] flex flex-col items-center justify-center relative overflow-hidden bg-[#040711]">
            <div className="text-[11px] font-bold text-[#00F0FF] self-start mb-3 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
              <span>SYNTHESIZED 48-CELL PLACEMENT MAP (DIE: 45.0 × 35.0 µm)</span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="w-full overflow-auto flex items-center justify-center p-4">
              <svg
                width={dieW * scale}
                height={dieH * scale}
                viewBox={`0 0 ${dieW} ${dieH}`}
                className="bg-[#070D1A] rounded-xl border-2 border-[#00F0FF]/40 shadow-2xl transition-all"
              >
                {/* Die Boundary */}
                <rect
                  x="0"
                  y="0"
                  width={dieW}
                  height={dieH}
                  fill="#070D1A"
                  stroke="#00F0FF"
                  strokeWidth="600"
                />

                {/* VDD / VSS Power Rings (Metal 4 & Metal 5 Outer Strap) */}
                {showPowerRing && (
                  <g>
                    {/* VDD Outer Ring */}
                    <rect
                      x="1800"
                      y="1800"
                      width={dieW - 3600}
                      height={dieH - 3600}
                      fill="none"
                      stroke="#FB923C"
                      strokeWidth="800"
                      strokeDasharray="2000, 1000"
                      opacity="0.85"
                    />
                    {/* VSS Inner Ring */}
                    <rect
                      x="3200"
                      y="3200"
                      width={dieW - 6400}
                      height={dieH - 6400}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="800"
                      strokeDasharray="2000, 1000"
                      opacity="0.85"
                    />
                  </g>
                )}

                {/* Core Area Boundary (Dashed Orange) */}
                <rect
                  x="5000"
                  y="4500"
                  width="35000"
                  height="25000"
                  fill="none"
                  stroke="#FF7A00"
                  strokeWidth="400"
                  strokeDasharray="1200, 800"
                  opacity="0.75"
                />

                {/* Standard Cell Rows */}
                {showRows && (
                  <g>
                    {[5440, 8160, 10880, 13600, 16320, 19040, 21760, 24480, 27200].map((ry, rIdx) => (
                      <line
                        key={rIdx}
                        x1="5000"
                        y1={ry}
                        x2="40000"
                        y2={ry}
                        stroke="#1E293B"
                        strokeWidth="150"
                        strokeDasharray="500, 500"
                      />
                    ))}
                  </g>
                )}

                {/* The 48 Standard Cells */}
                {DEF_COMPONENTS.map((cell) => {
                  const isMaj = cell.type.includes('maj3')
                  const isSel = selectedCell?.id === cell.id
                  const fillColor = isMaj ? '#FF7A00' : '#00F0FF'
                  const w = isMaj ? 2400 : 2200
                  const h = 2500

                  return (
                    <g
                      key={cell.id}
                      onClick={() => setSelectedCell(cell)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={cell.x}
                        y={cell.y}
                        width={w}
                        height={h}
                        fill={fillColor}
                        fillOpacity={isSel ? 0.95 : 0.65}
                        stroke={isSel ? '#FFFFFF' : isMaj ? '#FFAA33' : '#38BDF8'}
                        strokeWidth={isSel ? '600' : '200'}
                        rx="300"
                      />
                      {showLabels && (
                        <text
                          x={cell.x + w / 2}
                          y={cell.y + h / 2 + 300}
                          fill="#030712"
                          fontSize="950"
                          fontWeight="bold"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {isMaj ? 'MAJ' : 'XNR'}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Layout Legend */}
            <div className="w-full flex flex-wrap items-center justify-between text-[11px] text-[#94A3B8] pt-4 border-t border-[#1E293B] gap-3">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#FF7A00]"></span>
                  <span>maj3_1 (Majority Carry)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#00F0FF]"></span>
                  <span>xnor2_1 (Sum & Propagate)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm border border-dashed border-[#FF7A00]"></span>
                  <span>Core Boundary</span>
                </span>
              </div>
              <span className="text-[#00F0FF]">Row Pitch: 2.72 µm</span>
            </div>
          </div>

          {/* Cell & Layout Inspector */}
          <div className="space-y-4">
            {/* Selected Cell Inspector */}
            <div className="glass-panel p-5 rounded-xl border border-[#00F0FF]/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Box className="w-4 h-4 text-[#00F0FF]" />
                  <span>STANDARD CELL INSPECTOR</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-bold">
                  {selectedCell?.id || 'SELECT CELL'}
                </span>
              </div>

              {selectedCell ? (
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Cell Instance:</span>
                    <span className="text-white font-bold">{selectedCell.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Master Type:</span>
                    <span className="text-[#00F0FF] font-bold break-all">{selectedCell.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Function:</span>
                    <span className="text-[#00DF72] font-bold">{selectedCell.func}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Coordinates (X, Y):</span>
                    <span className="text-white font-bold">
                      {selectedCell.x / 1000} µm, {selectedCell.y / 1000} µm
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Orientation:</span>
                    <span className="text-white font-bold">{selectedCell.orient === 'N' ? 'North (N)' : 'Flip-South (FS)'}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#94A3B8]">Row Location:</span>
                    <span className="text-[#FF7A00] font-bold">Row Y={selectedCell.y / 1000} µm</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-[#64748B]">Click any standard cell on the layout map to inspect.</div>
              )}
            </div>

            {/* ASIC Physical Specifications */}
            <div className="glass-panel p-5 rounded-xl border border-[#1E293B] space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 pb-2 border-b border-[#1E293B]">
                <HardDrive className="w-4 h-4 text-[#00DF72]" />
                <span>PHYSICAL IMPLEMENTATION SPECS</span>
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Technology Node:</span>
                  <span className="text-white font-bold">SkyWater 130nm</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Standard Cell Lib:</span>
                  <span className="text-white font-bold">sky130_fd_sc_hd</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Die Area:</span>
                  <span className="text-[#00F0FF] font-bold">45.0 × 35.0 µm (1,575 µm²)</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Core Area:</span>
                  <span className="text-white font-bold">35.0 × 24.5 µm (856.8 µm²)</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Cell Count (Flattened):</span>
                  <span className="text-white font-bold">48 cells placed</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Row Pitch:</span>
                  <span className="text-white font-bold">2.72 µm</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#94A3B8]">GDSII Stream File:</span>
                  <span className="text-[#FF7A00] font-bold">cska_16bit.gds (4.09 MB)</span>
                </div>
              </div>

              {/* Physical Limitations Honest Disclosure */}
              <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#00F0FF]/20 text-[10px] text-[#64748B] flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                <span>
                  Physical GDS is standard-cell placement. Detailed routing and signoff DRC/LVS were not completed due to OpenROAD Windows environment constraints.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DEF Source Viewer */
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <span className="text-xs font-bold text-white flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-[#00F0FF]" />
              <span>DEF FILE SOURCE (cska_sky130.def)</span>
            </span>
            <span className="text-[10px] text-[#64748B]">DESIGN: carry_skip_adder • UNITS 1000</span>
          </div>

          <pre className="p-4 rounded-xl bg-[#040812] border border-[#1E293B] overflow-auto max-h-[500px] text-[11px] text-[#94A3B8] font-mono leading-relaxed">
{`VERSION 5.8 ;
DIVIDERCHAR "/" ;
BUSBITCHARS "[]" ;
DESIGN carry_skip_adder ;
UNITS DISTANCE MICRONS 1000 ;
DIEAREA ( 0 0 ) ( 45000 35000 ) ;

ROW ROW_0 unithd 5000 5440 N DO 76 BY 1 STEP 460 0 ;
ROW ROW_1 unithd 5000 8160 FS DO 76 BY 1 STEP 460 0 ;
ROW ROW_2 unithd 5000 10880 N DO 76 BY 1 STEP 460 0 ;
ROW ROW_3 unithd 5000 13600 FS DO 76 BY 1 STEP 460 0 ;
ROW ROW_4 unithd 5000 16320 N DO 76 BY 1 STEP 460 0 ;
ROW ROW_5 unithd 5000 19040 FS DO 76 BY 1 STEP 460 0 ;

COMPONENTS 48 ;
- _31_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 7000 5440 ) N ;
- _32_ sky130_fd_sc_hd__maj3_1 + PLACED ( 9760 5440 ) N ;
- _33_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 12520 5440 ) N ;
- _34_ sky130_fd_sc_hd__maj3_1 + PLACED ( 15280 5440 ) N ;
- _35_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 18040 5440 ) N ;
- _36_ sky130_fd_sc_hd__maj3_1 + PLACED ( 20800 5440 ) N ;
- _37_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 23560 5440 ) N ;
- _38_ sky130_fd_sc_hd__maj3_1 + PLACED ( 26320 5440 ) N ;
- _39_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 29080 5440 ) N ;
- _40_ sky130_fd_sc_hd__maj3_1 + PLACED ( 31840 5440 ) N ;
- _41_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 34600 5440 ) N ;
- _42_ sky130_fd_sc_hd__maj3_1 + PLACED ( 7000 8160 ) FS ;
- _43_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 9760 8160 ) FS ;
- _44_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 12520 8160 ) FS ;
- _45_ sky130_fd_sc_hd__maj3_1 + PLACED ( 15280 8160 ) FS ;
- _46_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 18040 8160 ) FS ;
- _47_ sky130_fd_sc_hd__maj3_1 + PLACED ( 20800 8160 ) FS ;
- _48_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 23560 8160 ) FS ;
- _49_ sky130_fd_sc_hd__maj3_1 + PLACED ( 26320 8160 ) FS ;
- _50_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 29080 8160 ) FS ;
- _51_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 31840 8160 ) FS ;
- _52_ sky130_fd_sc_hd__maj3_1 + PLACED ( 34600 8160 ) FS ;
... [48 standard cell components total]
END COMPONENTS
END DESIGN`}
          </pre>
        </div>
      )}
    </div>
  )
}
