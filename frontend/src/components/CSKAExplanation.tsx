import React, { useState } from 'react'
import {
  Lightbulb,
  Zap,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle,
  Binary
} from 'lucide-react'

export default function CSKAExplanation() {
  const [activeStep, setActiveStep] = useState<number>(1)
  const [demoBlock, setDemoBlock] = useState<{ a: string; b: string; cin: number }>({
    a: '1111',
    b: '0000',
    cin: 1
  })

  // Calculate live bit propagate and group propagate for the demo block
  const aBits = demoBlock.a.split('').map(Number)
  const bBits = demoBlock.b.split('').map(Number)
  const pBits = aBits.map((a, idx) => a ^ bBits[idx])
  const gBits = aBits.map((a, idx) => a & bBits[idx])
  const pGroup = pBits[0] && pBits[1] && pBits[2] && pBits[3] ? 1 : 0

  let cRipple = demoBlock.cin
  for (let i = 0; i < 4; i++) {
    cRipple = gBits[i] | (cRipple & pBits[i])
  }
  const coutFinal = pGroup ? demoBlock.cin : cRipple

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#0066FF] text-black">
              <Zap className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white glow-cyan">
                HOW CARRY SKIP ADDITION WORKS
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Interactive Tutorial • Binary Addition Fundamentals → Propagate/Generate Logic → Express Carry Bypass
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#00DF72]/15 text-[#00DF72] border border-[#00DF72]/40 font-bold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>STEP-BY-STEP PEDAGOGICAL ENGINE</span>
            </span>
          </div>
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1">
          {[
            { id: 1, title: '1. Binary Addition' },
            { id: 2, title: '2. 1-Bit Full Adder' },
            { id: 3, title: '3. Propagate & Generate' },
            { id: 4, title: '4. Group Propagate' },
            { id: 5, title: '5. Bypass Multiplexer' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id)}
              className={`p-3 rounded-xl border text-center transition font-bold ${
                activeStep === st.id
                  ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-lg shadow-[#00F0FF]/15'
                  : 'bg-[#060A14] border-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              {st.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step Detail Content */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/20 shadow-2xl space-y-6">
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h2 className="text-base font-bold text-white glow-cyan">
                STEP 1: THE FOUNDATION — HOW BINARY DIGITS ADD TOGETHER
              </h2>
              <span className="text-[10px] text-[#64748B]">BASE-2 ARITHMETIC RULES</span>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              In normal decimal math, you have digits 0 through 9. When you add 9 + 1, you write down 0 and carry a 1 to the tens place.
              In binary (base 2), computers only have two digits: 0 and 1. Here are the four fundamental rules of binary addition:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] text-center space-y-1">
                <span className="text-xs text-[#64748B]">Case 1</span>
                <div className="text-base font-bold text-white">0 + 0 = 0</div>
                <div className="text-[10px] text-[#00DF72]">Sum = 0, Carry = 0</div>
              </div>
              <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] text-center space-y-1">
                <span className="text-xs text-[#64748B]">Case 2</span>
                <div className="text-base font-bold text-white">0 + 1 = 1</div>
                <div className="text-[10px] text-[#00DF72]">Sum = 1, Carry = 0</div>
              </div>
              <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] text-center space-y-1">
                <span className="text-xs text-[#64748B]">Case 3</span>
                <div className="text-base font-bold text-white">1 + 0 = 1</div>
                <div className="text-[10px] text-[#00DF72]">Sum = 1, Carry = 0</div>
              </div>
              <div className="p-4 rounded-xl bg-[#060A14] border border-[#FF7A00]/40 text-center space-y-1 bg-[#FF7A00]/5">
                <span className="text-xs text-[#FF7A00]">Case 4 (Carry!)</span>
                <div className="text-base font-bold text-[#FF7A00]">1 + 1 = 10₂</div>
                <div className="text-[10px] text-[#FF7A00]">Sum = 0, Carry = 1</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] space-y-2">
              <span className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-wider">
                What if there is already an incoming carry (Cin = 1)?
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                When adding three 1s together (A=1, B=1, Cin=1): 1 + 1 + 1 = 3 (which in binary is 11₂).
                Therefore, <strong>Sum = 1</strong> and <strong>Carry = 1</strong>.
              </p>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h2 className="text-base font-bold text-white glow-cyan">
                STEP 2: THE 1-BIT FULL ADDER BUILDING BLOCK
              </h2>
              <span className="text-[10px] text-[#64748B]">TRANSISTOR IMPLEMENTATION</span>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              A 1-bit full adder takes three inputs: operand bits <code>A</code> and <code>B</code>, plus an incoming carry <code>Cin</code>.
              It produces two outputs: <code>Sum</code> and <code>Cout</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#060A14] border border-[#00F0FF]/30 space-y-2">
                <span className="text-xs font-bold text-[#00F0FF]">SUM LOGIC FORMULA</span>
                <div className="p-3 rounded-lg bg-[#050811] text-center font-mono text-sm text-[#00F0FF]">
                  Sum = A ⊕ B ⊕ Cin
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Computed using two XOR gates. The sum is 1 whenever an odd number of inputs are 1.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#060A14] border border-[#FF7A00]/30 space-y-2">
                <span className="text-xs font-bold text-[#FF7A00]">CARRY-OUT LOGIC FORMULA</span>
                <div className="p-3 rounded-lg bg-[#050811] text-center font-mono text-sm text-[#FF7A00]">
                  Cout = (A · B) + (Cin · (A ⊕ B))
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Computed in Sky130 HD using a Majority-3 standard cell (<code>maj3_1</code>).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h2 className="text-base font-bold text-white glow-cyan">
                STEP 3: CARRY PROPAGATE (P) AND CARRY GENERATE (G)
              </h2>
              <span className="text-[10px] text-[#64748B]">THE SECRET TO SPEED</span>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Notice what determines whether a carry continues forward into the next stage:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#060A14] border border-[#00DF72]/30 space-y-2">
                <span className="text-xs font-bold text-[#00DF72]">1. CARRY PROPAGATE: P = A ⊕ B</span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  If exactly one of the inputs is 1 (either A=1 or B=1), then P = 1.
                  When P = 1, if any carry comes in (Cin=1), it will <strong>pass straight through</strong> to Cout!
                </p>
                <div className="p-2 rounded bg-[#050811] text-[11px] text-[#00DF72] font-mono text-center">
                  When P = 1: Cout = Cin
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A14] border border-[#FF7A00]/30 space-y-2">
                <span className="text-xs font-bold text-[#FF7A00]">2. CARRY GENERATE: G = A · B</span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  If both inputs are 1 (A=1 and B=1), then G = 1.
                  This bit creates a brand new carry of its own, regardless of what Cin was!
                </p>
                <div className="p-2 rounded bg-[#050811] text-[11px] text-[#FF7A00] font-mono text-center">
                  When G = 1: Cout = 1 (Always)
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h2 className="text-base font-bold text-white glow-cyan">
                STEP 4: THE CARRY SKIP BREAKTHROUGH — GROUP PROPAGATE
              </h2>
              <span className="text-[10px] text-[#64748B]">4-BIT BLOCK COHESION</span>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Here is the stroke of genius in the Carry Skip Adder:
              Instead of checking one bit at a time, we group 4 bits together (Bits 0, 1, 2, and 3).
              What happens if <strong>all 4 bits have P = 1</strong> at the same time?
            </p>

            <div className="p-4 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 space-y-2 text-center">
              <span className="text-xs font-bold text-[#00F0FF]">GROUP PROPAGATE EQUATION</span>
              <div className="text-base font-bold text-white font-mono">
                P_group = P3 · P2 · P1 · P0
              </div>
              <p className="text-xs text-[#94A3B8]">
                If P_group = 1, we already know with 100% mathematical certainty that if Cin=1 arrives at the entrance of the block,
                it will ripple all the way to Cout!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] space-y-2">
              <span className="text-xs font-bold text-[#00DF72]">THE KEY INSIGHT</span>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Why force the carry signal to slowly crawl through 4 full adders one by one?
                Since we already know it will pass through, we can route a direct wire around the entire 4-bit block!
              </p>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h2 className="text-base font-bold text-white glow-cyan">
                STEP 5: THE 2:1 BYPASS MULTIPLEXER (THE EXPRESS SWITCH)
              </h2>
              <span className="text-[10px] text-[#64748B]">CARRY SKIP HARDWARE</span>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              At the exit of each 4-bit block, we place a 2-to-1 Multiplexer (like a railway track switcher):
            </p>

            <div className="p-4 rounded-xl bg-[#050811] border border-[#1E293B] space-y-3">
              <div className="text-center font-mono text-sm text-[#00F0FF] font-bold">
                Cout = (P_group) ? Cin : C_ripple
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-[#00DF72]/10 border border-[#00DF72]/30 text-xs text-[#CBD5E1]">
                  <strong className="text-[#00DF72]">If P_group = 1:</strong> The multiplexer selects <code>Cin</code> directly!
                  The carry takes the express bypass highway in just <strong>0.15 ns</strong>.
                </div>
                <div className="p-3 rounded-lg bg-[#64748B]/10 border border-[#64748B]/30 text-xs text-[#CBD5E1]">
                  <strong className="text-white">If P_group = 0:</strong> The multiplexer selects <code>C_ripple</code> (the normal local ripple result).
                </div>
              </div>
            </div>

            {/* Interactive Single-Block Sandbox */}
            <div className="p-5 rounded-xl bg-[#060A14] border border-[#00F0FF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-2">
                  <Play className="w-4 h-4 text-[#00F0FF]" />
                  <span>INTERACTIVE 4-BIT BLOCK SANDBOX</span>
                </span>
                <span className="text-[10px] text-[#64748B]">Try different operand presets</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDemoBlock({ a: '1111', b: '0000', cin: 1 })}
                  className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/25 font-bold"
                >
                  Preset 1: Full Skip (A=1111, B=0000, Cin=1)
                </button>
                <button
                  onClick={() => setDemoBlock({ a: '1010', b: '0101', cin: 1 })}
                  className="px-3 py-1.5 rounded-lg bg-[#00DF72]/15 border border-[#00DF72]/40 text-[#00DF72] hover:bg-[#00DF72]/25 font-bold"
                >
                  Preset 2: Alternating Skip (A=1010, B=0101, Cin=1)
                </button>
                <button
                  onClick={() => setDemoBlock({ a: '1100', b: '1100', cin: 0 })}
                  className="px-3 py-1.5 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/40 text-[#FF7A00] hover:bg-[#FF7A00]/25 font-bold"
                >
                  Preset 3: Local Generate (A=1100, B=1100, Cin=0)
                </button>
              </div>

              {/* Telemetry Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-center">
                <div className="p-3 rounded-lg bg-[#050811] border border-[#1E293B]">
                  <span className="text-[10px] text-[#64748B]">OPERANDS</span>
                  <div className="text-xs font-bold text-white">A = {demoBlock.a}</div>
                  <div className="text-xs font-bold text-white">B = {demoBlock.b}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#050811] border border-[#1E293B]">
                  <span className="text-[10px] text-[#64748B]">BIT PROPAGATES</span>
                  <div className="text-xs font-bold text-[#00F0FF] font-mono">
                    P = [{pBits.join(', ')}]
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#050811] border border-[#1E293B]">
                  <span className="text-[10px] text-[#64748B]">GROUP PROPAGATE</span>
                  <div
                    className={`text-sm font-bold ${
                      pGroup ? 'text-[#00DF72]' : 'text-[#64748B]'
                    }`}
                  >
                    P_group = {pGroup}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border ${
                    pGroup
                      ? 'bg-[#00DF72]/15 border-[#00DF72]/40 text-[#00DF72]'
                      : 'bg-[#64748B]/15 border-[#64748B]/40 text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">ACTIVE PATH</span>
                  <div className="text-xs font-bold">
                    {pGroup ? 'EXPRESS BYPASS SKIP' : 'LOCAL RIPPLE CARRY'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
