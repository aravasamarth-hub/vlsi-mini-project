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
  ChevronRight,
  ShieldAlert,
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
  const [inputMode, setInputMode] = useState<'DEC' | 'HEX'>('HEX')
  const [hexA, setHexA] = useState<string>('AAAA')
  const [hexB, setHexB] = useState<string>('5555')

  // Step-by-step carry propagation animation state
  const [animStep, setAnimStep] = useState<number>(4) // 0 to 4 (stages)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [animSpeed, setAnimSpeed] = useState<number>(1000) // ms per step
  const timerRef = useRef<any>(null)

  // Sync hex when dec changes
  useEffect(() => {
    setHexA(aDec.toString(16).toUpperCase().padStart(4, '0'))
  }, [aDec])

  useEffect(() => {
    setHexB(bDec.toString(16).toUpperCase().padStart(4, '0'))
  }, [bDec])

  // Stepping timer
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

  const handleStepForward = () => {
    if (animStep >= 4) {
      setAnimStep(0)
    } else {
      setAnimStep((s) => s + 1)
    }
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
      if (animStep >= 4) setAnimStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const handleResetAnim = () => {
    setIsPlaying(false)
    setAnimStep(0)
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
    if (!isNaN(num)) setADec(num)
  }

  const handleHexBChange = (val: string) => {
    setHexB(val)
    const clean = val.replace(/[^0-9A-Fa-f]/g, '').slice(0, 4)
    const num = parseInt(clean, 16)
    if (!isNaN(num)) setBDec(num)
  }

  // Bit toggle helper
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

  // Architectural info details
  const archDescriptions: Record<string, { name: string; complexity: string; logic: string; desc: string }> = {
    CSKA: {
      name: 'Carry Skip Adder (CSKA)',
      complexity: 'Delay O(√N) • Area O(N)',
      logic: 'Pgroup = P0·P1·P2·P3; Cout = Pgroup ? Cin : C_ripple',
      desc: 'Bypasses ripple chain via 2:1 multiplexers when all bit propagates in a 4-bit block are active.'
    },
    RCA: {
      name: 'Ripple Carry Adder (RCA)',
      complexity: 'Delay O(N) • Area O(N)',
      logic: 'Ci+1 = Ai·Bi + (Ai ⊕ Bi)·Ci',
      desc: 'Simplest area footprint with 16 cascaded full-adders. Carry must traverse all 16 bits sequentially.'
    },
    CLA: {
      name: 'Carry Look-Ahead Adder (CLA)',
      complexity: 'Delay O(log N) • Area O(N log N)',
      logic: 'C1 = G0 + P0·C0; C2 = G1 + P1·G0 + P1·P0·C0 ...',
      desc: 'Calculates all carry signals simultaneously via multi-level look-ahead generate/propagate trees.'
    },
    CSLA: {
      name: 'Carry Select Adder (CSLA)',
      complexity: 'Delay O(√N) • Area O(2N)',
      logic: 'Speculative dual RCA blocks for Cin=0 and Cin=1',
      desc: 'Reduces carry propagation latency by duplicating adder hardware and selecting with 2:1 multiplexers.'
    },
    BK: {
      name: 'Brent-Kung Adder (Parallel Prefix)',
      complexity: 'Delay O(2 log2 N - 2) • Area O(N)',
      logic: 'Prefix operator (g, p) • (g\', p\') = (g + p·g\', p·p\')',
      desc: 'Highly regular binary tree prefix network optimizing fan-out and wire congestion for submicron silicon.'
    }
  }

  const currentArchInfo = archDescriptions[architecture] || archDescriptions.CSKA

  return (
    <div className="glass-panel rounded-2xl p-6 relative border border-[#00F0FF]/25 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-5 border-b border-[#1E293B] gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#0099FF]/10 text-[#00F0FF] border border-[#00F0FF]/40 shadow-lg shadow-[#00F0FF]/10">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide text-white glow-cyan flex items-center space-x-2">
              <span>INTERACTIVE ADDER SIMULATOR</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-mono font-bold">
                16-BIT SKY130
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono">
              Hardware verification against 17-bit golden reference model (60,038 verified vectors)
            </p>
          </div>
        </div>

        {/* Architecture Selector Tabs */}
        <div className="flex items-center space-x-1 bg-[#070D1A] p-1.5 rounded-xl border border-[#1E293B]">
          {[
            { id: 'CSKA', label: 'CSKA (Main)' },
            { id: 'RCA', label: 'RCA' },
            { id: 'CLA', label: 'CLA' },
            { id: 'CSLA', label: 'CSLA' },
            { id: 'BK', label: 'Brent-Kung' }
          ].map((arch) => (
            <button
              key={arch.id}
              onClick={() => {
                setArchitecture(arch.id)
                onSimulate(aDec, bDec, cin, arch.id)
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                architecture === arch.id
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#00B4D8] text-black shadow-lg shadow-[#00F0FF]/25'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#121B2F]'
              }`}
            >
              {arch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Architecture Context Banner */}
      <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#00F0FF]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="font-bold text-[#00F0FF]">{currentArchInfo.name}</span>
          <span className="text-[#64748B] mx-2">•</span>
          <span className="text-[#94A3B8]">{currentArchInfo.desc}</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30 font-bold">
            {currentArchInfo.complexity}
          </span>
        </div>
      </div>

      {/* Preset Quick Loads */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-[#64748B] flex items-center justify-between">
          <span className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[#94A3B8]">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Standard VLSI Test Vector Presets</span>
          </span>
          <button
            onClick={handleRandomize}
            className="flex items-center space-x-1 text-[#00F0FF] hover:underline"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Generate Random Operands</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => loadPreset(0xAAAA, 0x5555, 1)}
            className="px-3 py-1.5 rounded-lg bg-[#0E172A] border border-[#FF7A00]/50 text-[#FF7A00] hover:bg-[#FF7A00]/20 transition flex items-center space-x-1.5 font-bold"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Full Carry Skip (0xAAAA + 0x5555 + 1)</span>
          </button>
          <button
            onClick={() => loadPreset(0xFFFF, 0x0001, 0)}
            className="px-3 py-1.5 rounded-lg bg-[#0E172A] border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/15 transition"
          >
            Worst-Case Ripple (0xFFFF + 0x0001)
          </button>
          <button
            onClick={() => loadPreset(0xF0F0, 0x0F0F, 1)}
            className="px-3 py-1.5 rounded-lg bg-[#0E172A] border border-[#1E293B] text-[#E2E8F0] hover:border-[#00F0FF]/40 transition"
          >
            Alternating Skip (0xF0F0 + 0x0F0F + 1)
          </button>
          <button
            onClick={() => loadPreset(65535, 65535, 1)}
            className="px-3 py-1.5 rounded-lg bg-[#0E172A] border border-[#1E293B] text-[#94A3B8] hover:text-white transition"
          >
            All-One Saturation (0xFFFF + 0xFFFF + 1)
          </button>
          <button
            onClick={() => loadPreset(0, 0, 0)}
            className="px-3 py-1.5 rounded-lg bg-[#0E172A] border border-[#1E293B] text-[#94A3B8] hover:text-white transition"
          >
            All-Zero Quiescent
          </button>
          <button
            onClick={() => loadPreset(32768, 32768, 0)}
            className="px-3 py-1.5 rounded-lg bg-[#0E172A] border border-[#1E293B] text-[#94A3B8] hover:text-white transition"
          >
            Midpoint MSB (0x8000 + 0x8000)
          </button>
        </div>
      </div>

      {/* Input Operands Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Input A */}
        <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-[#00F0FF] flex items-center space-x-1.5">
              <span>OPERAND A</span>
              <span className="text-[10px] text-[#64748B]">[15:0]</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono text-[#94A3B8]">0x</span>
              <input
                type="text"
                maxLength={4}
                value={hexA}
                onChange={(e) => handleHexAChange(e.target.value)}
                className="w-16 bg-[#040812] border border-[#1E293B] rounded px-1.5 py-0.5 text-xs text-white font-mono text-center focus:border-[#00F0FF] focus:outline-none uppercase font-bold"
              />
            </div>
          </div>

          <input
            type="number"
            min="0"
            max="65535"
            value={aDec}
            onChange={(e) => {
              const val = Math.min(65535, Math.max(0, parseInt(e.target.value) || 0))
              setADec(val)
            }}
            className="w-full bg-[#040812] border border-[#1E293B] rounded-lg px-3 py-2 text-white font-mono text-lg font-bold focus:border-[#00F0FF] focus:outline-none"
          />

          {/* Clickable 16-Bit Toggle Matrix */}
          <div className="pt-2">
            <div className="text-[9px] font-mono text-[#64748B] mb-1 flex justify-between">
              <span>MSB [15]</span>
              <span>BIT TOGGLES</span>
              <span>[0] LSB</span>
            </div>
            <div className="grid grid-cols-16 gap-0.5">
              {Array.from({ length: 16 }, (_, i) => 15 - i).map((bitIdx) => {
                const bitVal = (aDec >> bitIdx) & 1
                return (
                  <button
                    key={bitIdx}
                    onClick={() => toggleBitA(bitIdx)}
                    title={`Toggle Bit A[${bitIdx}]`}
                    className={`h-5 text-[9px] font-mono font-bold rounded-sm transition ${
                      bitVal
                        ? 'bg-[#00F0FF] text-black shadow-sm'
                        : 'bg-[#121B2F] text-[#64748B] hover:text-white'
                    }`}
                  >
                    {bitVal}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Input B */}
        <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-[#00F0FF] flex items-center space-x-1.5">
              <span>OPERAND B</span>
              <span className="text-[10px] text-[#64748B]">[15:0]</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono text-[#94A3B8]">0x</span>
              <input
                type="text"
                maxLength={4}
                value={hexB}
                onChange={(e) => handleHexBChange(e.target.value)}
                className="w-16 bg-[#040812] border border-[#1E293B] rounded px-1.5 py-0.5 text-xs text-white font-mono text-center focus:border-[#00F0FF] focus:outline-none uppercase font-bold"
              />
            </div>
          </div>

          <input
            type="number"
            min="0"
            max="65535"
            value={bDec}
            onChange={(e) => {
              const val = Math.min(65535, Math.max(0, parseInt(e.target.value) || 0))
              setBDec(val)
            }}
            className="w-full bg-[#040812] border border-[#1E293B] rounded-lg px-3 py-2 text-white font-mono text-lg font-bold focus:border-[#00F0FF] focus:outline-none"
          />

          {/* Clickable 16-Bit Toggle Matrix */}
          <div className="pt-2">
            <div className="text-[9px] font-mono text-[#64748B] mb-1 flex justify-between">
              <span>MSB [15]</span>
              <span>BIT TOGGLES</span>
              <span>[0] LSB</span>
            </div>
            <div className="grid grid-cols-16 gap-0.5">
              {Array.from({ length: 16 }, (_, i) => 15 - i).map((bitIdx) => {
                const bitVal = (bDec >> bitIdx) & 1
                return (
                  <button
                    key={bitIdx}
                    onClick={() => toggleBitB(bitIdx)}
                    title={`Toggle Bit B[${bitIdx}]`}
                    className={`h-5 text-[9px] font-mono font-bold rounded-sm transition ${
                      bitVal
                        ? 'bg-[#00F0FF] text-black shadow-sm'
                        : 'bg-[#121B2F] text-[#64748B] hover:text-white'
                    }`}
                  >
                    {bitVal}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Carry-In & Simulation Action Controls */}
        <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono font-bold text-[#FF7A00] flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>CARRY-IN (Cin)</span>
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">1-BIT PORT</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setCin(val)
                    onSimulate(aDec, bDec, val, architecture)
                  }}
                  className={`py-2 rounded-lg font-mono font-bold text-sm transition ${
                    cin === val
                      ? 'bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/25'
                      : 'bg-[#040812] text-[#94A3B8] border border-[#1E293B] hover:text-white'
                  }`}
                >
                  Cin = {val}
                </button>
              ))}
            </div>
          </div>

          {/* Main Run Simulation Button */}
          <button
            onClick={handleRun}
            disabled={simulating}
            className="w-full py-3 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black hover:opacity-95 flex items-center justify-center space-x-2 transition shadow-xl shadow-[#00F0FF]/25 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{simulating ? 'COMPUTING VERILOG RTL...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Output Register & Telemetry Matrix */}
      {telemetry && (
        <div className="space-y-4 pt-2">
          {/* Main Result Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#060B14] p-4 rounded-xl border border-[#00F0FF]/30 space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#94A3B8]">16-Bit SUM (Decimal)</div>
              <div className="text-2xl font-mono font-bold text-[#00F0FF] glow-cyan">
                {telemetry.SUM}
              </div>
              <div className="text-[10px] font-mono text-[#64748B]">Range: 0 - 65,535</div>
            </div>

            <div className="bg-[#060B14] p-4 rounded-xl border border-[#00F0FF]/30 space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#94A3B8]">16-Bit SUM (Hex)</div>
              <div className="text-2xl font-mono font-bold text-[#00F0FF] glow-cyan">
                0x{telemetry.SUM.toString(16).toUpperCase().padStart(4, '0')}
              </div>
              <div className="text-[10px] font-mono text-[#64748B]">Binary: {telemetry.SUM.toString(2).padStart(16, '0')}</div>
            </div>

            <div className="bg-[#060B14] p-4 rounded-xl border border-[#FF7A00]/40 space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#94A3B8]">Carry-Out (Cout)</div>
              <div className={`text-2xl font-mono font-bold ${telemetry.Cout ? 'text-[#FF7A00] glow-orange' : 'text-white'}`}>
                {telemetry.Cout}
              </div>
              <div className="text-[10px] font-mono text-[#64748B]">Bit 16 (Overflow Carry)</div>
            </div>

            <div className="bg-[#060B14] p-4 rounded-xl border border-[#00DF72]/40 space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#94A3B8]">17-Bit Full Result</div>
              <div className="text-2xl font-mono font-bold text-[#00DF72] glow-green">
                {telemetry.FullResult}
              </div>
              <div className="text-[10px] font-mono text-[#00DF72] flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>GOLDEN MATCH</span>
              </div>
            </div>
          </div>

          {/* 4-Block Carry Propagation Step Animation Bar */}
          <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#FF7A00]" />
                <span>4-BLOCK CARRY PROPAGATION PIPELINE</span>
              </span>

              {/* Step Controls */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                <button
                  onClick={handleResetAnim}
                  className="p-1.5 rounded bg-[#121B2F] text-[#94A3B8] hover:text-white"
                  title="Reset Stage"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="px-2.5 py-1 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold flex items-center space-x-1"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'PAUSE' : 'STEP RUN'}</span>
                </button>
                <button
                  onClick={handleStepForward}
                  className="px-2 py-1 rounded bg-[#121B2F] text-[#E2E8F0] hover:bg-[#1E293B]"
                  title="Step Next Block"
                >
                  <StepForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Block Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              {[0, 1, 2, 3].map((bId) => {
                const b = telemetry.blocks?.[bId]
                const isSkip = b?.skip_active
                const isStepReached = animStep >= bId + 1

                return (
                  <div
                    key={bId}
                    className={`p-3 rounded-lg border transition-all ${
                      isStepReached
                        ? isSkip
                          ? 'bg-[#FF7A00]/10 border-[#FF7A00]/50 shadow-md shadow-[#FF7A00]/10'
                          : 'bg-[#00F0FF]/10 border-[#00F0FF]/40'
                        : 'bg-[#050914] border-[#1E293B]/40 opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="font-bold text-white">BLOCK {bId} [{bId * 4 + 3}:{bId * 4}]</span>
                      <span className={`text-[10px] font-bold ${isSkip ? 'text-[#FF7A00]' : 'text-[#00F0FF]'}`}>
                        {isSkip ? '⚡ SKIP' : '🔗 RIPPLE'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Cin: <b className="text-white">{b?.cin ?? 0}</b></span>
                        <span>Cout: <b className={b?.cout_actual ? 'text-[#FF7A00]' : 'text-white'}>{b?.cout_actual ?? 0}</b></span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>P_group:</span>
                        <span className={b?.p_group ? 'text-[#FF7A00] font-bold' : 'text-[#64748B]'}>
                          {b?.p_group ? '1 (PASS)' : '0 (BLOCK)'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
