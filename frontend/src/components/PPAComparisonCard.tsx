import React from 'react'
import { Info, BarChart3, TrendingUp } from 'lucide-react'

export default function PPAComparisonCard() {
  const architectures = [
    { name: 'RCA', area: '440.42', delay: '3.957', power: '0.117', adp: '1743.4', isHier: false },
    { name: 'CSKA (Hier.)', area: '760.73', delay: '2.471', power: '0.142', adp: '1879.6', isHier: true },
    { name: 'CSKA (Flat)', area: '440.42', delay: '3.957', power: '0.122', adp: '1743.4', isHier: false },
    { name: 'CLA', area: '580.12', delay: '2.120', power: '0.165', adp: '1229.8', isHier: false },
    { name: 'Brent-Kung', area: '620.50', delay: '1.950', power: '0.180', adp: '1209.9', isHier: false }
  ]

  return (
    <div className="glass-panel p-5 rounded-2xl border border-[#00F0FF]/30 shadow-2xl font-mono text-xs flex flex-col justify-between space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-[#00F0FF]" />
          <span className="font-bold text-white tracking-wider text-sm glow-cyan">
            PPA COMPARISON (ANALYTICAL)
          </span>
        </div>
        <div title="Analytical estimates derived from Liberty cell-delay models & gate areas" className="cursor-pointer">
          <Info className="w-4 h-4 text-[#64748B] hover:text-[#00F0FF] transition" />
        </div>
      </div>

      {/* High-Contrast Analytical Comparison Table (Reference 1) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1E293B] text-[10px] text-[#64748B] uppercase">
              <th className="py-2 px-2 font-bold">Architecture</th>
              <th className="py-2 px-2 font-bold">Area (µm²)</th>
              <th className="py-2 px-2 font-bold">Delay (ns)</th>
              <th className="py-2 px-2 font-bold">Power (mW)</th>
              <th className="py-2 px-2 font-bold">ADP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/50 text-[11px]">
            {architectures.map((arch, idx) => {
              const isHighlight = arch.isHier
              return (
                <tr
                  key={idx}
                  className={`transition ${
                    isHighlight
                      ? 'bg-[#00F0FF]/10 text-white font-bold border-l-2 border-[#00F0FF]'
                      : 'hover:bg-[#0E1626] text-[#CBD5E1]'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center space-x-1.5">
                    {isHighlight && <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></span>}
                    <span>{arch.name}</span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[#94A3B8]">{arch.area}</td>
                  <td className={`py-2.5 px-2 font-mono ${isHighlight ? 'text-[#00F0FF]' : 'text-white'}`}>
                    {arch.delay}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[#94A3B8]">{arch.power}</td>
                  <td className={`py-2.5 px-2 font-mono font-bold ${isHighlight ? 'text-[#00DF72]' : 'text-[#CBD5E1]'}`}>
                    {arch.adp}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Explanatory Academic Tagline */}
      <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-[#64748B]">
        <span>Technology: SkyWater 130nm HD</span>
        <span className="text-[#00DF72] flex items-center space-x-1 font-bold">
          <TrendingUp className="w-3 h-3" />
          <span>CSKA 37.5% Faster than RCA</span>
        </span>
      </div>
    </div>
  )
}
