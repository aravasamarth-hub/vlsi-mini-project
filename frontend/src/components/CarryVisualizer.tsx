import React from 'react'
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Info,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react'

interface CarryVisualizerProps {
  telemetry: any
  activeBlock: number | null
  onSelectBlock: (id: number) => void
}

export default function CarryVisualizer({
  telemetry,
  activeBlock,
  onSelectBlock
}: CarryVisualizerProps) {
  if (!telemetry || !telemetry.blocks) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center font-mono text-sm border border-[#1E293B] text-[#64748B] space-y-3">
        <Zap className="w-8 h-8 text-[#FF7A00] mx-auto animate-bounce" />
        <div className="text-white font-bold">Awaiting Simulation Telemetry</div>
        <div>Please execute a simulation in the Adder Simulator to view real-time carry routing signals.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-6 border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wide text-white glow-cyan flex items-center space-x-2">
              <Zap className="w-5 h-5 text-[#FF7A00]" />
              <span>4-BLOCK CARRY-SKIP ROUTING SCHEMATIC</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Dynamic hardware signal paths resolved directly from 16-bit operand propagate bits
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-[#00F0FF]">
              <span className="w-3 h-3 rounded-full bg-[#00F0FF]"></span>
              <span>Ripple Carry Chain (t_ripple = 4 · t_FA)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#FF7A00]">
              <span className="w-3 h-3 rounded-full bg-[#FF7A00] animate-pulse"></span>
              <span>Skip Bypass Highway (t_skip = t_AND4 + t_MUX)</span>
            </span>
          </div>
        </div>

        {/* Global Carry Propagation Highway Overview */}
        <div className="p-4 rounded-xl bg-[#070D1A] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">GLOBAL CARRY-IN (Cin):</span>
            <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-bold border border-[#00F0FF]/30">
              Cin = {telemetry.Cin}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            {telemetry.blocks.map((b: any, idx: number) => (
              <span
                key={idx}
                className={`flex items-center space-x-1 font-bold ${
                  b.skip_active ? 'text-[#FF7A00]' : 'text-[#00F0FF]'
                }`}
              >
                <span>BLK{idx}: {b.skip_active ? '⚡SKIP' : '🔗RIPPLE'}</span>
                {idx < 3 && <ArrowRight className="w-3 h-3 text-[#64748B]" />}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">GLOBAL CARRY-OUT (Cout):</span>
            <span
              className={`px-2 py-0.5 rounded font-bold border ${
                telemetry.Cout
                  ? 'bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/40'
                  : 'bg-[#00DF72]/15 text-[#00DF72] border-[#00DF72]/30'
              }`}
            >
              Cout = {telemetry.Cout}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {telemetry.blocks.map((b: any) => {
          const isSelected = activeBlock === b.block_id
          const isSkip = b.path_used.includes('SKIP')
          const borderColor = isSkip ? 'border-[#FF7A00]' : 'border-[#00F0FF]/35'
          const bgGlow = isSkip ? 'bg-[#FF7A00]/5' : 'bg-[#00F0FF]/5'

          return (
            <div
              key={b.block_id}
              onClick={() => onSelectBlock(b.block_id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all glass-panel ${borderColor} ${bgGlow} ${
                isSelected
                  ? 'ring-2 ring-[#00F0FF] shadow-2xl shadow-[#00F0FF]/20 scale-[1.02]'
                  : 'hover:border-[#00F0FF]/60 hover:scale-[1.01]'
              }`}
            >
              {/* Block Header */}
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#1E293B]">
                <div>
                  <span className="text-sm font-bold text-white glow-cyan">
                    BLOCK {b.block_id}
                  </span>
                  <span className="text-[10px] text-[#64748B] block">
                    BITS [{b.bit_range}]
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSkip
                      ? 'bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/40'
                      : 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30'
                  }`}
                >
                  {isSkip ? '⚡ BYPASS PATH' : '🔗 RIPPLE CHAIN'}
                </span>
              </div>

              {/* Carry Path Visualization Box */}
              <div className="my-4 p-3 rounded-xl bg-[#050811] border border-[#1E293B] relative overflow-hidden space-y-3">
                {/* Skip Bypass Highway Line */}
                <div
                  className={`p-2 rounded-lg border flex items-center justify-between text-[11px] transition ${
                    isSkip
                      ? 'bg-[#FF7A00]/15 border-[#FF7A00]/50 text-[#FF7A00] font-bold'
                      : 'border-[#1E293B] text-[#64748B] opacity-40'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Skip Highway (Cin → MUX)</span>
                  </span>
                  <span>{isSkip ? 'ACTIVE' : 'OFF'}</span>
                </div>

                {/* 4 Cascaded Full Adders Sub-Graphic */}
                <div className="space-y-1">
                  <div className="text-[9px] text-[#64748B] uppercase">Internal Ripple Chain:</div>
                  <div className="grid grid-cols-4 gap-1">
                    {b.p_bits.map((pBit: number, faIdx: number) => {
                      const bitNum = b.block_id * 4 + faIdx
                      return (
                        <div
                          key={faIdx}
                          className={`p-1.5 rounded text-center border text-[9px] ${
                            pBit
                              ? 'bg-[#00F0FF]/10 border-[#00F0FF]/40 text-[#00F0FF]'
                              : 'bg-[#090F1E] border-[#1E293B] text-[#64748B]'
                          }`}
                        >
                          <div className="font-bold">FA{faIdx}</div>
                          <div className="text-[8px] opacity-75">b{bitNum}</div>
                          <div className="font-bold mt-0.5">P={pBit}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 4-Input AND & 2:1 MUX Indicators */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div
                    className={`p-2 rounded border text-center ${
                      b.p_group
                        ? 'bg-[#00DF72]/15 border-[#00DF72]/40 text-[#00DF72] font-bold'
                        : 'bg-[#090F1E] border-[#1E293B] text-[#64748B]'
                    }`}
                  >
                    <span>AND4 (P_grp)</span>
                    <div className="text-xs font-bold mt-0.5">{b.p_group ? '1' : '0'}</div>
                  </div>

                  <div
                    className={`p-2 rounded border text-center ${
                      isSkip
                        ? 'bg-[#FF7A00]/15 border-[#FF7A00]/40 text-[#FF7A00] font-bold'
                        : 'bg-[#00F0FF]/15 border-[#00F0FF]/30 text-[#00F0FF] font-bold'
                    }`}
                  >
                    <span>MUX2:1 Sel</span>
                    <div className="text-xs font-bold mt-0.5">{isSkip ? '1 (Cin)' : '0 (Crip)'}</div>
                  </div>
                </div>
              </div>

              {/* Block Mathematical Telemetry */}
              <div className="space-y-1.5 text-xs text-[#94A3B8]">
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span>Hex Inputs (A/B):</span>
                  <span className="text-white font-bold">{b.a_hex} / {b.b_hex}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span>Block Carry-In:</span>
                  <span className="text-white font-bold">{b.cin}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/60 pb-1">
                  <span>Ripple Carry-Out:</span>
                  <span className="text-[#64748B]">{b.cout_ripple}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="font-bold text-white">Resolved Cout:</span>
                  <span className={`font-bold ${b.cout_actual ? 'text-[#FF7A00]' : 'text-white'}`}>
                    {b.cout_actual}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Analytical Carry-Skip Timing Equations */}
      <div className="glass-panel rounded-2xl p-6 border border-[#1E293B] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#00F0FF]" />
          <span>ANALYTICAL TIMING FORMULATION & DELAY MODEL</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#1E293B] space-y-1.5">
            <span className="text-[#00F0FF] font-bold block">RCA Critical Path</span>
            <div className="text-[#E2E8F0] font-mono text-[11px]">
              T_RCA = t_pg + 16 · t_carry
            </div>
            <p className="text-[10px] text-[#64748B]">
              Linear delay scaling with bit width N. Worst-case carries ripple through all 16 consecutive full adder stages.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#FF7A00]/30 space-y-1.5">
            <span className="text-[#FF7A00] font-bold block">CSKA Critical Path</span>
            <div className="text-[#E2E8F0] font-mono text-[11px]">
              T_CSKA = t_pg + (M - 1)·t_carry + (k - 2)·t_skip + M·t_carry
            </div>
            <p className="text-[10px] text-[#64748B]">
              For 4 uniform blocks (k=4, M=4): carry skips intermediate blocks via low-latency 2:1 multiplexers instead of rippling.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#00DF72]/30 space-y-1.5">
            <span className="text-[#00DF72] font-bold block">Sky130 Synthesis Status</span>
            <div className="text-[#E2E8F0] font-mono text-[11px]">
              Hierarchical Synth: 2.471 ns (56 cells)
            </div>
            <p className="text-[10px] text-[#64748B]">
              Hardware skip bypass survives when submodules are preserved. Flattened unconstrained synthesis collapses to 48 cells.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
