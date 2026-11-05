import React, { useState } from 'react'
import {
  FolderDown,
  FileCode,
  Layers,
  BarChart2,
  Image as ImageIcon,
  Archive,
  Copy,
  Check,
  Search,
  CheckCircle2,
  BookOpen
} from 'lucide-react'

interface Deliverable {
  id: string
  category: 'RTL' | 'VERIFICATION' | 'SYNTHESIS' | 'PHYSICAL' | 'ANALYSIS' | 'DOCS' | 'ARCHIVE'
  name: string
  path: string
  format: string
  size: string
  description: string
  verificationEvidence: string
}

const DELIVERABLES: Deliverable[] = [
  // GDSII & Physical
  {
    id: 'gds-final',
    category: 'PHYSICAL',
    name: 'cska_sky130.gds',
    path: 'physical_design/gds/cska_sky130.gds',
    format: 'GDSII Binary Stream',
    size: '4,189,882 bytes (4.18 MB)',
    description: 'Binary multi-layer integrated circuit layout with standard-cell placements targeting SkyWater 130nm HD library.',
    verificationEvidence: 'Loaded & verified in KLayout 0.30.12 with 433 cell geometries'
  },
  {
    id: 'def-final',
    category: 'PHYSICAL',
    name: 'cska_sky130.def',
    path: 'physical_design/placement/cska_sky130.def',
    format: 'DEF 5.8 Floorplan',
    size: '3,643 bytes',
    description: 'Design Exchange Format file establishing 45x35 µm die, 9 rows, and 48 cell placement coordinates.',
    verificationEvidence: '0 cell overlaps, 51.36% core density, 0.46 µm site snapping'
  },
  {
    id: 'png-layout',
    category: 'PHYSICAL',
    name: 'cska_placement_layout.png',
    path: 'physical_design/reports/cska_placement_layout.png',
    format: 'High-Res PNG',
    size: '191.7 KB',
    description: '2D publication-quality plot of standard cell placements and row orientations.',
    verificationEvidence: 'Generated via matplotlib from cska_sky130.def'
  },

  // Synthesis Netlists
  {
    id: 'net-flat',
    category: 'SYNTHESIS',
    name: 'cska_sky130_netlist.v',
    path: 'synthesis/netlists/cska_sky130_netlist.v',
    format: 'Gate-Level Verilog',
    size: '10,997 bytes',
    description: 'Flattened synthesized gate netlist mapped to SkyWater 130nm HD standard cells (48 cells, 440.42 µm²).',
    verificationEvidence: 'Synthesized via Yosys 0.70 + Berkeley ABC mapper'
  },
  {
    id: 'net-hier',
    category: 'SYNTHESIS',
    name: 'cska_hier_sky130_netlist.v',
    path: 'synthesis/netlists/cska_hier_sky130_netlist.v',
    format: 'Gate-Level Verilog',
    size: '3,670 bytes',
    description: 'Hierarchical synthesized gate netlist preserving 4-bit blocks, multiplexers, and AND4 gates (56 cells, 760.73 µm²).',
    verificationEvidence: 'Preserved hierarchy via synth -noflatten command'
  },
  {
    id: 'synth-sum-csv',
    category: 'SYNTHESIS',
    name: 'synthesis_summary.csv',
    path: 'synthesis/reports/synthesis_summary.csv',
    format: 'CSV Data Table',
    size: '329 bytes',
    description: 'Tabular synthesis metrics: cell count, cell area, standard gate types across all 7 synthesis runs.',
    verificationEvidence: 'Direct programmatic output from Yosys stat logs'
  },

  // Verification Deliverables
  {
    id: 'ver-summary',
    category: 'VERIFICATION',
    name: 'summary.json',
    path: 'verification/verification_results/summary.json',
    format: 'JSON Database',
    size: '1,381 bytes',
    description: 'Verification audit manifest certifying 60,038 test vectors executed with 0 mismatches.',
    verificationEvidence: '100% pass rate logged by Icarus Verilog testbenches'
  },
  {
    id: 'ver-vcd',
    category: 'VERIFICATION',
    name: 'cska.vcd',
    path: 'verification/vcd/cska.vcd',
    format: 'Value Change Dump (VCD)',
    size: '1.2 MB',
    description: 'Full signal transition waveform dump for GTKWave digital inspection.',
    verificationEvidence: 'Generated via $dumpfile and $dumpvars during testbench execution'
  },

  // Analysis Deliverables
  {
    id: 'ana-comp-csv',
    category: 'ANALYSIS',
    name: 'comparison_results.csv',
    path: 'analysis/comparison_results.csv',
    format: 'CSV Data Table',
    size: '615 bytes',
    description: 'PPA benchmark results comparing RCA, CSKA (Flat & Hier), CLA, CSLA, and Brent-Kung.',
    verificationEvidence: 'Evaluated using Liberty delay arcs and dynamic power calculations'
  },
  {
    id: 'ana-graph-delay',
    category: 'ANALYSIS',
    name: 'architecture_vs_delay.png',
    path: 'analysis/graphs/architecture_vs_delay.png',
    format: 'PNG Chart',
    size: '63.2 KB',
    description: 'Publication graph illustrating speedup: CSKA (2.471 ns) vs RCA (3.957 ns).',
    verificationEvidence: 'Rendered at 300 DPI via Matplotlib'
  },
  {
    id: 'ana-graph-adp',
    category: 'ANALYSIS',
    name: 'area_delay_product.png',
    path: 'analysis/graphs/area_delay_product.png',
    format: 'PNG Chart',
    size: '61.7 KB',
    description: 'Area-Delay Product (ADP) trade-off comparison curve across all 5 adders.',
    verificationEvidence: 'Rendered at 300 DPI via Matplotlib'
  },

  // Academic Markdown Reports
  {
    id: 'doc-final',
    category: 'DOCS',
    name: 'FINAL_DOCUMENTATION_REPORT.md',
    path: 'FINAL_DOCUMENTATION_REPORT.md',
    format: 'Markdown Document',
    size: '4.5 KB',
    description: 'Master academic submission and defense report summarizing all 7 stages.',
    verificationEvidence: 'Strict markdownlint compliance'
  },
  {
    id: 'doc-software',
    category: 'DOCS',
    name: 'SOFTWARE_AND_EXTENSION_INVENTORY.md',
    path: 'SOFTWARE_AND_EXTENSION_INVENTORY.md',
    format: 'Markdown Document',
    size: '8.2 KB',
    description: 'Complete audit of laptop hardware, EDA tool versions, and IDE extensions.',
    verificationEvidence: 'Empirically audited from machine environment'
  },
  {
    id: 'doc-gds',
    category: 'DOCS',
    name: 'GDSII_LAYOUT_EXPLANATION.md',
    path: 'GDSII_LAYOUT_EXPLANATION.md',
    format: 'Markdown Document',
    size: '6.8 KB',
    description: 'In-depth explanation of SkyWater 130nm mask layers and placement layout.',
    verificationEvidence: 'Based on actual DEF coordinates and KLayout screenshots'
  },
  {
    id: 'doc-results',
    category: 'DOCS',
    name: 'ACADEMIC_RESULTS_AND_LIMITATIONS.md',
    path: 'ACADEMIC_RESULTS_AND_LIMITATIONS.md',
    format: 'Markdown Document',
    size: '7.5 KB',
    description: 'Honest disclosure of 48 vs 56 cell counts, Liberty timing methodology, and placement boundaries.',
    verificationEvidence: 'Fully aligned with academic integrity standards'
  },

  // Final Archive Bundle
  {
    id: 'arc-zip',
    category: 'ARCHIVE',
    name: '16bit_carry_skip_adder_sky130_submission.zip',
    path: 'submission/16bit_carry_skip_adder_sky130_submission.zip',
    format: 'ZIP Archive',
    size: '18.4 MB',
    description: 'Complete reproducible submission bundle including RTL, testbenches, synthesis netlists, GDSII, and reports.',
    verificationEvidence: 'Generated via package_submission.py excluding build caches'
  }
]

