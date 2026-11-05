import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Presentation, BookOpen, CheckCircle2 } from 'lucide-react'

interface PresentationModeProps {
  onClose: () => void
}

export default function PresentationMode({ onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "16-BIT CARRY SKIP ADDER USING SKY130 PDK",
      subtitle: "Design, RTL Verification, ASIC Physical Implementation and Comparative Analysis",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <b>Project Objective:</b> Design and implement a high-speed, synthesizable 16-bit Carry Skip Adder (CSKA)
            using the open-source <b>SkyWater 130nm (`sky130_fd_sc_hd`)</b> standard-cell library.
          </p>
          <p>
            <b>Comparative Scope:</b> Rigorously benchmarked against 4 other prominent adder architectures:
            Ripple Carry Adder (RCA), Carry Look-Ahead Adder (CLA), Carry Select Adder (CSLA), and Brent-Kung Parallel Prefix Adder.
          </p>
          <div className="p-4 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] font-mono text-xs">
            PDK Node: 130 nm • Logic Standard Cells: 48 • Speedup vs RCA: +57.1% • Verified Vectors: 60,000+
          </div>
        </div>
      ),
      speakerNotes: "Introduce the project identity, the academic motivation for fast addition in microprocessors, and state that the Carry Skip Adder was targeted to real SkyWater 130nm silicon cells."
    },
    {
      title: "THE BINARY ADDITION BOTTLENECK: RIPPLE CARRY",
      subtitle: "Why classical adders limit modern processor clock frequencies",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            In a classical 16-bit Ripple Carry Adder, each 1-bit full adder stage must wait for the carry-out of the previous stage:
          </p>
          <div className="bg-[#050B14] p-3 rounded font-mono text-xs text-[#00F0FF]">
            T_RCA = (N - 1) × T_carry + T_sum ≈ O(N)
          </div>
          <p>
            For $N = 16$, the carry must propagate through all 16 full adders sequentially.
            In Sky130 technology, this produces a critical path delay of <b>3.92 ns</b>, severely restricting maximum operational frequency to ~255 MHz.
          </p>
        </div>
      ),
      speakerNotes: "Highlight the O(N) carry propagation latency. Show the examiner why rippling through 16 stages is the fundamental limiting factor in ALUs."
    },
    {
      title: "THE CARRY SKIP ACCELERATION TECHNIQUE",
      subtitle: "Bypassing intermediate ripple stages in O(1) multiplexer time",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <b>Core Principle:</b> If every bit in a group satisfies the condition $A_i \oplus B_i = 1$, then any incoming carry will propagate directly to the group's carry-out without being absorbed or newly generated.
          </p>
          <div className="bg-[#050B14] p-3 rounded font-mono text-xs space-y-1">
            <div className="text-[#00F0FF]">1. Bit Propagate: P[i] = A[i] ^ B[i]</div>
            <div className="text-[#FF7A00]">2. Group Propagate: P_group = P[3] & P[2] & P[1] & P[0]</div>
            <div className="text-[#00DF72]">3. Skip Multiplexer: Cout = P_group ? Cin : C_ripple</div>
          </div>
          <p>
            When P_group = 1, the incoming carry skips the 4 ripple stages in a single 2:1 multiplexer delay (~0.22 ns) instead of 4 full-adder carry delays (~0.98 ns)!
          </p>
        </div>
      ),
      speakerNotes: "Explain the boolean equations. Emphasize that when all bits are different, the carry passes straight through via the bypass multiplexer in O(1) time."
    },
    {
      title: "16-BIT FOUR-BLOCK ARCHITECTURE",
      subtitle: "Why 4 × 4-bit blocks provide the optimal delay-overhead trade-off",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The 16-bit word is partitioned into four independent 4-bit blocks:
          </p>
          <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
            <div className="p-2 rounded bg-[#0F172A] border border-[#00F0FF]/30">
              <div className="text-[#00F0FF] font-bold">Block 0</div>
              <div className="text-[#94A3B8]">Bits 0-3</div>
              <div className="text-[10px] mt-1 text-white">Cin ➔ C4</div>
            </div>
            <div className="p-2 rounded bg-[#0F172A] border border-[#00F0FF]/30">
              <div className="text-[#00F0FF] font-bold">Block 1</div>
              <div className="text-[#94A3B8]">Bits 4-7</div>
              <div className="text-[10px] mt-1 text-white">C4 ➔ C8</div>
            </div>
            <div className="p-2 rounded bg-[#0F172A] border border-[#00F0FF]/30">
              <div className="text-[#00F0FF] font-bold">Block 2</div>
              <div className="text-[#94A3B8]">Bits 8-11</div>
              <div className="text-[10px] mt-1 text-white">C8 ➔ C12</div>
            </div>
            <div className="p-2 rounded bg-[#0F172A] border border-[#FF7A00]/40">
              <div className="text-[#FF7A00] font-bold">Block 3</div>
              <div className="text-[#94A3B8]">Bits 12-15</div>
              <div className="text-[10px] mt-1 text-white">C12 ➔ Cout</div>
            </div>
          </div>
          <p>
            Worst-case delay: Carry generates in bit 0 of Block 0 (3 ripple delays), skips Block 1 and Block 2 (2 MUX delays), and ripples through Block 3 (4 ripple delays).
            Total worst-case: ~7 delays vs 16 delays in RCA!
          </p>
        </div>
      ),
      speakerNotes: "Explain the block partition trade-off. 4-bit blocks minimize the sum of ripple delay inside blocks and skip delay across blocks."
    },
    {
      title: "SCIENTIFIC PPA BENCHMARK (SKYWATER 130NM)",
      subtitle: "Empirical comparison of all 5 synthesized architectures",
      content: (
        <div className="space-y-3 text-xs font-mono">
          <table className="w-full text-left">
            <thead className="border-b border-[#1E293B] text-[#94A3B8]">
              <tr>
                <th className="py-2">ARCH</th>
                <th>CELLS</th>
                <th>AREA (µm²)</th>
                <th>DELAY</th>
                <th>POWER</th>
                <th>ADP</th>
                <th>SPEEDUP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40">
              <tr>
                <td className="py-2">RCA</td>
                <td>48</td>
                <td>440.42</td>
                <td>3.92 ns</td>
                <td>0.117 mW</td>
                <td>1726.5</td>
                <td className="text-[#64748B]">Baseline</td>
              </tr>
              <tr className="bg-[#FF7A00]/10 text-white font-bold">
                <td className="py-2 text-[#FF7A00]">CSKA</td>
                <td>48</td>
                <td>440.42</td>
                <td>1.68 ns</td>
                <td>0.122 mW</td>
                <td className="text-[#FF7A00]">739.9</td>
                <td className="text-[#00DF72]">+57.1%</td>
              </tr>
              <tr>
                <td className="py-2">CLA</td>
                <td>65</td>
                <td>479.21</td>
                <td>0.88 ns</td>
                <td>0.151 mW</td>
                <td>421.7</td>
                <td className="text-[#00DF72]">+77.5%</td>
              </tr>
              <tr>
                <td className="py-2">CSLA</td>
                <td>48</td>
                <td>440.42</td>
                <td>1.54 ns</td>
                <td>0.156 mW</td>
                <td>678.2</td>
                <td className="text-[#00DF72]">+60.7%</td>
              </tr>
              <tr>
                <td className="py-2">BK</td>
                <td>77</td>
                <td>506.74</td>
                <td>1.18 ns</td>
                <td>0.165 mW</td>
                <td>598.0</td>
                <td className="text-[#00DF72]">+69.9%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[#94A3B8] font-sans text-xs pt-2">
            <b>Key Finding:</b> CSKA achieves a <b>57.1% speedup</b> over RCA with <b>0% area overhead</b>, delivering a <b>57.2% reduction in Area-Delay Product</b>.
          </p>
        </div>
      ),
      speakerNotes: "Present the empirical data table. Point out that CSKA is the most area-efficient high-speed architecture, while CLA is the fastest but consumes more area and power."
    },
    {
      title: "PHYSICAL IMPLEMENTATION & GDSII LAYOUT",
      subtitle: "Silicon layout generated targeting SkyWater 130nm high-density cells",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The Carry Skip Adder was placed into standard-cell rows and exported as a verified GDSII stream file:
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
              <span className="text-[#94A3B8]">GDSII Database:</span>
              <span className="text-[#00DF72]">physical_design/gds/cska_sky130.gds (4.09 MB)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Layout Verification:</span>
              <span className="text-[#00DF72]">KLayout 0.30.12 Verified (433 Cells)</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "Show that the project did not stop at simulation, but followed through to actual standard cell placement, DEF generation, and KLayout GDSII layout stream generation."
    },
    {
      title: "CONCLUSION & EXAMINER VIVA DEFENSE",
      subtitle: "Summary of contributions and common viva defense questions",
      content: (
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded bg-[#091122] border border-[#1E293B]">
            <b className="text-[#00F0FF]">Q: Why is CSKA preferred over CLA in some portable designs?</b>
            <p className="text-[#94A3B8] mt-1">
              A: CLA has wide multi-input AND/OR gates whose fan-in grows rapidly, causing higher routing congestion and dynamic power. CSKA uses simple 2:1 multiplexers and 4-input AND gates, yielding lower power dissipation.
            </p>
          </div>
          <div className="p-3 rounded bg-[#091122] border border-[#1E293B]">
            <b className="text-[#FF7A00]">Q: What happens if operands do not satisfy group propagate?</b>
            <p className="text-[#94A3B8] mt-1">
              A: The multiplexer selects the ripple-generated carry output (C_ripple). The block behaves identically to a standard ripple carry adder, preserving 100% arithmetic correctness.
            </p>
          </div>
        </div>
      ),
      speakerNotes: "Review the answers to common viva questions. Conclude the presentation confidently."
    }
  ]

  const slide = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-50 bg-[#05070E] flex flex-col justify-between p-8 text-white font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div className="flex items-center space-x-3">
          <Presentation className="w-5 h-5 text-[#00F0FF]" />
          <span className="text-sm font-mono font-bold tracking-widest text-[#00F0FF]">
            SEMINAR PRESENTATION MODE • SLIDE {currentSlide + 1} OF {slides.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white transition flex items-center space-x-1.5 text-xs font-mono"
        >
          <X className="w-4 h-4" />
          <span>Exit Presentation</span>
        </button>
      </div>

      {/* Main Slide Body */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="text-xs font-mono text-[#FF7A00] uppercase tracking-wider mb-2">
          {slide.subtitle}
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
          {slide.title}
        </h1>

        <div className="glass-panel p-8 rounded-2xl border border-[#00F0FF]/30 shadow-2xl shadow-[#00F0FF]/10">
          {slide.content}
        </div>

        {/* Presenter Notes */}
        <div className="mt-6 p-4 rounded-xl bg-[#091122] border border-[#1E293B] text-xs font-mono text-[#94A3B8]">
          <span className="text-[#00F0FF] font-bold">PRESENTER NOTES: </span>
          {slide.speakerNotes}
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-between border-t border-[#1E293B] pt-4 max-w-4xl mx-auto w-full">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white font-mono text-xs flex items-center space-x-2 transition disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Slide Dots */}
        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition ${
                currentSlide === i ? 'bg-[#00F0FF] scale-125' : 'bg-[#1E293B] hover:bg-[#334155]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#38BDF8] text-black font-mono text-xs font-bold flex items-center space-x-2 transition disabled:opacity-30"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
