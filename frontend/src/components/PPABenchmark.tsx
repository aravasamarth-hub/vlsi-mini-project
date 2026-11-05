import React, { useState } from 'react'
import { TrendingUp, Clock, Box, Zap, BarChart3, CheckCircle2, Sliders } from 'lucide-react'

export default function PPABenchmark() {
  const [activeTab, setActiveTab] = useState<'hierarchical' | 'theoretical' | 'flattened'>('hierarchical')

  const hierarchicalData = [
    {
      arch: 'RCA',
      name: 'Ripple Carry Adder',
      delay: 4.24,
      area: 540.52,
      cells: 32,
      power: 0.117,
      adp: 2291.8,
      speedup: 0.0,
      highlight: false,
      notes: '16 full_adder submodules preserved'
    },
    {
      arch: 'CSKA',
      name: 'Carry Skip Adder (Hierarchical Netlist)',
      delay: 2.471,
      area: 760.73,
      cells: 56,
      power: 0.122,
      adp: 1879.8,
      speedup: 41.7,
      highlight: true,
      notes: 'Preserves 4 mux2_1 + 4 and4_1 bypass gates'
    },
    {
      arch: 'CLA',
      name: 'Carry Look-Ahead Adder',
      delay: 3.112,
      area: 479.21,
      cells: 65,
      power: 0.151,
      adp: 1491.3,
      speedup: 26.6,
      highlight: false,
      notes: 'Look-ahead generate/propagate tree'
    },
    {
      arch: 'CSLA',
      name: 'Carry Select Adder',
      delay: 3.957,
      area: 440.42,
      cells: 48,
      power: 0.156,
      adp: 1742.7,
      speedup: 6.7,
      highlight: false,
      notes: 'Dual-speculative ripple chains'
    },
    {
      arch: 'BK',
      name: 'Brent-Kung Prefix Adder',
      delay: 2.227,
      area: 506.74,
      cells: 77,
      power: 0.165,
      adp: 1128.5,
      speedup: 47.5,
      highlight: false,
      notes: 'Prefix operator tree netlist'
    }
  ]

  const theoreticalData = [
    {
      arch: 'RCA',
      name: 'Ripple Carry Adder',
      delay: 3.92,
      area: 440.42,
      cells: 48,
      power: 0.117,
      adp: 1726.5,
      speedup: 0.0,
      notes: 'Ideal 16-stage ripple model'
    },
    {
      arch: 'CSKA',
      name: 'Carry Skip Adder (Theoretical RTL)',
      delay: 1.68,
      area: 440.42,
      cells: 48,
      power: 0.122,
      adp: 739.9,
      speedup: 57.1,
      notes: 'Ideal 4-block skip macro-equation'
    },
    {
      arch: 'CLA',
      name: 'Carry Look-Ahead Adder',
      delay: 0.88,
      area: 479.21,
      cells: 65,
      power: 0.151,
      adp: 421.7,
      speedup: 77.5,
      notes: 'Ideal 2-level lookahead tree'
    },
    {
      arch: 'CSLA',
      name: 'Carry Select Adder',
      delay: 1.54,
      area: 440.42,
      cells: 48,
      power: 0.156,
      adp: 678.2,
      speedup: 60.7,
      notes: 'Ideal 4-bit speculative MUX'
    },
    {
      arch: 'BK',
      name: 'Brent-Kung Prefix Adder',
      delay: 1.18,
      area: 506.74,
      cells: 77,
      power: 0.165,
      adp: 598.0,
      speedup: 69.9,
      notes: 'Ideal 7-level prefix tree'
    }
  ]

  const flattenedData = [
    {
      arch: 'RCA',
      name: 'Ripple Carry Adder (Flattened)',
      delay: 3.957,
      area: 440.42,
      cells: 48,
      speedup: 0.0,
      notes: '16 maj3_1 + 32 xnor2_1 cells'
    },
    {
      arch: 'CSKA',
      name: 'Carry Skip Adder (Flattened)',
      delay: 3.957,
      area: 440.42,
      cells: 48,
      speedup: 0.0,
      notes: 'Skip MUXes optimized away into 16 maj3_1 cells'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Top Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-[#00F0FF]/30">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8] mb-1">
            <Clock className="w-4 h-4 text-[#00F0FF]" />
            <span>CSKA NETLIST DELAY ESTIMATE</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#00F0FF]">2.471 ns</div>
          <div className="text-xs text-[#00DF72] mt-1 font-mono">41.7% speedup (Hierarchical Netlist)</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-[#FF7A00]/40">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8] mb-1">
            <TrendingUp className="w-4 h-4 text-[#FF7A00]" />
            <span>HIERARCHICAL ADP</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#FF7A00]">1879.8</div>
          <div className="text-xs text-[#FF7A00] mt-1 font-mono">18.0% reduction vs Hierarchical RCA</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-[#00DF72]/30">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8] mb-1">
            <Box className="w-4 h-4 text-[#00DF72]" />
            <span>HIERARCHICAL NETLIST AREA</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#00DF72]">760.73 µm²</div>
          <div className="text-xs text-[#94A3B8] mt-1 font-mono">56 cells (Preserves 4 MUX2 + 4 AND4)</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-[#7928CA]/40">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8] mb-1">
            <Zap className="w-4 h-4 text-[#7928CA]" />
            <span>DYNAMIC POWER @ 100MHz</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#E2E8F0]">0.122 mW</div>
          <div className="text-xs text-[#00DF72] mt-1 font-mono">Lowest active switching after RCA</div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex space-x-3 border-b border-[#1E293B] pb-3">
        <button
          onClick={() => setActiveTab('hierarchical')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 ${
            activeTab === 'hierarchical'
              ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. HIERARCHICAL NETLIST (TRUE HARDWARE SKIP)</span>
        </button>

        <button
          onClick={() => setActiveTab('theoretical')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 ${
            activeTab === 'theoretical'
              ? 'bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/40'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>2. THEORETICAL RTL ARCHITECTURAL MODEL</span>
        </button>

        <button
          onClick={() => setActiveTab('flattened')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 ${
            activeTab === 'flattened'
              ? 'bg-[#7928CA]/15 text-[#E2E8F0] border border-[#7928CA]/40'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3. FLATTENED SYNTHESIS (ABC OPTIMIZED)</span>
        </button>
      </div>

      {/* Comparative Table Display */}
      <div className="glass-panel rounded-xl p-6 overflow-x-auto">
        <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-[#00F0FF]" />
          <span>
            {activeTab === 'hierarchical' && 'SKY130 HIERARCHICAL NETLIST COMPARISON (PRE-ROUTE ESTIMATES)'}
            {activeTab === 'theoretical' && 'THEORETICAL RTL ARCHITECTURAL TIMING MODEL'}
            {activeTab === 'flattened' && 'UNCONSTRAINED FLATTENED SYNTHESIS COMPARISON (ABC REFACTORED)'}
          </span>
        </h3>

        {activeTab === 'hierarchical' && (
          <>
            <table className="w-full text-left font-mono text-xs mt-3">
              <thead>
                <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                  <th className="pb-3 px-3">ARCHITECTURE</th>
                  <th className="pb-3 px-3">CELLS</th>
                  <th className="pb-3 px-3">CELL AREA</th>
                  <th className="pb-3 px-3">ANALYTICAL DELAY ESTIMATE</th>
                  <th className="pb-3 px-3">POWER (100MHz)</th>
                  <th className="pb-3 px-3">ADP (µm²·ns)</th>
                  <th className="pb-3 px-3">SPEEDUP VS RCA</th>
                  <th className="pb-3 px-3">HARDWARE STATUS</th>
                </tr>
              </thead>
              <tbody>
                {hierarchicalData.map((d) => (
                  <tr
                    key={d.arch}
                    className={`border-b border-[#1E293B]/40 hover:bg-[#0A1322] transition ${
                      d.highlight ? 'bg-[#00F0FF]/5 text-[#00F0FF] font-bold' : 'text-[#E2E8F0]'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div>{d.name}</div>
                      <div className="text-[10px] text-[#64748B]">{d.notes}</div>
                    </td>
                    <td className="py-3 px-3">{d.cells}</td>
                    <td className="py-3 px-3">{d.area} µm²</td>
                    <td className="py-3 px-3">{d.delay} ns</td>
                    <td className="py-3 px-3">{d.power} mW</td>
                    <td className="py-3 px-3">{d.adp}</td>
                    <td className="py-3 px-3">
                      {d.speedup > 0 ? (
                        <span className="text-[#00DF72]">+{d.speedup}%</span>
                      ) : (
                        <span className="text-[#64748B]">Baseline</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center space-x-1 text-[#00DF72]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>MAPPED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-[11px] font-mono text-[#64748B]">
              * Note: Labelled strictly as analytical hierarchical-netlist critical-path delay estimate. Delays derived from Sky130 HD Liberty NLDM tables (25°C, 1.8V); power modeled at 100MHz. Not post-route back-annotated SPEF STA.
            </div>
          </>
        )}

        {activeTab === 'theoretical' && (
          <>
            <table className="w-full text-left font-mono text-xs mt-3">
              <thead>
                <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                  <th className="pb-3 px-3">ARCHITECTURE</th>
                  <th className="pb-3 px-3">RTL DELAY MODEL</th>
                  <th className="pb-3 px-3">THEORETICAL SPEEDUP</th>
                  <th className="pb-3 px-3">MODEL FORMULATION</th>
                </tr>
              </thead>
              <tbody>
                {theoreticalData.map((d) => (
                  <tr key={d.arch} className="border-b border-[#1E293B]/40 text-[#E2E8F0]">
                    <td className="py-3 px-3 font-bold">{d.name}</td>
                    <td className="py-3 px-3 text-[#00F0FF]">{d.delay} ns</td>
                    <td className="py-3 px-3 text-[#00DF72]">
                      {d.speedup > 0 ? `+${d.speedup}%` : 'Baseline'}
                    </td>
                    <td className="py-3 px-3 text-[#94A3B8]">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-[11px] font-mono text-[#64748B]">
              * Note: The theoretical RTL architectural model represents the ideal textbook bypass path. It does not reflect Yosys Boolean optimization passes.
            </div>
          </>
        )}

        {activeTab === 'flattened' && (
          <>
            <table className="w-full text-left font-mono text-xs mt-3">
              <thead>
                <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                  <th className="pb-3 px-3">ARCHITECTURE</th>
                  <th className="pb-3 px-3">FLATTENED CELLS</th>
                  <th className="pb-3 px-3">FLATTENED AREA</th>
                  <th className="pb-3 px-3">FLATTENED NETLIST DELAY</th>
                  <th className="pb-3 px-3">SPEEDUP</th>
                  <th className="pb-3 px-3">OPTIMIZATION FINDING</th>
                </tr>
              </thead>
              <tbody>
                {flattenedData.map((d) => (
                  <tr key={d.arch} className="border-b border-[#1E293B]/40 text-[#E2E8F0]">
                    <td className="py-3 px-3 font-bold">{d.name}</td>
                    <td className="py-3 px-3">{d.cells}</td>
                    <td className="py-3 px-3">{d.area} µm²</td>
                    <td className="py-3 px-3">{d.delay} ns</td>
                    <td className="py-3 px-3 text-[#64748B]">0.0%</td>
                    <td className="py-3 px-3 text-[#FF7A00]">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-[11px] font-mono text-[#64748B]">
              * Finding: Unconstrained flattening collapses both RCA and CSKA into identical majority-carry ripple netlists (3.957 ns).
            </div>
          </>
        )}
      </div>

      {/* Engineering Synthesis Investigation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel p-5 rounded-xl border border-[#1E293B]">
          <h4 className="text-sm font-bold text-[#00F0FF] mb-2">
            Why Flattened Synthesis Erased the Skip Logic:
          </h4>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            In standard flattened synthesis, ABC performs global Boolean optimization across submodules. Because the Boolean transfer function of binary addition is invariant, ABC recognized the bypass multiplexer as functionally redundant and collapsed both RCA and CSKA into 16 majority-3 (<span className="font-mono text-white">maj3_1</span>) gates, yielding identical 3.957 ns delay and 440.42 µm² area.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-[#1E293B]">
          <h4 className="text-sm font-bold text-[#00DF72] mb-2">
            Verified Hierarchical Netlist Speedup:
          </h4>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            When synthesized with module hierarchy preservation (<span className="font-mono text-white">hierarchy -check -top ...</span> without global flattening), the physical carry-skip hardware survives: 4 <span className="font-mono text-white">mux2_1</span> bypass multiplexers and 4 <span className="font-mono text-white">and4_1</span> group propagate gates are preserved. The analytical hierarchical-netlist critical-path delay estimate drops to <b>2.471 ns</b> (a <b>41.7% speedup</b> over hierarchical RCA) with an area of 760.73 µm².
          </p>
        </div>
      </div>
    </div>
  )
}
