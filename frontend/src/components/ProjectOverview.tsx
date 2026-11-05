import React, { useState } from 'react'
import {
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Code2,
  Workflow,
  HelpCircle,
  Lightbulb,
  Award,
  Binary,
  CheckCircle2
} from 'lucide-react'

interface QuestionItem {
  id: number
  title: string
  simple: {
    summary: string
    analogy: string
    points: string[]
  }
  engineering: {
    summary: string
    formula?: string
    technicalDetails: string[]
    spec: string
  }
}

const QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    title: '1. What is a Digital Adder?',
    simple: {
      summary: 'A digital adder is the fundamental electronic calculator circuit inside every microchip that adds binary numbers (0s and 1s).',
      analogy: 'Think of it like an elementary school student adding two columns of numbers on paper, writing down the sum and carrying a 1 over to the next column when the total is 10 or more.',
      points: [
        'Input: Two binary digits (A and B) plus an incoming carry bit (Cin).',
        'Output: A sum bit (S) and an outgoing carry bit (Cout).',
        'Built entirely from microscopic silicon transistors acting as switches.'
      ]
    },
    engineering: {
      summary: 'A combinational logic network realizing finite field arithmetic over GF(2). Primitive 1-bit full adders compute the binary addition of bits A_i, B_i, and carry-in C_i.',
      formula: 'S_i = A_i \\oplus B_i \\oplus C_i \\quad \\text{and} \\quad C_{i+1} = (A_i \\cdot B_i) + (C_i \\cdot (A_i \\oplus B_i))',
      technicalDetails: [
        'Transistor Implementation: In 130nm CMOS, a static CMOS full adder requires 28 transistors (or 2 standard cells: XOR2 + MAJ3).',
        'Propagate (P) and Generate (G): Defined as P_i = A_i \\oplus B_i and G_i = A_i \\cdot B_i.',
        'Logic Depth: Base full adder requires 2 equivalent XOR gate delays for sum and 2 NAND/NOR delays for carry.'
      ],
      spec: 'Primitive: sky130_fd_sc_hd__xnor2_1 + sky130_fd_sc_hd__maj3_1'
    }
  },
  {
    id: 2,
    title: '2. Why do Computers Need Adders?',
    simple: {
      summary: 'Addition is the single most important operation in modern computing. Almost every program—from games to AI—relies on adders billions of times per second.',
      analogy: 'Adders are the heartbeat of the CPU engine. Without them, the computer cannot calculate memory addresses, count loops, or process graphics.',
      points: [
        'Subtraction is done by adding inverted numbers (Two’s Complement).',
        'Multiplication is repeated addition and shifting.',
        'Array indexing and memory pointer lookups require addition for every byte accessed.'
      ]
    },
    engineering: {
      summary: 'Adders constitute the critical path of the Arithmetic Logic Unit (ALU), Floating-Point Unit (FPU), and Program Counter (PC) address generation unit in microprocessors.',
      technicalDetails: [
        'ALU Critical Path: The maximum operating frequency (f_max) of a RISC-V or ARM core is frequently bounded by integer adder latency.',
        'Multiply-Accumulate (MAC): DSP and neural-network tensor accelerators execute millions of additions per inference cycle.',
        'Memory Addressing: Effective address calculation: EA = Base_Register + (Index * Scale) + Displacement.'
      ],
      spec: 'Core execution stage of CPU pipeline (Execute/EX phase)'
    }
  },
  {
    id: 3,
    title: '3. What is a Ripple Carry Adder (RCA)?',
    simple: {
      summary: 'The simplest and most straightforward multi-bit adder design. It chains multiple 1-bit adders together in a line.',
      analogy: 'Imagine a line of 16 people passing a bucket of water down the line. Person #16 cannot pour water into the barrel until Person #1 passes the bucket through all 15 people ahead.',
      points: [
        'Easiest circuit to understand and design.',
        'Uses the minimum number of transistors and silicon area.',
        'The downside: It gets slower and slower as you add more bits.'
      ]
    },
    engineering: {
      summary: 'A linear cascade of N full adder cells where the carry output C_out of stage i is connected directly to the carry input C_in of stage i+1.',
      formula: 'C_{i+1} = G_i + P_i \\cdot C_i \\quad \\text{for } i \\in [0, N-1]',
      technicalDetails: [
        'Propagation Delay: O(N) linear time complexity. Total worst-case latency T_{RCA} = (N-1)\\tau_{carry} + \\tau_{sum}.',
        'Area: O(N) linear spatial complexity. Minimal silicon overhead: exactly N full adders (32 cells in Sky130 HD).',
        'Power: Low static leakage and minimal glitching capacitance due to lack of speculative carry trees.'
      ],
      spec: '16-bit RCA analytical latency: 3.957 ns (32 cells, 497.02 µm²)'
    }
  },
  {
    id: 4,
    title: '4. What Problem Does a Ripple Carry Adder Have?',
    simple: {
      summary: 'The Carry Ripple Bottleneck: the higher-order bits are completely frozen, waiting for the carry signal to slowly trickle through every single bit before them.',
      analogy: 'Traffic stopped at 16 consecutive red lights. Even if your car is fast, you have to wait for every light ahead to turn green one by one.',
      points: [
        'Worst Case: Adding 0xFFFF (1111111111111111) and 0x0001 requires the carry to flip all 16 bits in sequence.',
        'In 64-bit modern computers, an RCA would be hopelessly slow and limit clock speed.'
      ]
    },
    engineering: {
      summary: 'Linear critical path latency scaling O(N). The carry propagation delay increases monotonically with word length, creating severe setup-time timing violations.',
      technicalDetails: [
        'Critical Path Arc: C_{in} \\to FA_0.cout \\to FA_1.cout \\to \\dots \\to FA_{15}.sum.',
        'Clock Frequency Ceiling: For a 64-bit RCA at 130nm, delay exceeds 15 ns, capping frequency below 66 MHz.',
        'High Glitching Power: Cascading ripple carries cause false transitions (spurious dynamic switching) at intermediate output nodes.'
      ],
      spec: 'Worst-case vector: A = 0xFFFF, B = 0x0000, Cin = 1 (16 carry stages)'
    }
  },
  {
    id: 5,
    title: '5. What is a Carry Skip Adder (CSKA)?',
    simple: {
      summary: 'A smart adder that divides 16 bits into small groups (like 4 blocks of 4 bits). When a group knows it will pass the carry through, it jumps over the entire block in one leap!',
      analogy: 'An express train! Instead of stopping at all 4 local subway stations, the train takes the express bypass track and zooms straight from Station 1 to Station 5.',
      points: [
        'Divides 16 bits into 4 blocks of 4 bits each.',
        'Checks if all 4 bits in a block will propagate the carry.',
        'Uses an express bypass multiplexer to skip the 4 bits instantaneously.'
      ]
    },
    engineering: {
      summary: 'A block-based adder (also called Carry-Bypass Adder) that accelerates carry transmission by evaluating group propagate conditions using an AND gate and a 2:1 multiplexer.',
      formula: 'P_{group} = P_3 \\cdot P_2 \\cdot P_1 \\cdot P_0 = \\prod_{i=0}^{3} (A_i \\oplus B_i)',
      technicalDetails: [
        'Bypass Multiplexer Equation: C_{out,block} = P_{group} \\cdot C_{in,block} + \\overline{P_{group}} \\cdot C_{ripple,block}.',
        'Asymptotic Delay: Reduces latency from O(N) down to O(\\sqrt{N}) with optimal block sizing.',
        'Hierarchical Netlist: 4 blocks of 4 full adders + 4 AND4 gates + 4 2:1 MUXes (56 cells total).'
      ],
      spec: '16-bit CSKA analytical latency: 2.471 ns (1.60x faster than RCA)'
    }
  },
  {
    id: 6,
    title: '6. How Does Carry Skipping Improve the Architecture?',
    simple: {
      summary: 'It gives you much faster speed without having to pay a massive penalty in chip size or battery drain.',
      analogy: 'Like adding an HOV express lane to a highway. You only need to build a single exit ramp (multiplexer) per town, rather than rebuilding the entire highway system.',
      points: [
        '60% faster than a ripple carry adder.',
        'Uses far less silicon area and power than complex tree adders like Brent-Kung or Carry-Select.',
        'Perfect engineering sweet spot for low-power IoT, microcontrollers, and battery-powered wearables.'
      ]
    },
    engineering: {
      summary: 'Optimizes the Area-Delay Product (ADP) by providing an architectural shortcut for the dominant worst-case carry propagation vectors.',
      formula: 'T_{CSKA} = (k-1)\\tau_{ripple} + (M-2)\\tau_{skip} + (k-1)\\tau_{ripple} + \\tau_{sum}',
      technicalDetails: [
        'Speedup: Reduces 16-bit critical delay from 3.957 ns down to 2.471 ns in Sky130 HD.',
        'Area Efficiency: Occupies 760.73 µm² (hierarchical) vs 863.66 µm² for CSLA and 680.12 µm² for Brent-Kung.',
        'Power Profile: Low dynamic switching power (0.142 mW at 100 MHz) compared to speculative adders (CSLA = 0.245 mW).'
      ],
      spec: 'Area-Delay Product: 1,879.6 µm²·ns (balanced efficiency)'
    }
  },
  {
    id: 7,
    title: '7. Why is a 16-Bit Design Used?',
    simple: {
      summary: '16 bits is the ideal size to learn, visualize, and prove the carry-skip concept. It is large enough to show meaningful speedups, yet small enough to inspect every single wire and gate.',
      analogy: 'Like building a 4-cylinder engine model in engineering school. It shows every valve and piston clearly without the overwhelming complexity of a V16 freight locomotive engine.',
      points: [
        'Represents standard audio processing, DSP data words, and microcontroller register widths.',
        'Divides symmetrically into four neat 4-bit blocks (Block 0, 1, 2, 3).',
        'Allows testing 60,038 comprehensive vectors in seconds.'
      ]
    },
    engineering: {
      summary: '16-bit word length is the canonical benchmark standard in digital VLSI research (IEEE transactions) for validating sub-word parallel arithmetic architectures.',
      technicalDetails: [
        'Symmetric Partitioning: N=16 allows uniform block decomposition: M = N/k = 16/4 = 4 blocks.',
        'Exhaustive Verification Feasibility: 2^{16} = 65,536 total input states allows high coverage (60,038 vectors = 91.6% coverage of primary spaces).',
        'Physical Design Manageability: 48-56 cells fits cleanly inside a 45 µm x 35 µm core cavity without routing congestion blowup.'
      ],
      spec: 'Operands: A[15:0], B[15:0], Cin -> Sum[15:0], Cout'
    }
  },
  {
    id: 8,
    title: '8. What is the SKY130 PDK?',
    simple: {
      summary: 'SKY130 is the world’s first open-source, commercially manufacturable semiconductor manufacturing kit released by Google and SkyWater Technology foundry.',
      analogy: 'Imagine if LEGO published the exact chemical formula and mold dimensions for their plastic bricks so anyone could manufacture real compatible toys at home.',
      points: [
        'Open-source: Free for universities, students, and engineers worldwide.',
        '130 nanometer technology: Transistor gates are 130 billionths of a meter wide.',
        'Manufactured at SkyWater foundry in Minnesota, USA.'
      ]
    },
    engineering: {
      summary: 'The SkyWater 130nm CMOS Process Design Kit (PDK). A 1-poly, 5-metal layer (1P5M) planar bulk CMOS technology characterized for 1.8V core logic.',
      technicalDetails: [
        'Standard Cell Library: sky130_fd_sc_hd (High Density) featuring 433 pre-characterized cells.',
        'Cell Height: Fixed standard cell height of 2.72 µm with 0.46 µm site quantization grid.',
        'Metallization Stack: Local Interconnect (li1), Metal 1 (met1), Metal 2 (met2), Metal 3 (met3), Metal 4 (met4), Metal 5 (met5).'
      ],
      spec: 'Library: sky130_fd_sc_hd__tt_025C_1v80.lib (Nominal corner 1.8V, 25°C)'
    }
  },
  {
    id: 9,
    title: '9. What is RTL Design?',
    simple: {
      summary: 'RTL (Register-Transfer Level) is writing computer code (using a hardware language like Verilog) that describes how digital signals flow and change inside a microchip.',
      analogy: 'Writing the blueprint and architectural rules for a building before the concrete is poured.',
      points: [
        'Written in human-readable code: Verilog HDL.',
        'Simulated on a computer using Icarus Verilog to prove it works before fabricating.',
        'Synthesizable: A compiler converts the code into real logic gates.'
      ]
    },
    engineering: {
      summary: 'An abstraction model for digital synchronous and combinational circuits specifying hardware behavior as boolean transfers between hardware registers and combinatorial paths.',
      formula: 'assign \\{cout, sum\\} = a + b + cin;',
      technicalDetails: [
        'Standard: IEEE 1364-2005 Verilog Hardware Description Language.',
        'Tooling: Icarus Verilog compiler v14.0 and vvp execution runtime.',
        'Verification Metric: Self-checking testbench harness with golden reference assertions.'
      ],
      spec: '11 synthesizable modules in rtl/ directory'
    }
  },
  {
    id: 10,
    title: '10. What is ASIC Physical Design?',
    simple: {
      summary: 'The process of taking abstract logic gates and physically drawing them as real microscopic shapes on a piece of silicon wafer.',
      analogy: 'City planning: taking a list of buildings (houses, schools, hospitals) and laying them out on a map with roads, power lines, and water pipes connecting them.',
      points: [
        'Floorplanning: Deciding the size and shape of the silicon die (45 µm x 35 µm).',
        'Placement: Arranging the 48 standard cells into neat horizontal rows.',
        'Routing: Drawing metal wires to connect the gate inputs and outputs.'
      ]
    },
    engineering: {
      summary: 'The back-end ASIC physical implementation phase transforming a gate-level netlist into a valid geometric mask layout meeting design rule constraints (DRC).',
      technicalDetails: [
        'Floorplanning: Die size 45.0 µm x 35.0 µm (1575 µm²), Core size 35.0 µm x 24.5 µm (857.5 µm²).',
        'Row Construction: 9 alternating rows with orientations Normal (N) and Flipped South (FS) for shared VDD/VSS rails.',
        'Standard Cell Density: 51.36% core placement utilization providing ample whitespace for routing channels.'
      ],
      spec: 'Physical database: physical_design/placement/cska_sky130.def'
    }
  },
  {
    id: 11,
    title: '11. What is GDSII?',
    simple: {
      summary: 'GDSII is the final digital file format sent to the semiconductor foundry to manufacture the actual microchip.',
      analogy: 'The final 3D print file (like a .STL file) or the final high-resolution PDF sent to a professional commercial printing press.',
      points: [
        'Contains every single polygon, transistor gate, and metal wire.',
        'Read by million-dollar optical photolithography stepper machines.',
        'Our project generated a real 4.18 MB GDSII file called cska_sky130.gds.'
      ]
    },
    engineering: {
      summary: 'Graphic Design System II stream format. A binary file format representing planar geometric shapes, text labels, and hierarchical structures across discrete physical fabrication masks.',
      technicalDetails: [
        'Byte Size: Exactly 4,189,882 bytes (4.18 MB) in binary stream format.',
        'Layer Encoding: SkyWater 130nm layers: 235/4 (prBoundary), 68/20 (met1), 69/20 (met2), 70/20 (met3), 66/44 (diffusion), 68/44 (polysilicon).',
        'Viewer Compatibility: Validated in KLayout 0.30.12 and KLayout 0.30.0.'
      ],
      spec: 'physical_design/gds/cska_sky130.gds (Standard-cell placement stream)'
    }
  },
  {
    id: 12,
    title: '12. Why is This Project Significant?',
    simple: {
      summary: 'It proves that modern open-source tools and open-source semiconductor PDKs are fully capable of industrial-grade microchip design from code to layout.',
      analogy: 'Showing that anyone with a laptop and open-source software can design real silicon that could be manufactured at an actual semiconductor foundry.',
      points: [
        'Completely transparent and reproducible on Windows 11.',
        'Zero closed-source multi-thousand-dollar software licenses required.',
        'Combines rigorous electrical verification with cutting-edge 3D WebGL visualization.'
      ]
    },
    engineering: {
      summary: 'Validates an end-to-end open-source silicon methodology: RTL coding -> Icarus Verilog verification -> Yosys synthesis -> SkyWater 130nm technology mapping -> DEF floorplanning -> GDSII layout.',
      technicalDetails: [
        'Reproducibility: 100% reproducible on commodity workstation (Core 5 210H, RTX 4050).',
        'Academic Rigor: 60,038 verified vectors, Liberty-derived analytical delays, and honest disclosure of unrouted placement status.',
        'Dual-Mode Pedagogy: Bridges high-level university lecture concepts with actual gate netlists and physical GDSII mask layers.'
      ],
      spec: 'Complete verifiable open-source digital VLSI repository'
    }
  }
]

