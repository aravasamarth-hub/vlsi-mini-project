import React, { useState } from 'react'
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Sparkles,
  HelpCircle,
  Search,
  CheckCircle2,
  ChevronRight,
  Brain,
  Layers,
  Cpu
} from 'lucide-react'

interface GlossaryTerm {
  term: string
  pronunciation: string
  category: string
  level1: string // Beginner / Child
  level2: string // Engineering Student
}

const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Transistor',
    pronunciation: 'tran-ZIS-tor',
    category: 'Silicon Physics',
    level1: 'A microscopic electronic light switch. When you flip the switch ON, electricity flows (representing a 1). When OFF, no electricity flows (representing a 0). Your phone has billions of them!',
    level2: 'A 3-terminal semiconductor field-effect device (MOSFET). In SkyWater 130nm CMOS, applying a gate voltage above threshold (V_th ≈ 0.4V) inverts the channel, allowing source-to-drain drift current.'
  },
  {
    term: 'RTL (Register-Transfer Level)',
    pronunciation: 'R-T-L',
    category: 'Design Flow',
    level1: 'The recipe or blueprint for a microchip written in computer code (Verilog), describing how numbers move around before the chip is actually built.',
    level2: 'A behavioral hardware description language abstraction (IEEE 1364-2005) that models synchronous sequential transfers between clock-driven registers and combinational boolean logic paths.'
  },
  {
    term: 'Standard Cell',
    pronunciation: 'STAN-dard sell',
    category: 'Physical Design',
    level1: 'Pre-designed LEGO blocks of logic gates (like AND, OR, XOR). Engineers snap these standard blocks together to build big computer chips quickly.',
    level2: 'A fixed-pitch, pre-characterized physical layout block in a standard cell library (sky130_fd_sc_hd). Features characterized power, timing arcs, pin locations, and a standard cell height of 2.72 µm.'
  },
  {
    term: 'Logic Synthesis',
    pronunciation: 'LOG-ik SIN-thuh-sis',
    category: 'EDA Software',
    level1: 'A translator software (like Yosys) that takes your Verilog code words and converts them into an exact shopping list of real transistors and gates.',
    level2: 'The automated algorithmic transformation of behavioral RTL into a structural gate-level netlist optimized for area, power, and timing constraints using Boolean logic reduction and ABC technology mapping.'
  },
  {
    term: 'Netlist',
    pronunciation: 'NET-list',
    category: 'Synthesis',
    level1: 'A master list of all the electronic parts needed and which wire connects to which pin, like an electronic circuit schematic.',
    level2: 'A structural Verilog file specifying instantiated standard-cell primitives (e.g. maj3_1, xnor2_1) and their explicitly declared port-to-net electrical interconnects.'
  },
  {
    term: 'Floorplanning',
    pronunciation: 'FLOOR-plan-ing',
    category: 'Physical Design',
    level1: 'Drawing the boundary of the chip and deciding where the city walls, power lines, and logic neighborhoods will go on the silicon wafer.',
    level2: 'The initial stage of ASIC physical implementation determining die aspect ratio (45 µm x 35 µm), core boundaries, I/O pad placement, and standard-cell row definitions.'
  },
  {
    term: 'DEF (Design Exchange Format)',
    pronunciation: 'D-E-F',
    category: 'File Format',
    level1: 'A text map file that lists the exact GPS coordinates for where each gate sits on the silicon chip.',
    level2: 'An ASCII open standard format describing physical placement: die area, standard cell row sites, instance coordinates, orientations (N/FS), and routing track assignments.'
  },
  {
    term: 'GDSII',
    pronunciation: 'G-D-S-two',
    category: 'Silicon Fabrication',
    level1: 'The final digital manufacturing file sent to the silicon factory to print the microscopic circuits onto physical silicon discs.',
    level2: 'Graphic Design System II binary stream format containing multi-mask geometric polygon data (diffusion, poly, metals, vias) read by photolithography reticle mask writers.'
  },
  {
    term: 'PDK (Process Design Kit)',
    pronunciation: 'P-D-K',
    category: 'Foundry',
    level1: 'The instruction manual and rulebook provided by the chip factory telling engineers how small wires can be and how fast transistors run.',
    level2: 'A collection of foundry design rule files, DRC/LVS rule decks, SPICE device models, LEF layouts, and Liberty (.lib) timing characterization tables (e.g., SkyWater 130nm).'
  },
  {
    term: 'Carry Ripple Delay',
    pronunciation: 'KA-ree RIP-ul dih-LAY',
    category: 'Arithmetic Logic',
    level1: 'The delay caused when one adder has to wait for its neighbor to finish passing a carry bit down the chain, like dominos falling in a row.',
    level2: 'The O(N) linear propagation latency of a cascaded full-adder chain: T_RCA = (N-1)τ_carry + τ_sum, creating timing violations on high-frequency critical paths.'
  },
  {
    term: 'Carry Skip / Bypass',
    pronunciation: 'KA-ree SKIP',
    category: 'Arithmetic Logic',
    level1: 'A shortcut highway! If a block of 4 bits knows the carry will pass straight through, it skips over them in one jump through an express multiplexer.',
    level2: 'An architectural acceleration technique evaluating group propagate P_grp = ∏ P_i to bypass internal ripple stages via a 2:1 multiplexer, reducing delay to O(√N).'
  },
  {
    term: 'Area-Delay Product (ADP)',
    pronunciation: 'AIR-ee-uh dih-LAY PROD-ukt',
    category: 'VLSI Metrics',
    level1: 'A score of how balanced a chip is. A great design is both fast (low delay) and small (low area). Multiplying area times delay gives this score.',
    level2: 'A fundamental figure-of-merit in VLSI benchmarking: ADP = Area (µm²) × Delay (ns). Minimizing ADP yields the most silicon-efficient microarchitecture.'
  }
]

