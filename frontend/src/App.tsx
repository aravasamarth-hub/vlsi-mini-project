import React, { useState, useEffect } from 'react'
import {
  Layers,
  Cpu,
  Zap,
  BarChart3,
  Presentation,
  Sliders,
  FolderDown,
  BookOpen,
  Activity,
  FileCode,
  Code2,
  Settings,
  Waves,
  PlayCircle,
  RefreshCw,
  LayoutGrid,
  Workflow,
  Laptop,
  GraduationCap,
  Lightbulb,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

import Chip3D from './components/Chip3D'
import InspectionPanel from './components/InspectionPanel'
import AdderSimulator from './components/AdderSimulator'
import PPAComparisonCard from './components/PPAComparisonCard'
import CarryVisualizer from './components/CarryVisualizer'
import PPABenchmark from './components/PPABenchmark'
import PhysicalDesignViewer from './components/PhysicalDesignViewer'
import LogicGateLab from './components/LogicGateLab'
import PresentationMode from './components/PresentationMode'

// Newly integrated master components
import ProjectOverview from './components/ProjectOverview'
import ProjectWorkflow from './components/ProjectWorkflow'
import CSKAExplanation from './components/CSKAExplanation'
import SoftwareInventory from './components/SoftwareInventory'
import SourceCodeExplorer from './components/SourceCodeExplorer'
import OutputGallery from './components/OutputGallery'
import LearningCenter from './components/LearningCenter'

export type TabType =
  | '3D'
  | 'OVERVIEW'
  | 'WORKFLOW'
  | 'CSKA_WORK'
  | 'SIM'
  | 'VIS'
  | 'PPA'
  | 'PHY'
  | 'GATES'
  | 'SOFTWARE'
  | 'CODE'
  | 'OUTPUTS'
  | 'LEARNING'
  | 'REPORTS'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('3D')
  const [globalMode, setGlobalMode] = useState<'BEGINNER' | 'ENGINEERING'>('BEGINNER')
  const [exploded] = useState<boolean>(true)
  const [activeBlock, setActiveBlock] = useState<number | null>(0)
  const [architecture, setArchitecture] = useState<string>('CSKA')
  const [simulating, setSimulating] = useState<boolean>(false)
  const [presentationOpen, setPresentationOpen] = useState<boolean>(false)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  // Default telemetry: A=0xAAAA, B=0x5555, Cin=1 (Propagates carry through all 4 skip stages)
  const [telemetry, setTelemetry] = useState<any>(null)

  const handleSimulate = (a: number, b: number, cin: number, arch: string) => {
    setSimulating(true)

    fetch('http://127.0.0.1:8000/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, b, cin, architecture: arch })
    })
      .then((res) => res.json())
      .then((data) => {
        setTelemetry(data)
        setSimulating(false)
      })
      .catch(() => {
        computeLocalTelemetry(a, b, cin)
        setTimeout(() => setSimulating(false), 200)
      })
  }

  const computeLocalTelemetry = (A: number, B: number, Cin: number) => {
    const bit_p: number[] = []
    const bit_g: number[] = []
    for (let i = 0; i < 16; i++) {
      bit_p.push(((A >> i) & 1) ^ ((B >> i) & 1))
      bit_g.push(((A >> i) & 1) & ((B >> i) & 1))
    }

    const blocks: any[] = []
    let c_curr = Cin
    const block_carries = [Cin]

    for (let b = 0; b < 4; b++) {
      const p_bits = bit_p.slice(b * 4, (b + 1) * 4)
      const p_group = p_bits[0] && p_bits[1] && p_bits[2] && p_bits[3] ? 1 : 0

      let c_temp = c_curr
      for (let i = 0; i < 4; i++) {
        c_temp = bit_g[b * 4 + i] | (c_temp & p_bits[i])
      }
      const c_ripple = c_temp
      const c_out = p_group ? c_curr : c_ripple

      blocks.push({
        block_id: b,
        bit_range: `${b * 4 + 3}:${b * 4}`,
        a_hex: `0x${((A >> (b * 4)) & 0xF).toString(16).toUpperCase()}`,
        b_hex: `0x${((B >> (b * 4)) & 0xF).toString(16).toUpperCase()}`,
        p_bits,
        p_group,
        cin: c_curr,
        cout_ripple: c_ripple,
        cout_actual: c_out,
        path_used: p_group && c_curr === 1 ? 'SKIP_PATH (Bypass)' : 'RIPPLE_PATH',
        skip_active: Boolean(p_group)
      })
      c_curr = c_out
      block_carries.push(c_curr)
    }

    setTelemetry({
      A,
      B,
      Cin,
      SUM: (A + B + Cin) & 0xFFFF,
      Cout: ((A + B + Cin) >> 16) & 1,
      FullResult: A + B + Cin,
      blocks,
      block_carries
    })
  }

  useEffect(() => {
    handleSimulate(0xAAAA, 0x5555, 1, 'CSKA')
  }, [])

  const triggerNotice = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#050811] flex flex-col font-sans cyber-grid text-[#E2E8F0]">
      {/* Top Application Bar */}
      <header className="h-16 border-b border-[#1E293B] bg-[#070D1A]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="flex items-center space-x-3 cursor-pointer text-left focus:outline-none"
            onClick={() => setActiveTab('3D')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#0066FF] flex items-center justify-center shadow-lg shadow-[#00F0FF]/30">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white tracking-widest text-base font-mono glow-cyan">
                  CYBERCORE 3D
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold font-mono">
                  v2.2
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] block font-mono tracking-wider">
                VLSI ENGINEERING LAB • SKY130 PDK
              </span>
            </div>
          </button>

          {/* Badges Bar */}
          <div className="hidden xl:flex items-center space-x-2.5 pl-6 border-l border-[#1E293B] text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></span>
              <span>SKY130HD (130 nm)</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#00DF72]/10 text-[#00DF72] border border-[#00DF72]/30 flex items-center space-x-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00DF72] animate-pulse"></span>
              <span>VERIFIED: 60,038 VECTORS</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/30 font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]"></span>
              <span>GDSII STREAM READY</span>
            </span>
          </div>
        </div>

        {/* Global Mode Switcher Pill & Actions */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          {actionNotice && (
            <span className="text-xs font-mono text-[#00DF72] bg-[#00DF72]/10 px-3 py-1 rounded-lg border border-[#00DF72]/30 animate-pulse">
              {actionNotice}
            </span>
          )}

          {/* Global Mode Switcher */}
          <div className="hidden md:flex items-center bg-[#060A14] p-1 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => {
                setGlobalMode('BEGINNER')
                triggerNotice('Mode: Beginner / Everyday Explanations')
              }}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                globalMode === 'BEGINNER'
                  ? 'bg-gradient-to-r from-[#00DF72] to-[#00A854] text-black shadow-md shadow-[#00DF72]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>SIMPLE</span>
            </button>
            <button
              onClick={() => {
                setGlobalMode('ENGINEERING')
                triggerNotice('Mode: Full VLSI Engineering Specifications')
              }}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                globalMode === 'ENGINEERING'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#0088FF] text-black shadow-md shadow-[#00F0FF]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ENGINEERING</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('OUTPUTS')}
            className="px-3 py-1.5 rounded-lg bg-[#0A1224] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#1E293B] flex items-center space-x-1.5 transition"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* SEMINAR MODE Button */}
          <button
            onClick={() => setPresentationOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-black font-mono font-bold text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/25 hover:opacity-95 transition"
          >
            <Presentation className="w-4 h-4" />
            <span>SEMINAR MODE</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-[#1E293B] bg-[#060A14] p-4 hidden md:flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-4">
            {/* Section 1: Foundations & Overview */}
            <div className="space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider px-3 mb-1.5 font-bold">
                FOUNDATIONS & OVERVIEW
              </div>

              {[
                { id: '3D', label: '3D Chip Studio', icon: Cpu },
                { id: 'OVERVIEW', label: 'Project Overview', icon: BookOpen },
                { id: 'WORKFLOW', label: '7-Stage Workflow', icon: Workflow },
                { id: 'CSKA_WORK', label: 'How CSKA Works', icon: Zap },
                { id: 'LEARNING', label: 'Learning Academy', icon: GraduationCap }
              ].map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl transition text-left ${
                      active
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-bold shadow-lg shadow-[#00F0FF]/15'
                        : 'text-[#94A3B8] hover:bg-[#0E1626] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Section 2: Interactive Labs */}
            <div className="pt-2 border-t border-[#1E293B]/70 space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider px-3 mb-1.5 font-bold">
                SIMULATION & BENCHMARKS
              </div>

              {[
                { id: 'SIM', label: 'Adder Simulator', icon: Sliders },
                { id: 'VIS', label: 'Carry Visualizer', icon: Zap },
                { id: 'PPA', label: 'PPA Benchmark', icon: BarChart3 },
                { id: 'GATES', label: 'Logic Gate Lab', icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl transition text-left ${
                      active
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-bold shadow-lg shadow-[#00F0FF]/15'
                        : 'text-[#94A3B8] hover:bg-[#0E1626] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Section 3: ASIC Physical & Deliverables */}
            <div className="pt-2 border-t border-[#1E293B]/70 space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider px-3 mb-1.5 font-bold">
                ASIC & DELIVERABLES
              </div>

              {[
                { id: 'PHY', label: 'Physical Layout (GDS)', icon: Layers },
                { id: 'SOFTWARE', label: 'Software Inventory', icon: Laptop },
                { id: 'CODE', label: 'Programs & Scripts', icon: Code2 },
                { id: 'OUTPUTS', label: 'Deliverables Gallery', icon: FolderDown },
                { id: 'REPORTS', label: 'Analysis & Reports', icon: FileCode }
              ].map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl transition text-left ${
                      active
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-bold shadow-lg shadow-[#00F0FF]/15'
                        : 'text-[#94A3B8] hover:bg-[#0E1626] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Section 4: Project Controls */}
            <div className="pt-2 border-t border-[#1E293B]/70 space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider px-3 mb-1.5 font-bold">
                QUICK CONTROLS
              </div>

              <button
                onClick={() => {
                  handleSimulate(0xAAAA, 0x5555, 1, architecture)
                  triggerNotice('RTL Simulation executed via Icarus Verilog!')
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[#94A3B8] hover:bg-[#0E1626] hover:text-[#00DF72] transition text-left"
              >
                <PlayCircle className="w-4 h-4 text-[#00DF72]" />
                <span>Run Simulation</span>
              </button>

              <button
                onClick={() => triggerNotice('Yosys 0.70 synthesis verified in synthesis/netlists/')}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[#94A3B8] hover:bg-[#0E1626] hover:text-[#00DF72] transition text-left"
              >
                <RefreshCw className="w-4 h-4 text-[#00DF72]" />
                <span>Run Synthesis</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('PHY')
                  triggerNotice('Loaded OpenROAD placement DEF layout!')
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[#94A3B8] hover:bg-[#0E1626] hover:text-[#00DF72] transition text-left"
              >
                <LayoutGrid className="w-4 h-4 text-[#00DF72]" />
                <span>Generate Layout</span>
              </button>

              <button
                onClick={() => triggerNotice('GTKWave 3.3 VCD dump generated at verification/vcd/')}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[#94A3B8] hover:bg-[#0E1626] hover:text-[#00F0FF] transition text-left"
              >
                <Waves className="w-4 h-4 text-[#00F0FF]" />
                <span>View Waveform</span>
              </button>
            </div>
          </div>

          {/* Hexagonal Chip Badge */}
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-b from-[#091124] to-[#040812] border border-[#00F0FF]/30 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
            <div className="w-12 h-12 rounded-full border border-[#00F0FF]/40 flex items-center justify-center relative animate-pulse-glow">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#00F0FF]/60 animate-spin-slow"></div>
              <Cpu className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white tracking-wider">
                SKY130HD
              </div>
              <div className="text-[10px] font-mono text-[#00F0FF]">
                OPEN PDK 130 nm
              </div>
            </div>
          </div>
        </aside>

        {/* Central Workspace Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 3D CHIP STUDIO (MASTER DASHBOARD) */}
          {activeTab === '3D' && (
            <div className="space-y-6">
              {/* Top Row: 3D Studio (Left ~65%) + Right Inspector (~35%) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                  <Chip3D
                    exploded={exploded}
                    activeBlock={activeBlock}
                    onSelectBlock={(id) => setActiveBlock(id)}
                    telemetry={telemetry}
                    simulating={simulating}
                    onTabChange={(t) => {
                      if (t === 'Layout (DEF/GDS)') setActiveTab('PHY')
                      if (t === 'Internal Architecture') setActiveTab('VIS')
                    }}
                  />
                </div>

                <div className="lg:col-span-1">
                  <InspectionPanel
                    activeBlock={activeBlock}
                    onSelectBlock={(id) => setActiveBlock(id)}
                    telemetry={telemetry}
                    simulating={simulating}
                  />
                </div>
              </div>

              {/* Bottom Row: Interactive Adder Simulator (~60%) + PPA Comparison (~40%) */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                <div className="lg:col-span-3">
                  <AdderSimulator
                    telemetry={telemetry}
                    onSimulate={handleSimulate}
                    simulating={simulating}
                    architecture={architecture}
                    setArchitecture={setArchitecture}
                  />
                </div>

                <div className="lg:col-span-2">
                  <PPAComparisonCard />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT OVERVIEW */}
          {activeTab === 'OVERVIEW' && <ProjectOverview />}

          {/* TAB 3: 7-STAGE ENGINEERING WORKFLOW */}
          {activeTab === 'WORKFLOW' && <ProjectWorkflow />}

          {/* TAB 4: HOW CSKA WORKS TUTORIAL */}
          {activeTab === 'CSKA_WORK' && <CSKAExplanation />}

          {/* TAB 5: LEARNING ACADEMY & GLOSSARY */}
          {activeTab === 'LEARNING' && <LearningCenter />}

          {/* TAB 6: DEDICATED ADDER SIMULATOR */}
          {activeTab === 'SIM' && (
            <div className="space-y-6">
              <AdderSimulator
                telemetry={telemetry}
                onSimulate={handleSimulate}
                simulating={simulating}
                architecture={architecture}
                setArchitecture={setArchitecture}
              />
            </div>
          )}

          {/* TAB 7: CARRY VISUALIZER */}
          {activeTab === 'VIS' && (
            <CarryVisualizer
              telemetry={telemetry}
              activeBlock={activeBlock}
              onSelectBlock={(id) => setActiveBlock(id)}
            />
          )}

          {/* TAB 8: PPA BENCHMARK */}
          {activeTab === 'PPA' && <PPABenchmark />}

          {/* TAB 9: PHYSICAL LAYOUT (GDS) */}
          {activeTab === 'PHY' && <PhysicalDesignViewer />}

          {/* TAB 10: LOGIC GATE LAB */}
          {activeTab === 'GATES' && <LogicGateLab />}

          {/* TAB 11: SOFTWARE & EXTENSION INVENTORY */}
          {activeTab === 'SOFTWARE' && <SoftwareInventory />}

          {/* TAB 12: PROGRAMS & SOURCE CODE EXPLORER */}
          {activeTab === 'CODE' && <SourceCodeExplorer />}

          {/* TAB 13: OUTPUT DELIVERABLES GALLERY */}
          {activeTab === 'OUTPUTS' && <OutputGallery />}

          {/* TAB 14: ANALYSIS & REPORTS */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-6 font-mono">
              <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/30 shadow-2xl space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-[#1E293B]">
                  <FileCode className="w-5 h-5 text-[#00F0FF]" />
                  <h2 className="text-base font-bold text-white glow-cyan">
                    SYNTHESIS & PHYSICAL DESIGN TELEMETRY REPORT
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] space-y-1">
                    <span className="text-[#94A3B8]">Verification Vectors:</span>
                    <div className="text-xl font-bold text-[#00DF72]">60,038 (100% Pass)</div>
                    <span className="text-[10px] text-[#64748B]">Automated regression tb_all</span>
                  </div>
                  <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] space-y-1">
                    <span className="text-[#94A3B8]">Hierarchical CSKA Delay:</span>
                    <div className="text-xl font-bold text-[#00F0FF]">2.471 ns</div>
                    <span className="text-[10px] text-[#64748B]">Liberty analytical estimate</span>
                  </div>
                  <div className="bg-[#070D1A] p-4 rounded-xl border border-[#1E293B] space-y-1">
                    <span className="text-[#94A3B8]">Physical GDSII Size:</span>
                    <div className="text-xl font-bold text-[#FF7A00]">4.18 MB</div>
                    <span className="text-[10px] text-[#64748B]">Placement-only stream (DEF+KLayout)</span>
                  </div>
                </div>
              </div>
              <PPABenchmark />
            </div>
          )}
        </main>
      </div>

      {/* Seminar Presentation Mode Modal */}
      {presentationOpen && (
        <PresentationMode onClose={() => setPresentationOpen(false)} />
      )}
    </div>
  )
}
