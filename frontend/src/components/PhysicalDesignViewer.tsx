import React from 'react'
import { Layers, HardDrive, Download, CheckCircle, ExternalLink } from 'lucide-react'

export default function PhysicalDesignViewer() {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wide text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#00F0FF]" />
              <span>SKYWATER 130NM ASIC PHYSICAL IMPLEMENTATION</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Standard Cell Placement • Floorplanning • DEF Database • GDSII Stream Format
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[#00DF72]/15 border border-[#00DF72]/40 text-[#00DF72] rounded text-xs font-mono font-bold flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>GDSII GENERATED (4.09 MB)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          {/* Layout Diagram / Image */}
          <div className="lg:col-span-2 bg-[#050B14] p-4 rounded-xl border border-[#1E293B] flex flex-col items-center justify-center">
            <div className="text-xs font-mono text-[#00F0FF] self-start mb-3 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF]"></span>
              <span>SYNTHESIZED 48-CELL PLACEMENT MAP (DIE: 45.0 × 35.0 µm)</span>
            </div>
            
            <div className="w-full max-w-xl aspect-[45/35] bg-[#070D1A] rounded-lg border border-[#00F0FF]/40 relative overflow-hidden p-6 flex flex-col justify-between shadow-2xl shadow-[#00F0FF]/10">
              {/* Die Border */}
              <div className="absolute inset-2 border-2 border-[#00F0FF]/60 rounded pointer-events-none">
                <span className="absolute top-1 left-2 text-[10px] font-mono text-[#00F0FF]">DIE: 45.0 × 35.0 µm</span>
              </div>
              
              {/* Core Border */}
              <div className="absolute inset-8 border border-dashed border-[#FF7A00]/70 rounded pointer-events-none">
                <span className="absolute bottom-1 right-2 text-[10px] font-mono text-[#FF7A00]">CORE: 35.0 × 24.5 µm</span>
              </div>

              {/* Standard Cell Placement Rows */}
              <div className="relative z-10 grid grid-rows-6 gap-2 h-full my-6 px-10">
                {[...Array(6)].map((_, rIdx) => (
                  <div key={rIdx} className="flex items-center space-x-1.5 border-b border-[#1E293B]/40 pb-0.5">
                    {[...Array(8)].map((_, cIdx) => {
                      const isCarry = (rIdx + cIdx) % 3 === 0
                      const color = isCarry ? 'bg-[#FF7A00]' : 'bg-[#00F0FF]'
                      return (
                        <div
                          key={cIdx}
                          title={isCarry ? 'sky130_fd_sc_hd__maj3_1 (Carry)' : 'sky130_fd_sc_hd__xnor2_1 (Sum)'}
                          className={`h-4 flex-1 rounded-sm ${color} opacity-80 hover:opacity-100 hover:scale-110 transition shadow-sm`}
                        ></div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend in Layout */}
              <div className="relative z-10 flex justify-between text-[10px] font-mono text-[#94A3B8] px-2 pt-2 border-t border-[#1E293B]">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF7A00]"></span>
                  <span>maj3_1 (Carry Logic)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#00F0FF]"></span>
                  <span>xnor2_1 (Sum Logic)</span>
                </span>
                <span>Pitch: 2.72 µm</span>
              </div>
            </div>
          </div>

          {/* Implementation Specifications Card */}
          <div className="space-y-4">
            <div className="glass-card p-4.5 border border-[#1E293B]">
              <h4 className="text-xs font-mono font-bold text-[#00F0FF] mb-3">PHYSICAL SPECIFICATIONS</h4>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                  <span className="text-[#94A3B8]">Process Node:</span>
                  <span className="text-white">SkyWater 130nm</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                  <span className="text-[#94A3B8]">Standard Cell Lib:</span>
                  <span className="text-white">sky130_fd_sc_hd</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                  <span className="text-[#94A3B8]">Die Area:</span>
                  <span className="text-white">1,575.0 µm²</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                  <span className="text-[#94A3B8]">Core Area:</span>
                  <span className="text-white">856.8 µm²</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                  <span className="text-[#94A3B8]">Standard Cell Rows:</span>
                  <span className="text-white">9 Rows (2.72 µm pitch)</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                  <span className="text-[#94A3B8]">Total Placed Cells:</span>
                  <span className="text-[#00DF72] font-bold">48 Instances</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">GDS File Size:</span>
                  <span className="text-[#00F0FF]">4,189,882 bytes</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4.5 border border-[#1E293B]">
              <h4 className="text-xs font-mono font-bold text-[#FF7A00] mb-2">KLAYOUT INSPECTION</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
                KLayout 0.30.12 is verified and configured on this workstation with SkyWater 130nm layer properties (`sky130hd.lyp`).
              </p>
              <div className="text-[11px] font-mono text-[#64748B] bg-[#05070E] p-2 rounded border border-[#1E293B]">
                klayout_app.exe physical_design/gds/cska_sky130.gds -l synthesis/sky130_pdk/sky130hd.lyp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