export default function OutputGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = [
    { id: 'ALL', label: 'All Artifacts', count: DELIVERABLES.length },
    { id: 'PHYSICAL', label: 'GDSII & Layout', count: DELIVERABLES.filter((d) => d.category === 'PHYSICAL').length },
    { id: 'SYNTHESIS', label: 'Netlists & Synthesis', count: DELIVERABLES.filter((d) => d.category === 'SYNTHESIS').length },
    { id: 'VERIFICATION', label: 'Verification & VCD', count: DELIVERABLES.filter((d) => d.category === 'VERIFICATION').length },
    { id: 'ANALYSIS', label: 'PPA & Charts', count: DELIVERABLES.filter((d) => d.category === 'ANALYSIS').length },
    { id: 'DOCS', label: 'Academic Reports', count: DELIVERABLES.filter((d) => d.category === 'DOCS').length },
    { id: 'ARCHIVE', label: 'ZIP Submission', count: DELIVERABLES.filter((d) => d.category === 'ARCHIVE').length }
  ]

  const filtered = DELIVERABLES.filter((d) => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyPath = (path: string, id: string) => {
    navigator.clipboard.writeText(path)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#0066FF] text-black">
              <FolderDown className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white glow-cyan">
                PROJECT OUTPUT DELIVERABLES GALLERY
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Complete Catalog of Verified Silicon Artifacts, Binary GDSII Streams, Synthesized Netlists, and Academic Reports
              </p>
            </div>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060A14] border border-[#1E293B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-md shadow-[#00F0FF]/15'
                  : 'bg-[#060A14] text-[#94A3B8] border border-[#1E293B] hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-[#1E293B] text-[10px] text-white">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="glass-panel p-5 rounded-2xl border border-[#1E293B] hover:border-[#00F0FF]/40 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-[#00F0FF]/5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8]">
                  {d.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                  {d.format}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-wide truncate">{d.name}</h3>
                <div className="text-[10px] text-[#00DF72] font-mono mt-0.5">{d.size}</div>
              </div>

              <p className="text-[11px] text-[#CBD5E1] leading-relaxed line-clamp-2">
                {d.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1E293B]/70 space-y-2">
              <div className="text-[10px] text-[#64748B] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00DF72] shrink-0" />
                <span className="truncate">{d.verificationEvidence}</span>
              </div>

              <button
                onClick={() => copyPath(d.path, d.id)}
                className="w-full py-2 px-3 rounded-lg bg-[#060A14] hover:bg-[#0E1626] border border-[#1E293B] hover:border-[#00F0FF]/40 text-[#94A3B8] hover:text-white flex items-center justify-between transition text-[10px] font-mono"
              >
                <span className="truncate pr-2">{d.path}</span>
                <span className="flex items-center space-x-1 text-[#00F0FF] shrink-0">
                  {copiedId === d.id ? <Check className="w-3 h-3 text-[#00DF72]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === d.id ? 'Copied' : 'Copy'}</span>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