export default function LearningCenter() {
  const [learningLevel, setLearningLevel] = useState<'LEVEL1' | 'LEVEL2'>('LEVEL1')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm>(GLOSSARY[0])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filtered = GLOSSARY.filter((t) => {
    return (
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.level1.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#0066FF] text-black">
              <GraduationCap className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white glow-cyan">
                VLSI & SEMICONDUCTOR LEARNING ACADEMY
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Interactive Glossary, Concept Translator, and Multi-Tier Educational Knowledge Engine
              </p>
            </div>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center space-x-2 bg-[#060A14] p-1.5 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => setLearningLevel('LEVEL1')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
                learningLevel === 'LEVEL1'
                  ? 'bg-gradient-to-r from-[#00DF72] to-[#00A854] text-black shadow-lg shadow-[#00DF72]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>LEVEL 1: BEGINNER (Everyday Language)</span>
            </button>

            <button
              onClick={() => setLearningLevel('LEVEL2')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
                learningLevel === 'LEVEL2'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#0088FF] text-black shadow-lg shadow-[#00F0FF]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>LEVEL 2: ENGINEERING (VLSI Student)</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search semiconductor concepts (transistor, GDSII, synthesis, carry skip)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060A14] border border-[#1E293B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
          />
        </div>
      </div>

      {/* Split View Glossary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Term List */}
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((t) => {
            const isSelected = selectedTerm.term === t.term
            return (
              <button
                key={t.term}
                onClick={() => setSelectedTerm(t)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? learningLevel === 'LEVEL1'
                      ? 'bg-[#00DF72]/15 border-[#00DF72] text-white shadow-lg shadow-[#00DF72]/10'
                      : 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-lg shadow-[#00F0FF]/10'
                    : 'bg-[#060A14]/70 border-[#1E293B] hover:border-[#334155] text-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="font-bold text-sm tracking-wide text-white">{t.term}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">{t.category}</div>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono italic">
                  [{t.pronunciation}]
                </span>
              </button>
            )
          })}
        </div>

        {/* Term Card */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#1E293B] text-[#00F0FF]">
                {selectedTerm.category}
              </span>
              <span className="text-xs text-[#64748B] font-mono">
                Pronunciation: [{selectedTerm.pronunciation}]
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-wide glow-cyan">
              {selectedTerm.term}
            </h2>
          </div>

          {/* Dynamic Explanation Content based on Level */}
          {learningLevel === 'LEVEL1' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#00DF72]/10 border border-[#00DF72]/30 space-y-2">
                <span className="text-xs font-bold text-[#00DF72] flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>EXPLAIN LIKE I'M A BEGINNER (LEVEL 1)</span>
                </span>
                <p className="text-sm text-[#E2E8F0] leading-relaxed">
                  {selectedTerm.level1}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] space-y-2">
                <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                  WHY DOES THIS MATTER IN THIS PROJECT?
                </span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  In our 16-bit Carry Skip Adder, understanding "{selectedTerm.term}" shows how we can take a complex semiconductor topic and make it understandable and reproducible without needing expensive proprietary tools.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 space-y-2">
                <span className="text-xs font-bold text-[#00F0FF] flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>VLSI ENGINEERING SPECIFICATION (LEVEL 2)</span>
                </span>
                <p className="text-sm text-[#E2E8F0] leading-relaxed font-mono">
                  {selectedTerm.level2}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] space-y-2">
                <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                  SKYWATER 130NM PDK INTEGRATION
                </span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  Directly instantiated and mapped targeting the <code>sky130_fd_sc_hd</code> standard cell library across 9 placement rows in <code>cska_sky130.def</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

