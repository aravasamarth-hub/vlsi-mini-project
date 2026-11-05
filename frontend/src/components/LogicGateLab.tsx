import React, { useState } from 'react'
import { Binary, Layers, Cpu } from 'lucide-react'

export default function LogicGateLab() {
  const [selectedGate, setSelectedGate] = useState<'FA' | 'XOR' | 'AND' | 'MUX' | 'HA'>('FA')
  const [inA, setInA] = useState<number>(1)
  const [inB, setInB] = useState<number>(1)
  const [inCin, setInCin] = useState<number>(0)
  const [inSel, setInSel] = useState<number>(0)

  // Compute logic gate outputs
  const calcOutput = () => {
    switch (selectedGate) {
      case 'FA':
        return {
          sum: inA ^ inB ^ inCin,
          cout: (inA & inB) | (inCin & (inA ^ inB)),
          eq: "SUM = A ^ B ^ Cin • Cout = AB + Cin(A ^ B)"
        }
      case 'HA':
        return {
          sum: inA ^ inB,
          cout: inA & inB,
          eq: "SUM = A ^ B • Cout = A & B"
        }
      case 'XOR':
        return {
          out: inA ^ inB,
          eq: "Y = A ^ B = A'B + AB'"
        }
      case 'AND':
        return {
          out: inA & inB,
          eq: "Y = A & B"
        }
      case 'MUX':
        return {
          out: inSel ? inB : inA,
          eq: "Y = Sel ? B : A"
        }
      default:
        return { out: 0, eq: "" }
    }
  }

  const res = calcOutput()

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-wide text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#00F0FF]" />
            <span>INTERACTIVE LOGIC GATE & FULL-ADDER EXPLORER</span>
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Constituent standard cells of the 16-Bit Carry Skip Adder
          </p>
        </div>

        {/* Gate Selection Tabs */}
        <div className="flex bg-[#0A101D] p-1 rounded-lg border border-[#1E293B] text-xs font-mono">
          {[
            { id: 'FA', label: 'Full Adder (FA)' },
            { id: 'HA', label: 'Half Adder (HA)' },
            { id: 'XOR', label: 'XOR2' },
            { id: 'AND', label: 'AND2' },
            { id: 'MUX', label: 'MUX2:1 (Skip)' }
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGate(g.id as any)}
              className={`px-3 py-1.5 rounded transition ${
                selectedGate === g.id
                  ? 'bg-[#00F0FF] text-black font-bold shadow-md shadow-[#00F0FF]/30'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {/* Interactive Gate Terminal Panel */}
        <div className="bg-[#070D1A] p-5 rounded-xl border border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[#00F0FF] font-bold mb-4 uppercase">
              Live Input Terminals
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between bg-[#0B1324] p-3 rounded-lg border border-[#1E293B]">
                <span className="text-[#94A3B8]">Input Terminal A:</span>
                <button
                  onClick={() => setInA(inA ? 0 : 1)}
                  className={`w-12 py-1 rounded font-bold text-sm transition ${
                    inA ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/30' : 'bg-[#1E293B] text-white'
                  }`}
                >
                  {inA}
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#0B1324] p-3 rounded-lg border border-[#1E293B]">
                <span className="text-[#94A3B8]">Input Terminal B:</span>
                <button
                  onClick={() => setInB(inB ? 0 : 1)}
                  className={`w-12 py-1 rounded font-bold text-sm transition ${
                    inB ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/30' : 'bg-[#1E293B] text-white'
                  }`}
                >
                  {inB}
                </button>
              </div>

              {selectedGate === 'FA' && (
                <div className="flex items-center justify-between bg-[#0B1324] p-3 rounded-lg border border-[#1E293B]">
                  <span className="text-[#FF7A00] font-bold">Carry-in (Cin):</span>
                  <button
                    onClick={() => setInCin(inCin ? 0 : 1)}
                    className={`w-12 py-1 rounded font-bold text-sm transition ${
                      inCin ? 'bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/30' : 'bg-[#1E293B] text-white'
                    }`}
                  >
                    {inCin}
                  </button>
                </div>
              )}

              {selectedGate === 'MUX' && (
                <div className="flex items-center justify-between bg-[#0B1324] p-3 rounded-lg border border-[#1E293B]">
                  <span className="text-[#FF7A00] font-bold">Select Line (P_group):</span>
                  <button
                    onClick={() => setInSel(inSel ? 0 : 1)}
                    className={`w-12 py-1 rounded font-bold text-sm transition ${
                      inSel ? 'bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/30' : 'bg-[#1E293B] text-white'
                    }`}
                  >
                    {inSel}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Computed Output Terminals */}
          <div className="mt-6 pt-4 border-t border-[#1E293B]">
            <div className="text-xs font-mono text-[#64748B] mb-2 uppercase">Computed Output:</div>
            {selectedGate === 'FA' ? (
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-[#050B14] p-3 rounded border border-[#00F0FF]/40 text-center">
                  <div className="text-[10px] text-[#94A3B8]">SUM OUTPUT</div>
                  <div className="text-2xl font-bold text-[#00F0FF] mt-1">{res.sum}</div>
                </div>
                <div className="bg-[#050B14] p-3 rounded border border-[#FF7A00]/40 text-center">
                  <div className="text-[10px] text-[#94A3B8]">CARRY OUTPUT</div>
                  <div className="text-2xl font-bold text-[#FF7A00] mt-1">{res.cout}</div>
                </div>
              </div>
            ) : selectedGate === 'HA' ? (
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-[#050B14] p-3 rounded border border-[#00F0FF]/40 text-center">
                  <div className="text-[10px] text-[#94A3B8]">SUM OUTPUT</div>
                  <div className="text-2xl font-bold text-[#00F0FF] mt-1">{res.sum}</div>
                </div>
                <div className="bg-[#050B14] p-3 rounded border border-[#FF7A00]/40 text-center">
                  <div className="text-[10px] text-[#94A3B8]">CARRY OUTPUT</div>
                  <div className="text-2xl font-bold text-[#FF7A00] mt-1">{res.cout}</div>
                </div>
              </div>
            ) : (
              <div className="bg-[#050B14] p-4 rounded border border-[#00F0FF]/40 text-center font-mono">
                <div className="text-[10px] text-[#94A3B8]">LOGIC OUTPUT (Y)</div>
                <div className="text-3xl font-bold text-[#00F0FF] mt-1">{res.out}</div>
              </div>
            )}
          </div>
        </div>

        {/* Truth Table & Boolean Logic Card */}
        <div className="bg-[#070D1A] p-5 rounded-xl border border-[#1E293B]">
          <div className="text-xs font-mono text-[#FF7A00] font-bold mb-2 uppercase">
            Boolean Equation & Truth Table
          </div>
          <div className="text-xs font-mono text-white bg-[#05070E] p-2.5 rounded border border-[#1E293B] mb-4">
            {res.eq}
          </div>

          <div className="text-xs font-mono text-[#94A3B8] mb-2">Sky130 Standard Cell:</div>
          <div className="text-xs font-mono text-[#00DF72] mb-4">
            {selectedGate === 'FA' && 'sky130_fd_sc_hd__fa_1 (or maj3_1 + xnor2_1)'}
            {selectedGate === 'HA' && 'sky130_fd_sc_hd__ha_1 (or and2_1 + xor2_1)'}
            {selectedGate === 'XOR' && 'sky130_fd_sc_hd__xor2_1'}
            {selectedGate === 'AND' && 'sky130_fd_sc_hd__and2_1'}
            {selectedGate === 'MUX' && 'sky130_fd_sc_hd__mux2_1'}
          </div>

          {/* Truth Table */}
          <div className="overflow-x-auto text-xs font-mono border border-[#1E293B] rounded-lg">
            <table className="w-full text-center">
              <thead className="bg-[#0B1324] text-[#94A3B8] border-b border-[#1E293B]">
                <tr>
                  <th className="py-2 px-3">A</th>
                  <th className="py-2 px-3">B</th>
                  {selectedGate === 'FA' && <th className="py-2 px-3">Cin</th>}
                  {selectedGate === 'MUX' && <th className="py-2 px-3">Sel</th>}
                  {selectedGate === 'FA' || selectedGate === 'HA' ? (
                    <>
                      <th className="py-2 px-3 text-[#00F0FF]">SUM</th>
                      <th className="py-2 px-3 text-[#FF7A00]">COUT</th>
                    </>
                  ) : (
                    <th className="py-2 px-3 text-[#00F0FF]">Y</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/40 text-[#CBD5E1]">
                {selectedGate === 'FA' ? (
                  [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 1, 0],
                    [0, 1, 0, 1, 0],
                    [0, 1, 1, 0, 1],
                    [1, 0, 0, 1, 0],
                    [1, 0, 1, 0, 1],
                    [1, 1, 0, 0, 1],
                    [1, 1, 1, 1, 1]
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={
                        inA === row[0] && inB === row[1] && inCin === row[2]
                          ? 'bg-[#00F0FF]/15 font-bold text-white'
                          : ''
                      }
                    >
                      <td className="py-1.5">{row[0]}</td>
                      <td className="py-1.5">{row[1]}</td>
                      <td className="py-1.5">{row[2]}</td>
                      <td className="py-1.5 text-[#00F0FF]">{row[3]}</td>
                      <td className="py-1.5 text-[#FF7A00]">{row[4]}</td>
                    </tr>
                  ))
                ) : (
                  [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 0, 1],
                    [1, 1, selectedGate === 'AND' ? 1 : 0]
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={
                        inA === row[0] && inB === row[1]
                          ? 'bg-[#00F0FF]/15 font-bold text-white'
                          : ''
                      }
                    >
                      <td className="py-1.5">{row[0]}</td>
                      <td className="py-1.5">{row[1]}</td>
                      <td className="py-1.5 text-[#00F0FF]">{row[2]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

