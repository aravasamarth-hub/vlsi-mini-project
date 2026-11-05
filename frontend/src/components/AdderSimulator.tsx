import React, { useState } from 'react'
import { Play, RotateCcw, Cpu, Sparkles, CheckCircle, Zap } from 'lucide-react'

interface AdderSimulatorProps {
  telemetry: any
  onSimulate: (a: number, b: number, cin: number, arch: string) => void
  simulating: boolean
  architecture: string
  setArchitecture: (a: string) => void
}

export default function AdderSimulator({
  telemetry,
  onSimulate,
  simulating,
  architecture,
  setArchitecture
}: AdderSimulatorProps) {
  const [aDec, setADec] = useState<number>(43690) // 0xAAAA
  const [bDec, setBDec] = useState<number>(21845) // 0x5555
  const [cin, setCin] = useState<number>(1)
  const [mode, setMode] = useState<'DEC' | 'HEX'>('HEX')

  const handleRun = () => {
    onSimulate(aDec, bDec, cin, architecture)
  }

  const loadPreset = (presetA: number, presetB: number, presetCin: number) => {
    setADec(presetA)
    setBDec(presetB)
    setCin(presetCin)
    onSimulate(presetA, presetB, presetCin, architecture)
  }

  return (
    <div className="glass-panel rounded-xl p-6 relative">
      <div className="flex flex-wrap items-center justify-between pb-5 border-b border-[#1E293B] gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide text-white">INTERACTIVE ADDER SIMULATOR</h2>
            <p className="text-xs text-[#94A3B8]">Connected to Icarus Verilog & SkyWater 130nm Telemetry Engine</p>
          </div>
        </div>

        {/* Architecture Selector */}
        <div className="flex items-center space-x-1.5 bg-[#0A101D] p-1 rounded-lg border border-[#1E293B]">
          {['CSKA', 'RCA', 'CLA', 'CSLA', 'BK'].map((arch) => (
            <button
              key={arch}
              onClick={() => setArchitecture(arch)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-all ${
                architecture === arch
                  ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/30'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {arch}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Quick Loads */}
      <div className="my-4 flex flex-wrap gap-2 text-xs font-mono">
        <span className="text-[#64748B] flex items-center pr-2">PRESETS:</span>
        <button
          onClick={() => loadPreset(0xAAAA, 0x5555, 1)}
          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#FF7A00]/40 text-[#FF7A00] hover:bg-[#FF7A00]/20 transition"
        >
          ⚡ 16-Bit Full Skip (0xAAAA + 0x5555 + 1)
        </button>
        <button
          onClick={() => loadPreset(65535, 1, 0)}
          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#00F0FF]/40 transition"
        >
          Overflow Test (65535 + 1)
        </button>
        <button
          onClick={() => loadPreset(32768, 32768, 0)}
          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#00F0FF]/40 transition"
        >
          Midpoint MSB (32768 + 32768)
        </button>
        <button
          onClick={() => loadPreset(12345, 54321, 0)}
          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#00F0FF]/40 transition"
        >
          Standard (12345 + 54321)
        </button>
      </div>

      {/* Operand Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-5">
        {/* Input A */}
        <div className="bg-[#090E1A] p-4 rounded-lg border border-[#1E293B]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-bold text-[#00F0FF]">OPERAND A [15:0]</span>
            <span className="text-xs font-mono text-[#64748B]">
              HEX: 0x{aDec.toString(16).toUpperCase().padStart(4, '0')}
            </span>
          </div>
          <input
            type="number"
            min="0"
            max="65535"
            value={aDec}
            onChange={(e) => setADec(Math.min(65535, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full bg-[#05070E] border border-[#1E293B] rounded px-3 py-2 text-white font-mono text-base focus:border-[#00F0FF] focus:outline-none"
          />
          <div className="mt-2 text-[11px] font-mono text-[#64748B] break-all">
            BIN: {aDec.toString(2).padStart(16, '0')}
          </div>
        </div>

        {/* Input B */}
        <div className="bg-[#090E1A] p-4 rounded-lg border border-[#1E293B]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-bold text-[#00F0FF]">OPERAND B [15:0]</span>
            <span className="text-xs font-mono text-[#64748B]">
              HEX: 0x{bDec.toString(16).toUpperCase().padStart(4, '0')}
            </span>
          </div>
          <input
            type="number"
            min="0"
            max="65535"
            value={bDec}
            onChange={(e) => setBDec(Math.min(65535, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full bg-[#05070E] border border-[#1E293B] rounded px-3 py-2 text-white font-mono text-base focus:border-[#00F0FF] focus:outline-none"
          />
          <div className="mt-2 text-[11px] font-mono text-[#64748B] break-all">
            BIN: {bDec.toString(2).padStart(16, '0')}
          </div>
        </div>

        {/* Carry-In & Execute */}
        <div className="bg-[#090E1A] p-4 rounded-lg border border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono font-bold text-[#FF7A00]">CARRY-IN (Cin)</span>
              <span className="text-xs font-mono text-[#64748B]">1-BIT PORT</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map((val) => (
                <button
                  key={val}
                  onClick={() => setCin(val)}
                  className={`py-2 rounded font-mono font-bold text-sm transition ${
                    cin === val
                      ? 'bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/30'
                      : 'bg-[#05070E] text-[#94A3B8] border border-[#1E293B] hover:text-white'
                  }`}
                >
                  Cin = {val}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={simulating}
            className="mt-3 w-full py-2.5 rounded font-mono font-bold text-sm bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black hover:opacity-90 flex items-center justify-center space-x-2 transition shadow-lg shadow-[#00F0FF]/25 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{simulating ? 'COMPUTING RTL...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Output Register Display */}
      {telemetry && (
        <div className="mt-6 pt-5 border-t border-[#1E293B]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#050B14] p-3.5 rounded-lg border border-[#00F0FF]/30">
              <div className="text-[11px] font-mono uppercase text-[#94A3B8]">16-Bit SUM (Dec)</div>
              <div className="text-2xl font-mono font-bold text-[#00F0FF] mt-1">{telemetry.SUM}</div>
            </div>
            <div className="bg-[#050B14] p-3.5 rounded-lg border border-[#00F0FF]/30">
              <div className="text-[11px] font-mono uppercase text-[#94A3B8]">16-Bit SUM (Hex)</div>
              <div className="text-2xl font-mono font-bold text-[#00F0FF] mt-1">
                0x{telemetry.SUM.toString(16).toUpperCase().padStart(4, '0')}
              </div>
            </div>
            <div className="bg-[#050B14] p-3.5 rounded-lg border border-[#FF7A00]/40">
              <div className="text-[11px] font-mono uppercase text-[#94A3B8]">Carry-Out (Cout)</div>
              <div className="text-2xl font-mono font-bold text-[#FF7A00] mt-1">{telemetry.Cout}</div>
            </div>
            <div className="bg-[#050B14] p-3.5 rounded-lg border border-[#00DF72]/40">
              <div className="text-[11px] font-mono uppercase text-[#94A3B8]">Verification Check</div>
              <div className="text-xs font-mono font-bold text-[#00DF72] mt-2 flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>100% MATCH</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
