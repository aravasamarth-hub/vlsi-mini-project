import React from 'react'
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react'

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
      <div className="glass-panel rounded-xl p-8 text-center text-[#64748B] font-mono text-sm">
        Run simulation to load Carry Skip telemetry data.
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-wide text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#FF7A00]" />
            <span>4-BLOCK CARRY SKIP ROUTING TELEMETRY</span>
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Equation: Pgroup = P3·P2·P1·P0 • Cout = Pgroup ? Cin : C_ripple
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center space-x-1.5 text-[#00F0FF]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]"></span>
            <span>Ripple Path</span>
          </span>
          <span className="flex items-center space-x-1.5 text-[#FF7A00]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]"></span>
            <span>Skip Bypass Path</span>
          </span>
        </div>
      </div>

      {/* 4 Block Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {telemetry.blocks.map((b: any) => {
          const isSelected = activeBlock === b.block_id
          const isSkip = b.path_used.includes('SKIP')
          const borderColor = isSkip ? 'border-[#FF7A00]' : 'border-[#00F0FF]/40'
          const bgGlow = isSkip ? 'bg-[#FF7A00]/5' : 'bg-[#00F0FF]/5'

          return (
            <div
              key={b.block_id}
              onClick={() => onSelectBlock(b.block_id)}
              className={`cursor-pointer rounded-xl p-4.5 border transition-all ${borderColor} ${bgGlow} ${
                isSelected ? 'ring-2 ring-[#00F0FF] shadow-lg shadow-[#00F0FF]/20' : 'hover:border-[#00F0FF]'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-mono font-bold text-white">
                  BLOCK {b.block_id}
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">
                  BITS {b.bit_range}
                </span>
              </div>

              {/* Path Decision Badge */}
              <div className="mb-4">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded inline-block ${
                    isSkip
                      ? 'bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/50'
                      : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                  }`}
                >
                  {b.path_used}
                </span>
              </div>

              {/* Logic Telemetry */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Inputs A/B:</span>
                  <span className="text-white">{b.a_hex} / {b.b_hex}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>P[3:0] Bits:</span>
                  <span className="text-[#00F0FF]">{b.p_bits.join('')}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>P_group:</span>
                  <span className={b.p_group ? 'text-[#FF7A00] font-bold' : 'text-[#64748B]'}>
                    {b.p_group ? '1 (ACTIVE)' : '0 (OFF)'}
                  </span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Block Cin:</span>
                  <span className="text-white font-bold">{b.cin}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Ripple Cout:</span>
                  <span className="text-[#00F0FF]">{b.cout_ripple}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8] pt-1.5 border-t border-[#1E293B]">
                  <span>Actual Cout:</span>
                  <span className={`font-bold ${isSkip ? 'text-[#FF7A00]' : 'text-[#00F0FF]'}`}>
                    {b.cout_actual}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Boundary Carry Chain Pipeline */}
      <div className="bg-[#050B14] p-4 rounded-xl border border-[#1E293B]">
        <div className="text-xs font-mono text-[#64748B] mb-2 uppercase">Inter-Block Carry Pipeline:</div>
        <div className="flex items-center justify-between overflow-x-auto py-1 text-xs font-mono">
          <div className="flex items-center space-x-1 bg-[#0F172A] px-3 py-1.5 rounded border border-[#1E293B]">
            <span className="text-[#64748B]">Cin (C0):</span>
            <span className="text-white font-bold">{telemetry.block_carries[0]}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
          <div className="flex items-center space-x-1 bg-[#0F172A] px-3 py-1.5 rounded border border-[#1E293B]">
            <span className="text-[#64748B]">C4:</span>
            <span className="text-[#00F0FF] font-bold">{telemetry.block_carries[1]}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
          <div className="flex items-center space-x-1 bg-[#0F172A] px-3 py-1.5 rounded border border-[#1E293B]">
            <span className="text-[#64748B]">C8:</span>
            <span className="text-[#00F0FF] font-bold">{telemetry.block_carries[2]}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
          <div className="flex items-center space-x-1 bg-[#0F172A] px-3 py-1.5 rounded border border-[#1E293B]">
            <span className="text-[#64748B]">C12:</span>
            <span className="text-[#00F0FF] font-bold">{telemetry.block_carries[3]}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
          <div className="flex items-center space-x-1 bg-[#0F172A] px-3 py-1.5 rounded border border-[#FF7A00]/40">
            <span className="text-[#64748B]">Cout (C16):</span>
            <span className="text-[#FF7A00] font-bold">{telemetry.block_carries[4]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