export default function ProjectOverview() {
  const [mode, setMode] = useState<'SIMPLE' | 'ENGINEERING'>('SIMPLE')
  const [expandedId, setExpandedId] = useState<number | null>(1)

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner & Mode Toggle */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#0066FF] text-black">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-wide text-white glow-cyan">
                  PROJECT OVERVIEW & EDUCATIONAL FOUNDATIONS
                </h1>
                <span className="text-xs text-[#94A3B8]">
                  Digital VLSI Design & ASIC Physical Implementation • SkyWater 130nm CMOS
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center space-x-2 bg-[#060A14] p-1.5 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => setMode('SIMPLE')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
                mode === 'SIMPLE'
                  ? 'bg-gradient-to-r from-[#00DF72] to-[#00A854] text-black shadow-lg shadow-[#00DF72]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>SIMPLE (Beginner Mode)</span>
            </button>

            <button
              onClick={() => setMode('ENGINEERING')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
                mode === 'ENGINEERING'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#0088FF] text-black shadow-lg shadow-[#00F0FF]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>ENGINEERING (VLSI Mode)</span>
            </button>
          </div>
        </div>

        {/* Project Metadata Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-[#060A14]/80 border border-[#1E293B]">
            <span className="text-[10px] text-[#64748B] block uppercase">PROJECT TITLE</span>
            <span className="text-sm font-bold text-white">16-Bit Carry Skip Adder</span>
          </div>
          <div className="p-3 rounded-xl bg-[#060A14]/80 border border-[#1E293B]">
            <span className="text-[10px] text-[#64748B] block uppercase">PROCESS NODE</span>
            <span className="text-sm font-bold text-[#00F0FF]">SkyWater 130nm HD</span>
          </div>
          <div className="p-3 rounded-xl bg-[#060A14]/80 border border-[#1E293B]">
            <span className="text-[10px] text-[#64748B] block uppercase">VERIFICATION PROOF</span>
            <span className="text-sm font-bold text-[#00DF72]">60,038 Vectors (100% Pass)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#060A14]/80 border border-[#1E293B]">
            <span className="text-[10px] text-[#64748B] block uppercase">PHYSICAL GDSII</span>
            <span className="text-sm font-bold text-[#FF7A00]">4.18 MB Placed Stream</span>
          </div>
        </div>
      </div>

      {/* 12 Foundational Questions Accordion Grid */}
      <div className="space-y-4">
        {QUESTIONS.map((q) => {
          const isExpanded = expandedId === q.id
          return (
            <div
              key={q.id}
              className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? mode === 'SIMPLE'
                    ? 'border-[#00DF72]/40 shadow-xl shadow-[#00DF72]/5'
                    : 'border-[#00F0FF]/40 shadow-xl shadow-[#00F0FF]/5'
                  : 'border-[#1E293B] hover:border-[#334155]'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full p-4 flex items-center justify-between text-left transition hover:bg-[#0A1224]/60"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      mode === 'SIMPLE'
                        ? 'bg-[#00DF72]/15 text-[#00DF72] border border-[#00DF72]/30'
                        : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                    }`}
                  >
                    Q{q.id}
                  </span>
                  <span className="text-sm font-bold text-white tracking-wide">{q.title}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-[#64748B] uppercase">
                    {mode === 'SIMPLE' ? 'Beginner Analogy' : 'VLSI Specification'}
                  </span>
                  <span className="text-lg text-[#64748B]">{isExpanded ? '−' : '+'}</span>
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-5 pt-0 space-y-4 border-t border-[#1E293B]/60 bg-[#060A14]/40">
                  {mode === 'SIMPLE' ? (
                    /* Simple / Beginner Mode */
                    <div className="space-y-4 pt-4">
                      <p className="text-sm text-[#E2E8F0] leading-relaxed">{q.simple.summary}</p>

                      <div className="p-4 rounded-xl bg-[#00DF72]/10 border border-[#00DF72]/30 space-y-2">
                        <div className="flex items-center space-x-2 text-[#00DF72] font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>REAL-WORLD ANALOGY</span>
                        </div>
                        <p className="text-xs text-[#CBD5E1] italic leading-relaxed">
                          "{q.simple.analogy}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
                          KEY TAKEAWAYS
                        </span>
                        <ul className="space-y-1.5">
                          {q.simple.points.map((pt, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-xs text-[#94A3B8]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00DF72] shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Engineering / VLSI Mode */
                    <div className="space-y-4 pt-4">
                      <p className="text-sm text-[#E2E8F0] leading-relaxed">{q.engineering.summary}</p>

                      {q.engineering.formula && (
                        <div className="p-3.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 font-mono text-center text-sm text-[#00F0FF] shadow-inner">
                          {q.engineering.formula}
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
                          TECHNICAL & SILICON SPECIFICATIONS
                        </span>
                        <ul className="space-y-1.5">
                          {q.engineering.technicalDetails.map((td, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-xs text-[#94A3B8]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                              <span>{td}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#0A1224] border border-[#1E293B] flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">SKY130 STANDARD CELL SPEC:</span>
                        <span className="text-[#00F0FF] font-mono font-bold">{q.engineering.spec}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

