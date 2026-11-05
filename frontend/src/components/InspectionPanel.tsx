import React from 'react'
import {
  Cpu,
  Layers,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle,
  Activity,
  Sliders,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react'

interface InspectionPanelProps {
  activeBlock: number | null
  onSelectBlock: (id: number) => void
  telemetry: any
  simulating: boolean
}

export default function InspectionPanel({
  activeBlock,
  onSelectBlock,
  telemetry,
  simulating
}: InspectionPanelProps) {
  const currentBlockId = activeBlock !== null ? activeBlock : 0
  const blockData = telemetry?.blocks?.[currentBlockId]
  const isSkipActive = Boolean(blockData?.skip_active)

  return (
    <div className="w-full lg:w-96 flex flex-col space-y-4 font-mono text-xs">
      {/* Block Inspector Card */}
      <div className="glass-panel p-4 rounded-xl border border-[#00F0FF]/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-bold text-white tracking-wider">BLOCK INSPECTOR</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
            STAGE {currentBlockId + 1} OF 4
          </span>
        </div>

        {/* Block Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#070D1A] rounded-lg border border-[#1E293B]">
          {[0, 1, 2, 3].map((bId) => {
            const b = telemetry?.blocks?.[bId]
            const isBypass = b?.skip_active
            const isSel = activeBlock === bId
            return (
              <button
                key={bId}
                onClick={() => onSelectBlock(bId)}
                className={`py-1.5 rounded transition text-center flex flex-col items-center justify-center ${
                  isSel
                    ? 'bg-[#00F0FF] text-black font-bold shadow-md shadow-[#00F0FF]/25'
                    : isBypass
                    ? 'bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40 font-bold'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                }`}
              >
                <span className="text-[10px]">BLK {bId}</span>
                <span className="text-[8px] opacity-80">{`[${bId * 4 + 3}:${bId * 4}]`}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Block Real-Time Data */}
        {blockData ? (
          <div className="space-y-2.5 pt-1">
            {/* Path Selection Status Banner */}
            <div
              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isSkipActive
                  ? 'bg-[#FF7A00]/10 border-[#FF7A00]/40 text-[#FF7A00]'
                  : 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="font-bold">
                  {isSkipActive ? 'SKIP PATH ACTIVATED' : 'RIPPLE PATH ACTIVE'}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-bold">
                {isSkipActive ? 'MUX SEL = 1' : 'MUX SEL = 0'}
              </span>
            </div>

            {/* Signal Telemetry Matrix */}
            <div className="bg-[#060B14] p-3 rounded-lg border border-[#1E293B] space-y-2 text-[11px]">
              <div className="flex justify-between items-center border-b border-[#1E293B]/60 pb-1.5">
                <span className="text-[#94A3B8]">Operand Inputs:</span>
                <span className="text-white font-bold">
                  A={blockData.a_hex} • B={blockData.b_hex}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#1E293B]/60 pb-1.5">
                <span className="text-[#94A3B8]">Bit Propagates P[3:0]:</span>
                <span className="text-[#00F0FF] font-bold">
                  {blockData.p_bits ? blockData.p_bits.join(' ') : '---'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#1E293B]/60 pb-1.5">
                <span className="text-[#94A3B8]">Group Propagate (P_grp):</span>
                <span
                  className={`font-bold ${
                    blockData.p_group ? 'text-[#FF7A00]' : 'text-[#64748B]'
                  }`}
                >
                  {blockData.p_group ? '1 (AND4 TRUE)' : '0 (FALSE)'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#1E293B]/60 pb-1.5">
                <span className="text-[#94A3B8]">Block Carry-In (Cin):</span>
                <span className="text-white font-bold">{blockData.cin}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#1E293B]/60 pb-1.5">
                <span className="text-[#94A3B8]">Ripple Out (C_ripple):</span>
                <span className="text-[#64748B]">{blockData.cout_ripple}</span>
              </div>

              <div className="flex justify-between items-center pt-0.5">
                <span className="text-[#94A3B8]">Resolved Carry-Out (Cout):</span>
                <span
                  className={`text-base font-bold ${
                    blockData.cout_actual ? 'text-[#FF7A00]' : 'text-white'
                  }`}
                >
                  {blockData.cout_actual}
                </span>
              </div>
            </div>

            {/* Architecture Survival Note */}
            <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-[10px] text-[#94A3B8] leading-relaxed">
              <span className="text-[#00F0FF] font-bold block mb-0.5">
                RTL vs Netlist Topology Note:
              </span>
              In hierarchical synthesis, each 4-bit block preserves its 4 <code className="text-white">full_adder</code> cells, 1 <code className="text-[#00DF72]">and4_1</code> group gate, and 1 <code className="text-[#FF7A00]">mux2_1</code> bypass gate (56 cells total). In flattened unconstrained synthesis, ABC collapses the MUX into 48 majority-3 gates.
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-[#64748B]">Run simulation to populate block telemetry.</div>
        )}
      </div>

      {/* ASIC Physical Layout Overview Card */}
      <div className="glass-panel p-4 rounded-xl border border-[#1E293B] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#00DF72]" />
            <span className="font-bold text-white tracking-wider">LAYOUT & PDK OVERVIEW</span>
          </div>
          <span className="text-[10px] text-[#FF7A00] font-bold">PLACEMENT-ONLY GDSII (CUSTOM SCRIPTS)</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Process Node:</span>
            <span className="text-white font-bold">SkyWater 130nm</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Standard Cell Lib:</span>
            <span className="text-white font-bold">sky130_fd_sc_hd</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Die Dimensions:</span>
            <span className="text-[#00F0FF] font-bold">45.0 µm × 35.0 µm (1,575 µm²)</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Core Dimensions:</span>
            <span className="text-white font-bold">35.0 µm × 24.5 µm (856.8 µm²)</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Cell Count (Hierarchical):</span>
            <span className="text-[#00DF72] font-bold">56 cells (Preserved Bypass)</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Cell Count (Flattened):</span>
            <span className="text-[#64748B]">48 cells (ABC Optimized)</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Row Count / Height:</span>
            <span className="text-white">6 rows / 2.72 µm pitch</span>
          </div>
          <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
            <span className="text-[#94A3B8]">Verified Test Vectors:</span>
            <span className="text-[#00DF72] font-bold">60,038 (100% Pass)</span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span className="text-[#94A3B8]">GDSII Stream File:</span>
            <span className="text-[#FF7A00] font-bold">cska_16bit.gds (4.09 MB)</span>
          </div>
        </div>

        {/* Academic Transparency Alert */}
        <div className="p-2 rounded bg-[#090F1E] border border-[#00F0FF]/20 text-[10px] text-[#64748B] flex items-start space-x-2">
          <Info className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
          <span>
            Physical GDSII is standard-cell placement. Detailed routing & signoff DRC/LVS are documented as physical-design academic limitations.
          </span>
        </div>
      </div>
    </div>
  )
}

