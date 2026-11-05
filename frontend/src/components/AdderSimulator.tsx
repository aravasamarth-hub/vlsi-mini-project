import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  RotateCcw,
  Cpu,
  Sparkles,
  CheckCircle,
  Zap,
  StepForward,
  Pause,
  Shuffle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react'

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
  const [hexA, setHexA] = useState<string>('AAAA')
  const [hexB, setHexB] = useState<string>('5555')
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  // Step-by-step carry propagation animation state
  const [animStep, setAnimStep] = useState<number>(4)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [animSpeed] = useState<number>(1000)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    setHexA(aDec.toString(16).toUpperCase().padStart(4, '0'))
  }, [aDec])

  useEffect(() => {
    setHexB(bDec.toString(16).toUpperCase().padStart(4, '0'))
  }, [bDec])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setAnimStep((prev) => {
          if (prev >= 4) {
            setIsPlaying(false)
            return 4
          }
          return prev + 1
        })
      }, animSpeed)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, animSpeed])

  const handleRun = () => {
    setAnimStep(4)
    setIsPlaying(false)
    onSimulate(aDec, bDec, cin, architecture)
  }

  const loadPreset = (presetA: number, presetB: number, presetCin: number) => {
    setADec(presetA)
    setBDec(presetB)
    setCin(presetCin)
    setAnimStep(4)
    setIsPlaying(false)
    onSimulate(presetA, presetB, presetCin, architecture)
  }

  const handleRandomize = () => {
    const rA = Math.floor(Math.random() * 65536)
    const rB = Math.floor(Math.random() * 65536)
    const rCin = Math.random() > 0.5 ? 1 : 0
    loadPreset(rA, rB, rCin)
  }

  const handleHexAChange = (val: string) => {
    setHexA(val)
    const clean = val.replace(/[^0-9A-Fa-f]/g, '').slice(0, 4)
    const num = parseInt(clean, 16)
    if (!isNaN(num)) {
      setADec(num)
      onSimulate(num, bDec, cin, architecture)
    }
  }

  const handleHexBChange = (val: string) => {
    setHexB(val)
    const clean = val.replace(/[^0-9A-Fa-f]/g, '').slice(0, 4)
    const num = parseInt(clean, 16)
    if (!isNaN(num)) {
      setBDec(num)
      onSimulate(aDec, num, cin, architecture)
    }
  }

  const toggleBitA = (idx: number) => {
    const newA = aDec ^ (1 << idx)
    setADec(newA)
    onSimulate(newA, bDec, cin, architecture)
  }

  const toggleBitB = (idx: number) => {
    const newB = bDec ^ (1 << idx)
    setBDec(newB)
    onSimulate(aDec, newB, cin, architecture)
  }

  const sumHex = telemetry ? telemetry.SUM.toString(16).toUpperCase().padStart(4, '0') : '0000'
  const fullResultHex = telemetry
    ? `0x${((telemetry.Cout << 16) | telemetry.SUM).toString(16).toUpperCase().padStart(5, '0')}`
    : '0x10000'

  return (
    <div className="glass-panel rounded-2xl p-5 relative border border-[#00F0FF]/30 shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Bar (Reference 1) */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1E293B] gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 shadow-md">
            <Zap className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-white glow-cyan flex items-center space-x-2">
              <span>INTERACTIVE ADDER SIMULATOR</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
                16-BIT SKY130
              </span>
            </h2>
            <p className="text-[10px] text-[#94A3B8]">
              Connected to Icarus Verilog & SKY130 Telemetry Engine
            </p>
          </div>
        </div>

        {/* Architecture Selector Tabs (Reference 1) */}
        <div className="flex items-center space-x-1 bg-[#070D1A] p-1 rounded-xl border border-[#1E293B]">
          {[
            { id: 'CSKA', label: 'CSKA' },
            { id: 'RCA', label: 'RCA' },
            { id: 'CLA', label: 'CLA' },
            { id: 'CSLA', label: 'CSLA' },
            { id: 'BK', label: 'BK' }
          ].map((arch) => (
            <button
              key={arch.id}
              onClick={() => {
                setArchitecture(arch.id)
                onSimulate(aDec, bDec, cin, arch.id)
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                architecture === arch.id
                  ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/25'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#121B2F]'
              }`}
            >
              {arch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Studio Grid (Reference 1) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* COL 1: INPUT OPERANDS (16-BIT) (~3.5/12) */}
        <div className="md:col-span-4 bg-[#070D1A] p-3.5 rounded-xl border border-[#1E293B] space-y-2.5">
          <div className="flex justify-between items-center pb-1 border-b border-[#1E293B]/60">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              INPUT OPERANDS (16-BIT)
            </span>
            <button
              onClick={handleRandomize}
              title="Generate Random Operands"
              className="text-[#00F0FF] hover:text-white transition"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Operand A & B Hex Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-[#94A3B8] block mb-0.5">A =</span>
              <div className="flex items-center bg-[#040812] border border-[#1E293B] rounded px-2 py-1">
                <span className="text-[#64748B] text-[10px]">0x</span>
                <input
                  type="text"
                  maxLength={4}
                  value={hexA}
                  onChange={(e) => handleHexAChange(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-center focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <span className="text-[9px] text-[#94A3B8] block mb-0.5">B =</span>
              <div className="flex items-center bg-[#040812] border border-[#1E293B] rounded px-2 py-1">
                <span className="text-[#64748B] text-[10px]">0x</span>
                <input
                  type="text"
                  maxLength={4}
                  value={hexB}
                  onChange={(e) => handleHexBChange(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-center focus:outline-none uppercase"
                />
              </div>
            </div>
          </div>

          {/* Cin Selector Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#94A3B8]">Cin:</span>
            <button
              onClick={() => {
                const nextCin = cin === 1 ? 0 : 1
                setCin(nextCin)
                onSimulate(aDec, bDec, nextCin, architecture)
              }}
              className={`px-3 py-1 rounded font-bold text-xs transition ${
                cin === 1
                  ? 'bg-[#FF7A00] text-black shadow-md shadow-[#FF7A00]/25'
                  : 'bg-[#121B2F] text-[#94A3B8] hover:text-white'
              }`}
            >
              Cin = {cin}
            </button>
          </div>
        </div>

        {/* COL 2: RESULT (17-BIT) (~3.5/12) */}
        <div className="md:col-span-3 bg-gradient-to-br from-[#061A18] to-[#040E10] p-3.5 rounded-xl border border-[#00DF72]/40 shadow-lg space-y-2 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-[#00DF72] uppercase tracking-wider">
            RESULT (17-BIT)
          </span>

          <div className="space-y-1">
            <div className="text-sm font-bold text-white font-mono flex items-center justify-between">
              <span>{`{Cout, Sum} = ${fullResultHex}`}</span>
              <CheckCircle className="w-4 h-4 text-[#00DF72]" />
            </div>
            <div className="text-[11px] text-[#94A3B8] flex items-center space-x-2">
              <span>Cout = <b className={telemetry?.Cout ? 'text-[#FF7A00]' : 'text-white'}>{telemetry?.Cout ?? 1}</b></span>
              <span>•</span>
              <span>Sum = <b className="text-[#00F0FF]">0x{sumHex}</b></span>
            </div>
          </div>
        </div>

        {/* COL 3: CARRY PROPAGATION (CSKA) (~5/12) */}
        <div className="md:col-span-5 bg-[#070D1A] p-3.5 rounded-xl border border-[#1E293B] space-y-2">
          <div className="flex justify-between items-center pb-1 border-b border-[#1E293B]/60">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              CARRY PROPAGATION (CSKA)
            </span>
            <div className="flex items-center space-x-2 text-[9px]">
              <span className="flex items-center space-x-1 text-[#FF7A00]">
                <span className="w-2 h-1 bg-[#FF7A00] rounded-sm"></span>
                <span>Skip</span>
              </span>
              <span className="flex items-center space-x-1 text-[#00F0FF]">
                <span className="w-2 h-1 bg-[#00F0FF] rounded-sm"></span>
                <span>Ripple</span>
              </span>
            </div>
          </div>

          {/* 4 Block Pipeline Flow (Reference 1) */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[0, 1, 2, 3].map((bId) => {
              const b = telemetry?.blocks?.[bId]
              const isSkip = b?.skip_active
              return (
                <div
                  key={bId}
                  className={`p-1.5 rounded-lg border text-center transition ${
                    isSkip
                      ? 'bg-[#10B981]/15 border-[#10B981]/50 text-white'
                      : 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-white'
                  }`}
                >
                  <div className="text-[9px] text-[#34D399] font-bold mb-0.5">
                    P_grp = {b?.p_group ?? 1}
                  </div>
                  <div className="text-[10px] font-bold">
                    BLK {bId}
                  </div>
                  <div className="text-[8px] text-[#94A3B8]">
                    {`[${bId * 4 + 3}:${bId * 4}]`}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Skip Bypass Highway Arrow */}
          <div className="pt-1 flex items-center justify-between text-[9px] text-[#FF7A00]">
            <span className="font-bold flex items-center space-x-1">
              <Zap className="w-3 h-3 text-[#FF7A00]" />
              <span>Skip (Bypass Active)</span>
            </span>
            <span className="text-[#94A3B8]">Ripple (Carry Propagate)</span>
          </div>
        </div>
      </div>

      {/* Advanced Toggle for Presets & Bit Controls */}
      <div className="pt-1 flex items-center justify-between border-t border-[#1E293B]/60 text-[10px]">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[#00F0FF] hover:underline flex items-center space-x-1 font-bold"
        >
          <span>{showAdvanced ? 'Hide Bit Toggles & Test Presets' : 'Show 16-Bit Toggles & Test Vector Presets'}</span>
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <button
          onClick={handleRun}
          disabled={simulating}
          className="px-3 py-1 rounded-lg bg-[#00F0FF] hover:bg-[#38BDF8] text-black font-bold flex items-center space-x-1 shadow-md shadow-[#00F0FF]/20"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{simulating ? 'Simulating...' : 'RUN SIMULATION'}</span>
        </button>
      </div>

      {/* Collapsible Advanced Section */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-[#1E293B] animate-in fade-in duration-150">
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <button
              onClick={() => loadPreset(0xAAAA, 0x5555, 1)}
              className="px-2.5 py-1 rounded bg-[#0E172A] border border-[#FF7A00]/50 text-[#FF7A00] font-bold"
            >
              Full Skip (0xAAAA + 0x5555 + 1)
            </button>
            <button
              onClick={() => loadPreset(0xFFFF, 0x0001, 0)}
              className="px-2.5 py-1 rounded bg-[#0E172A] border border-[#00F0FF]/40 text-[#00F0FF]"
            >
              Worst-Case Ripple (0xFFFF + 0x0001)
            </button>
            <button
              onClick={() => loadPreset(0xF0F0, 0x0F0F, 1)}
              className="px-2.5 py-1 rounded bg-[#0E172A] border border-[#1E293B] text-[#E2E8F0]"
            >
              Alternating Skip (0xF0F0 + 0x0F0F + 1)
            </button>
            <button
              onClick={() => loadPreset(65535, 65535, 1)}
              className="px-2.5 py-1 rounded bg-[#0E172A] border border-[#1E293B] text-[#94A3B8]"
            >
              Saturation (0xFFFF + 0xFFFF + 1)
            </button>
          </div>

          {/* 16-Bit Toggles for A and B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-[#050A14] p-2.5 rounded-lg border border-[#1E293B]">
              <div className="text-[9px] text-[#64748B] mb-1 flex justify-between">
                <span>Operand A [15:0]</span>
                <span>Dec: {aDec}</span>
              </div>
              <div className="grid grid-cols-16 gap-0.5">
                {Array.from({ length: 16 }, (_, i) => 15 - i).map((bitIdx) => {
                  const bitVal = (aDec >> bitIdx) & 1
                  return (
                    <button
                      key={bitIdx}
                      onClick={() => toggleBitA(bitIdx)}
                      className={`h-4 text-[8px] font-bold rounded-sm transition ${
                        bitVal ? 'bg-[#00F0FF] text-black' : 'bg-[#121B2F] text-[#64748B]'
                      }`}
                    >
                      {bitVal}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#050A14] p-2.5 rounded-lg border border-[#1E293B]">
              <div className="text-[9px] text-[#64748B] mb-1 flex justify-between">
                <span>Operand B [15:0]</span>
                <span>Dec: {bDec}</span>
              </div>
              <div className="grid grid-cols-16 gap-0.5">
                {Array.from({ length: 16 }, (_, i) => 15 - i).map((bitIdx) => {
                  const bitVal = (bDec >> bitIdx) & 1
                  return (
                    <button
                      key={bitIdx}
                      onClick={() => toggleBitB(bitIdx)}
                      className={`h-4 text-[8px] font-bold rounded-sm transition ${
                        bitVal ? 'bg-[#00F0FF] text-black' : 'bg-[#121B2F] text-[#64748B]'
                      }`}
                    >
                      {bitVal}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
