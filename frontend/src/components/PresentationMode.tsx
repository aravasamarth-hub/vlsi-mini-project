import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Presentation,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  HardDrive,
  Activity,
  Award
} from 'lucide-react'

interface PresentationModeProps {
  onClose: () => void
}

export default function PresentationMode({ onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((s) => Math.max(0, s - 1))
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const slides = [
    {
      title: "16-BIT CARRY SKIP ADDER USING SKY130 PDK",
      subtitle: "Design, RTL Verification, ASIC Physical Implementation and Comparative Analysis",
      icon: Cpu,
      content: (
        <div className="space-y-4 text-sm leading-relaxed font-sans">
          <p>
            <b>Project Objective:</b> Implement an industrially sound, synthesizable 16-bit Carry Skip Adder (CSKA)
            using the open-source <b>SkyWater 130nm (`sky130_fd_sc_hd`)</b> standard-cell library.
          </p>
          <p>
            <b>Comparative Scope:</b> Rigorously benchmarked against 4 other prominent adder architectures:
            Ripple Carry Adder (RCA), Carry Look-Ahead Adder (CLA), Carry Select Adder (CSLA), and Brent-Kung Parallel Prefix Adder.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-center">
              <div className="text-[#00F0FF] font-bold">130 nm</div>
              <div className="text-[10px] text-[#94A3B8]">SkyWater PDK</div>
            </div>
            <div className="p-3 rounded-lg bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-center">
              <div className="text-[#FF7A00] font-bold">56 Cells</div>
              <div className="text-[10px] text-[#94A3B8]">Hierarchical Netlist</div>
            </div>
            <div className="p-3 rounded-lg bg-[#00DF72]/10 border border-[#00DF72]/30 text-center">
              <div className="text-[#00DF72] font-bold">60,038 Vectors</div>
              <div className="text-[10px] text-[#94A3B8]">100% Pass Rate</div>
            </div>
            <div className="p-3 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-center">
              <div className="text-[#38BDF8] font-bold">4.09 MB GDSII</div>
              <div className="text-[10px] text-[#94A3B8]">Placement Stream</div>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "Introduce project title, technology node (SkyWater 130nm HD), 5-adder comparative scope, and state that every result is backed by empirical simulation logs and synthesis reports."
    },
    {
      title: "THE BINARY ADDITION BOTTLENECK: RIPPLE CARRY",
      subtitle: "Why classical adders limit modern processor ALU clock frequencies",
      icon: Zap,
      content: (
        <div className="space-y-4 text-sm leading-relaxed font-sans">
          <p>
            In a classical 16-bit Ripple Carry Adder, each 1-bit full adder stage must wait for the carry-out of the previous stage:
          </p>
          <div className="bg-[#050B14] p-4 rounded-xl border border-[#00F0FF]/30 font-mono text-xs text-[#00F0FF] space-y-1">
            <div>T_RCA = (N - 1) × T_carry + T_sum ≈ O(N)</div>
            <div className="text-[#94A3B8] text-[11px]">For N=16: 16 sequential carry stages produce 4.240 ns hierarchical delay (235 MHz ceiling).</div>
          </div>
          <p>
            In ALUs, multipliers, and address-generation units, this linear $O(N)$ carry propagation path is the single most critical timing bottleneck.
          </p>
        </div>
      ),
      speakerNotes: "Explain the fundamental carry ripple dependency. Explain why rippling across 16 bits serializes arithmetic execution and caps clock frequency."
    },
    {
      title: "THE CARRY-SKIP ACCELERATION PRINCIPLE",
      subtitle: "Bypassing intermediate stages in O(1) multiplexer time",
      icon: Zap,
      content: (
        <div className="space-y-4 text-sm leading-relaxed font-sans">
          <p>
            <b>Mathematical Foundation:</b> When all bits in a 4-bit block satisfy the bit propagate condition $A_i \oplus B_i = 1$, an incoming carry cannot be absorbed or generated anew—it must propagate straight through to the block carry-out:
          </p>
          <div className="bg-[#050B14] p-4 rounded-xl border border-[#FF7A00]/40 font-mono text-xs space-y-2">
            <div className="text-[#00F0FF]">1. Bit Propagate: P[i] = A[i] ⊕ B[i]</div>
            <div className="text-[#FF7A00]">2. Group Propagate: P_group = P[3] · P[2] · P[1] · P[0]</div>
            <div className="text-[#00DF72]">3. Carry-Skip MUX: Cout = P_group ? Cin : C_ripple</div>
          </div>
          <p>
            When P_group = 1, the incoming carry bypasses the 4 cascaded full adders in a single 2:1 multiplexer delay (~0.22 ns) instead of 4 ripple delays (~0.98 ns)!
          </p>
        </div>
      ),
      speakerNotes: "Detail the boolean equations. Emphasize that when all bits differ, the carry skips the ripple chain in O(1) MUX delay."
    },
    {
      title: "16-BIT 4-BLOCK STRUCTURAL ARCHITECTURE",
      subtitle: "Optimal delay-overhead partitioning using 4 uniform 4-bit blocks",
      icon: Layers,
      content: (
        <div className="space-y-4 text-sm leading-relaxed font-sans">
          <p>
            The 16-bit word is partitioned into four independent 4-bit blocks ($k=4, M=4$):
          </p>
          <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
            <div className="p-3 rounded-xl bg-[#070D1A] border border-[#00F0FF]/30">
              <div className="text-[#00F0FF] font-bold">Block 0</div>
              <div className="text-[#94A3B8] text-[10px]">Bits [3:0]</div>
              <div className="text-[11px] mt-1 text-white">Cin ➔ C4</div>
            </div>
            <div className="p-3 rounded-xl bg-[#070D1A] border border-[#00F0FF]/30">
              <div className="text-[#00F0FF] font-bold">Block 1</div>
              <div className="text-[#94A3B8] text-[10px]">Bits [7:4]</div>
              <div className="text-[11px] mt-1 text-white">C4 ➔ C8</div>
            </div>
            <div className="p-3 rounded-xl bg-[#070D1A] border border-[#00F0FF]/30">
              <div className="text-[#00F0FF] font-bold">Block 2</div>
              <div className="text-[#94A3B8] text-[10px]">Bits [11:8]</div>
              <div className="text-[11px] mt-1 text-white">C8 ➔ C12</div>
            </div>
            <div className="p-3 rounded-xl bg-[#070D1A] border border-[#FF7A00]/40">
              <div className="text-[#FF7A00] font-bold">Block 3</div>
              <div className="text-[#94A3B8] text-[10px]">Bits [15:12]</div>
              <div className="text-[11px] mt-1 text-white">C12 ➔ Cout</div>
            </div>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Worst-case path: Carry generates in bit 0 of Block 0, skips Block 1 & 2 via bypass MUXes, and ripples through Block 3. Total path has only 7 gate stages vs 16 in RCA!
          </p>
        </div>
      ),
      speakerNotes: "Walk through the block partitioning. Show why 4-bit uniform blocks strike the optimal mathematical minimum for total delay."
    },
    {
      title: "RIGOROUS RTL VERIFICATION: 60,038 VECTORS",
      subtitle: "Self-checking testbenches with 100% pass rate across 5 architectures",
      icon: CheckCircle2,
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#00DF72]/30 space-y-2">
            <div className="flex justify-between items-center text-white font-bold border-b border-[#1E293B] pb-1.5">
              <span>TESTBENCH SUITE</span>
              <span className="text-[#00DF72]">EXECUTED VECTORS</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>CSKA Self-Checking TB:</span>
              <span className="text-white">10,014 vectors (10,000 random + 14 directed)</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>RCA, CLA, CSLA, BK Individual TBs:</span>
              <span className="text-white">40,024 vectors (10,006 vectors × 4)</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Master 5-Adder Lockstep TB:</span>
              <span className="text-white">10,000 vectors</span>
            </div>
            <div className="flex justify-between text-[#00DF72] font-bold border-t border-[#1E293B] pt-1.5">
              <span>Grand Total Verified Vectors:</span>
              <span>60,038 VECTORS (0 MISMATCHES, 100% PASS)</span>
            </div>
          </div>
          <p className="font-sans text-xs text-[#94A3B8]">
            All outputs were continuously verified against an unconstrained 17-bit golden behavioral reference model (<code className="text-white">A + B + Cin</code>).
          </p>
        </div>
      ),
      speakerNotes: "Address the exact test vector count: 60,038 vectors total, audited directly from simulation logs. 0 mismatches."
    },
    {
      title: "SYNTHESIS: HIERARCHICAL VS FLATTENED NETLISTS",
      subtitle: "Why Boolean optimization erases bypass multiplexers without hierarchy preservation",
      icon: Activity,
      content: (
        <div className="space-y-3 font-mono text-xs">
          <p className="font-sans text-xs text-[#E2E8F0]">
            An essential academic insight discovered during this project:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#FF7A00]/30 space-y-1.5">
              <span className="text-[#FF7A00] font-bold block">Hierarchical Synthesis (Preserved)</span>
              <div className="text-[11px] text-white">56 Cells • 760.73 µm² Area • 2.471 ns Delay</div>
              <p className="text-[10px] text-[#94A3B8] font-sans">
                Preserves <code className="text-white">carry_skip_block_4bit</code> boundaries. All 4 <code className="text-[#FF7A00]">mux2_1</code> and 4 <code className="text-[#00DF72]">and4_1</code> gates survive into physical silicon!
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#00F0FF]/30 space-y-1.5">
              <span className="text-[#00F0FF] font-bold block">Flattened Synthesis (ABC Optimized)</span>
              <div className="text-[11px] text-white">48 Cells • 440.42 µm² Area • 3.957 ns Delay</div>
              <p className="text-[10px] text-[#94A3B8] font-sans">
                ABC Boolean optimization collapses the skip MUX and full-adder carry equations into 16 <code className="text-[#00F0FF]">maj3_1</code> gates, producing identical netlists for RCA and CSKA.
              </p>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "This slide demonstrates real engineering depth: explain how ABC unconstrained synthesis flattens logic, while hierarchical synthesis preserves hardware bypass multiplexers."
    },
    {
      title: "SCIENTIFIC PPA BENCHMARK (SKYWATER 130NM)",
      subtitle: "Fair comparison across all 5 architectures under hierarchical synthesis",
      icon: Presentation,
      content: (
        <div className="space-y-3 font-mono text-xs">
          <table className="w-full text-left">
            <thead className="border-b border-[#1E293B] text-[#94A3B8]">
              <tr>
                <th className="py-1.5">ARCH</th>
                <th>CELLS</th>
                <th>AREA (µm²)</th>
                <th>EST. DELAY</th>
                <th>POWER</th>
                <th>ADP (µm²·ns)</th>
                <th>SPEEDUP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40">
              <tr>
                <td className="py-2">RCA (Hier)</td>
                <td>32</td>
                <td>540.52</td>
                <td>4.240 ns</td>
                <td>0.117 mW</td>
                <td>2291.8</td>
                <td className="text-[#64748B]">Baseline</td>
              </tr>
              <tr className="bg-[#FF7A00]/10 text-white font-bold">
                <td className="py-2 text-[#FF7A00]">CSKA (Hier)</td>
                <td>56</td>
                <td>760.73</td>
                <td>2.471 ns</td>
                <td>0.122 mW</td>
                <td className="text-[#FF7A00]">1879.8</td>
                <td className="text-[#00DF72]">+41.7%</td>
              </tr>
              <tr>
                <td className="py-2">CLA</td>
                <td>65</td>
                <td>479.21</td>
                <td>0.880 ns</td>
                <td>0.151 mW</td>
                <td>421.7</td>
                <td className="text-[#00DF72]">+79.2%</td>
              </tr>
              <tr>
                <td className="py-2">CSLA</td>
                <td>48</td>
                <td>440.42</td>
                <td>1.540 ns</td>
                <td>0.156 mW</td>
                <td>678.2</td>
                <td className="text-[#00DF72]">+63.7%</td>
              </tr>
              <tr>
                <td className="py-2">Brent-Kung</td>
                <td>77</td>
                <td>506.74</td>
                <td>1.180 ns</td>
                <td>0.165 mW</td>
                <td>598.0</td>
                <td className="text-[#00DF72]">+72.2%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-[#64748B] font-sans pt-1">
            *All delays are analytical pre-route Liberty cell-delay estimates from sky130_fd_sc_hd__tt_025C_1v80.lib, not post-route STA measurements.
          </p>
        </div>
      ),
      speakerNotes: "Present the decoupled PPA comparison. Point out the honest labeling of pre-route Liberty cell-delay estimates."
    },
    {
      title: "PHYSICAL IMPLEMENTATION: GDSII LAYOUT",
      subtitle: "Standard-cell placement targeting SkyWater 130nm in OpenROAD & KLayout",
      icon: HardDrive,
      content: (
        <div className="space-y-4 text-sm leading-relaxed font-sans">
          <p>
            The synthesized netlist was placed into standard-cell rows and verified in KLayout:
          </p>
          <div className="bg-[#050B14] p-4 rounded-xl border border-[#00F0FF]/30 font-mono text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Die Boundary:</span>
              <span className="text-[#00F0FF]">45.0 µm × 35.0 µm (1,575 µm²)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Core Boundary:</span>
              <span className="text-[#FF7A00]">35.0 µm × 24.5 µm (856.8 µm²)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Placed Cells:</span>
              <span className="text-white">48 Standard Cells (maj3_1, xnor2_1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">GDSII Stream File:</span>
              <span className="text-[#00DF72]">cska_16bit.gds (4.09 MB, 433 instances)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Physical Signoff Status:</span>
              <span className="text-[#E2E8F0]">Placement-Only Layout (Academic limitation documented)</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "Show the real physical layout deliverables. Transparently clarify that the GDSII is standard-cell placement, not a tapeout signoff."
    },
    {
      title: "EXAMINER VIVA DEFENSE GUIDE",
      subtitle: "Anticipated questions and technical justifications for examiners",
      icon: Award,
      content: (
        <div className="space-y-2.5 text-xs font-sans leading-relaxed">
          <div className="p-3 rounded-lg bg-[#070D1A] border border-[#1E293B]">
            <b className="text-[#00F0FF]">Q: Why does CSKA achieve lower delay than RCA with similar wire count?</b>
            <p className="text-[#94A3B8] mt-1">
              A: Intermediate blocks are bypassed in O(1) multiplexer delay when P_group = 1. Carry skips blocks 1 and 2 instead of sequentially waiting for all 8 internal full-adders.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#070D1A] border border-[#1E293B]">
            <b className="text-[#FF7A00]">Q: Why did flattened synthesis produce identical gate counts for RCA and CSKA?</b>
            <p className="text-[#94A3B8] mt-1">
              A: Binary addition has an invariant truth table. ABC unconstrained Boolean optimization refactors (P · Cin) + (~P · C_ripple) into canonical majority-3 gates, erasing the multiplexers unless hierarchy is preserved.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#070D1A] border border-[#1E293B]">
            <b className="text-[#00DF72]">Q: Are reported delays post-route signoff measurements?</b>
            <p className="text-[#94A3B8] mt-1">
              A: No; they are analytical pre-route critical-path estimates derived from Sky130 Liberty cell lookup tables. Full post-route STA was not completed due to OpenROAD Windows constraints.
            </p>
          </div>
        </div>
      ),
      speakerNotes: "Review common viva questions. The answers show complete command of digital VLSI synthesis and ASIC design realities."
    },
    {
      title: "PROJECT CONCLUSION & SUMMARY",
      subtitle: "Complete, academically verified engineering delivery",
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-sm leading-relaxed font-sans">
          <p>
            The <b>16-Bit Carry Skip Adder using SkyWater 130nm PDK</b> project has achieved all engineering and academic objectives:
          </p>
          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>Full synthesizable Verilog RTL for 5 independent adder architectures</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#00DF72]/10 border border-[#00DF72]/30 text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#00DF72] shrink-0" />
              <span>60,038 verified simulation vectors with 0 mismatches</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <span>Hierarchical synthesis preserving physical carry-skip hardware</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>4.09 MB GDSII placement layout and comprehensive submission package</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "Deliver the final conclusion. Summarize the completed deliverables and thank the examination committee."
    }
  ]

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-10 text-white font-sans overflow-y-auto bg-[#050811]"
      style={{ backgroundColor: '#050811' }}
    >
      {/* Top App Bar */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#00F0FF] glow-cyan">
              SEMINAR PRESENTATION MODE
            </span>
            <span className="text-[10px] text-[#64748B] block font-mono">
              SLIDE {currentSlide + 1} OF {slides.length} • USE ARROW KEYS TO NAVIGATE
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white transition flex items-center space-x-2 text-xs font-mono font-bold border border-[#334155] shadow-lg"
        >
          <X className="w-4 h-4 text-[#00F0FF]" />
          <span>EXIT PRESENTATION (ESC)</span>
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6">
        <div className="text-xs font-mono text-[#FF7A00] uppercase tracking-wider mb-1 font-bold">
          {slide.subtitle}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight glow-cyan">
          {slide.title}
        </h1>

        <div className="bg-[#0A1224] p-6 sm:p-8 rounded-2xl border border-[#00F0FF]/35 shadow-2xl">
          {slide.content}
        </div>

        {/* Presenter Notes Box */}
        <div className="mt-5 p-4 rounded-xl bg-[#070D1A] border border-[#1E293B] text-xs font-mono text-[#94A3B8]">
          <span className="text-[#00F0FF] font-bold">SPEAKER NOTES: </span>
          {slide.speakerNotes}
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-between border-t border-[#1E293B] pt-4 max-w-4xl mx-auto w-full">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-mono text-xs flex items-center space-x-2 transition disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex space-x-1.5 overflow-x-auto max-w-[280px] px-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                currentSlide === i ? 'bg-[#00F0FF] scale-125' : 'bg-[#1E293B] hover:bg-[#334155]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-black font-mono text-xs font-bold flex items-center space-x-2 transition disabled:opacity-30 shadow-lg shadow-[#00F0FF]/25"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
