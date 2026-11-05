import React, { useState } from 'react'
import {
  FileCode,
  Terminal,
  Copy,
  Check,
  Code2,
  FolderTree,
  Play,
  Layers,
  Sparkles,
  ExternalLink,
  Search
} from 'lucide-react'

interface ScriptRecord {
  id: string
  category: 'RTL' | 'TESTBENCH' | 'SYNTHESIS' | 'PHYSICAL' | 'ANALYSIS' | 'SCRIPTS'
  path: string
  name: string
  lines: number
  sizeStr: string
  purpose: string
  runCommand: string
  codeSnippet: string
}

const SCRIPTS: ScriptRecord[] = [
  // RTL Files
  {
    id: 'rtl-cska',
    category: 'RTL',
    path: 'rtl/carry_skip_adder.v',
    name: 'carry_skip_adder.v',
    lines: 82,
    sizeStr: '2.9 KB',
    purpose: 'Top-level 16-bit Carry Skip Adder connecting four 4-bit blocks with bypass multiplexers',
    runCommand: 'iverilog -Wall -g2005 -s carry_skip_adder -o sim.vvp rtl/*.v',
    codeSnippet: `module carry_skip_adder (
    input  wire [15:0] a,
    input  wire [15:0] b,
    input  wire        cin,
    output wire [15:0] sum,
    output wire        cout
);
    wire c4, c8, c12;
    carry_skip_block_4bit b0 (.a(a[3:0]),   .b(b[3:0]),   .cin(cin), .sum(sum[3:0]),   .cout(c4));
    carry_skip_block_4bit b1 (.a(a[7:4]),   .b(b[7:4]),   .cin(c4),  .sum(sum[7:4]),   .cout(c8));
    carry_skip_block_4bit b2 (.a(a[11:8]),  .b(b[11:8]),  .cin(c8),  .sum(sum[11:8]),  .cout(c12));
    carry_skip_block_4bit b3 (.a(a[15:12]), .b(b[15:12]), .cin(c12), .sum(sum[15:12]), .cout(cout));
endmodule`
  },
  {
    id: 'rtl-block',
    category: 'RTL',
    path: 'rtl/carry_skip_block_4bit.v',
    name: 'carry_skip_block_4bit.v',
    lines: 55,
    sizeStr: '1.9 KB',
    purpose: '4-bit CSKA building block with 4 full adders, 4-input AND group propagate, and 2:1 bypass MUX',
    runCommand: 'iverilog -Wall -g2005 -s carry_skip_block_4bit -o sim.vvp rtl/carry_skip_block_4bit.v rtl/full_adder.v',
    codeSnippet: `module carry_skip_block_4bit (
    input  wire [3:0] a,
    input  wire [3:0] b,
    input  wire       cin,
    output wire [3:0] sum,
    output wire       cout
);
    wire [3:0] p, g;
    wire c1, c2, c3, c_ripple;
    wire p_group;
    full_adder fa0 (.a(a[0]), .b(b[0]), .cin(cin), .sum(sum[0]), .cout(c1));
    full_adder fa1 (.a(a[1]), .b(b[1]), .cin(c1),  .sum(sum[1]), .cout(c2));
    full_adder fa2 (.a(a[2]), .b(b[2]), .cin(c2),  .sum(sum[2]), .cout(c3));
    full_adder fa3 (.a(a[3]), .b(b[3]), .cin(c3),  .sum(sum[3]), .cout(c_ripple));
    assign p_group = p[0] & p[1] & p[2] & p[3];
    assign cout = p_group ? cin : c_ripple;
endmodule`
  },
  {
    id: 'rtl-rca',
    category: 'RTL',
    path: 'rtl/ripple_carry_adder.v',
    name: 'ripple_carry_adder.v',
    lines: 38,
    sizeStr: '982 B',
    purpose: 'Baseline 16-bit Ripple Carry Adder chaining 16 full adders sequentially with O(N) delay',
    runCommand: 'iverilog -Wall -g2005 -s ripple_carry_adder -o sim.vvp rtl/ripple_carry_adder.v rtl/full_adder.v',
    codeSnippet: `module ripple_carry_adder (
    input  wire [15:0] a,
    input  wire [15:0] b,
    input  wire        cin,
    output wire [15:0] sum,
    output wire        cout
);
    wire [16:0] c;
    assign c[0] = cin;
    genvar i;
    generate
        for (i = 0; i < 16; i = i + 1) begin: rca_chain
            full_adder fa (.a(a[i]), .b(b[i]), .cin(c[i]), .sum(sum[i]), .cout(c[i+1]));
        end
    endgenerate
    assign cout = c[16];
endmodule`
  },
  {
    id: 'rtl-fa',
    category: 'RTL',
    path: 'rtl/full_adder.v',
    name: 'full_adder.v',
    lines: 29,
    sizeStr: '659 B',
    purpose: '1-bit full adder primitive computing sum and carry-out via XOR and Majority logic',
    runCommand: 'iverilog -Wall -g2005 -s full_adder -o sim.vvp rtl/full_adder.v',
    codeSnippet: `module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);
    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));
endmodule`
  },
  {
    id: 'rtl-cla',
    category: 'RTL',
    path: 'rtl/carry_lookahead_adder.v',
    name: 'carry_lookahead_adder.v',
    lines: 68,
    sizeStr: '2.2 KB',
    purpose: '16-bit Carry Lookahead Adder using 4-bit CLA blocks with lookahead carry generators',
    runCommand: 'iverilog -Wall -g2005 -s carry_lookahead_adder -o sim.vvp rtl/carry_lookahead_adder.v rtl/cla_block_4bit.v rtl/full_adder.v',
    codeSnippet: `module carry_lookahead_adder (
    input  wire [15:0] a,
    input  wire [15:0] b,
    input  wire        cin,
    output wire [15:0] sum,
    output wire        cout
);
    // Hierarchical 4-bit CLA generator logic
endmodule`
  },
  {
    id: 'rtl-csla',
    category: 'RTL',
    path: 'rtl/carry_select_adder.v',
    name: 'carry_select_adder.v',
    lines: 56,
    sizeStr: '1.8 KB',
    purpose: '16-bit Carry Select Adder using dual speculative adder blocks for Cin=0 and Cin=1',
    runCommand: 'iverilog -Wall -g2005 -s carry_select_adder -o sim.vvp rtl/carry_select_adder.v rtl/csla_block_4bit.v rtl/full_adder.v',
    codeSnippet: `module carry_select_adder (
    input  wire [15:0] a,
    input  wire [15:0] b,
    input  wire        cin,
    output wire [15:0] sum,
    output wire        cout
);
    // Speculative block selection
endmodule`
  },
  {
    id: 'rtl-bk',
    category: 'RTL',
    path: 'rtl/brent_kung_adder.v',
    name: 'brent_kung_adder.v',
    lines: 178,
    sizeStr: '6.4 KB',
    purpose: '16-bit parallel prefix Brent-Kung adder with logarithmic carry tree and black/gray cells',
    runCommand: 'iverilog -Wall -g2005 -s brent_kung_adder -o sim.vvp rtl/brent_kung_adder.v',
    codeSnippet: `module brent_kung_adder (
    input  wire [15:0] a,
    input  wire [15:0] b,
    input  wire        cin,
    output wire [15:0] sum,
    output wire        cout
);
    // Parallel prefix tree stages
endmodule`
  },

  // Testbenches
  {
    id: 'tb-cska',
    category: 'TESTBENCH',
    path: 'verification/testbench_cska.v',
    name: 'testbench_cska.v',
    lines: 142,
    sizeStr: '5.3 KB',
    purpose: '10,038-vector self-checking testbench for CSKA with VCD dumping and golden reference verification',
    runCommand: 'iverilog -o tb_cska.vvp -I rtl verification/testbench_cska.v rtl/*.v && vvp tb_cska.vvp',
    codeSnippet: `module testbench_cska;
    reg [15:0] a, b;
    reg cin;
    wire [15:0] sum;
    wire cout;
    carry_skip_adder uut (.a(a), .b(b), .cin(cin), .sum(sum), .cout(cout));
    // 10,038 verified vectors against golden model
endmodule`
  },
  {
    id: 'tb-all',
    category: 'TESTBENCH',
    path: 'verification/testbench_all.v',
    name: 'testbench_all.v',
    lines: 156,
    sizeStr: '5.5 KB',
    purpose: 'Unified 5-adder testbench comparing RCA, CSKA, CLA, CSLA, and Brent-Kung side-by-side',
    runCommand: 'iverilog -o tb_all.vvp -I rtl verification/testbench_all.v rtl/*.v && vvp tb_all.vvp',
    codeSnippet: `module testbench_all;
    // Compares all 5 adders simultaneously against common_reference_model.v
endmodule`
  },

  // Synthesis Scripts
  {
    id: 'synth-cska',
    category: 'SYNTHESIS',
    path: 'synthesis/yosys_scripts/synth_cska.ys',
    name: 'synth_cska.ys',
    lines: 24,
    sizeStr: '580 B',
    purpose: 'Yosys script for flattened CSKA synthesis targeting sky130_fd_sc_hd (48 cells, 440.42 µm²)',
    runCommand: 'yosys -s synthesis/yosys_scripts/synth_cska.ys',
    codeSnippet: `read_verilog rtl/full_adder.v
read_verilog rtl/carry_skip_block_4bit.v
read_verilog rtl/carry_skip_adder.v
hierarchy -check -top carry_skip_adder
synth -top carry_skip_adder -flatten
dfflibmap -liberty synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib
abc -liberty synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib
stat -liberty synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib
write_verilog synthesis/netlists/cska_sky130_netlist.v`
  },
  {
    id: 'synth-hier',
    category: 'SYNTHESIS',
    path: 'synthesis/yosys_scripts/synth_cska_hier.ys',
    name: 'synth_cska_hier.ys',
    lines: 18,
    sizeStr: '444 B',
    purpose: 'Yosys script preserving 4-bit block hierarchy (56 cells, 760.73 µm², 4 MUXes + 4 AND4)',
    runCommand: 'yosys -s synthesis/yosys_scripts/synth_cska_hier.ys',
    codeSnippet: `read_verilog rtl/full_adder.v
read_verilog rtl/carry_skip_block_4bit.v
read_verilog rtl/carry_skip_adder.v
hierarchy -check -top carry_skip_adder
synth -top carry_skip_adder -noflatten
abc -liberty synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib
write_verilog synthesis/netlists/cska_hier_sky130_netlist.v`
  },

  // Physical Design Scripts
  {
    id: 'phy-gen',
    category: 'PHYSICAL',
    path: 'physical_design/generate_physical_layout.py',
    name: 'generate_physical_layout.py',
    lines: 165,
    sizeStr: '6.0 KB',
    purpose: 'Calculates 45x35 µm die, creates 9 standard-cell rows, snaps to 0.46 µm sites, generates DEF file',
    runCommand: 'python physical_design/generate_physical_layout.py',
    codeSnippet: `# Computes standard cell coordinates & exports cska_sky130.def`
  },
  {
    id: 'phy-gds',
    category: 'PHYSICAL',
    path: 'physical_design/export_gds.py',
    name: 'export_gds.py',
    lines: 64,
    sizeStr: '1.8 KB',
    purpose: 'KLayout Pya automation script converting cska_sky130.def into 4.18 MB binary GDSII layout',
    runCommand: 'klayout_app.exe -z -r physical_design/export_gds.py',
    codeSnippet: `# Reads DEF and streams out binary cska_sky130.gds using KLayout pya library`
  },

  // Analysis Scripts
  {
    id: 'ana-perf',
    category: 'ANALYSIS',
    path: 'analysis/performance_analysis.py',
    name: 'performance_analysis.py',
    lines: 280,
    sizeStr: '12.0 KB',
    purpose: 'Calculates critical-path delay, dynamic power (100 MHz), leakage, and Area-Delay Product (ADP)',
    runCommand: 'python analysis/performance_analysis.py',
    codeSnippet: `# Extracts Liberty timing arcs & models critical delay equations`
  },
  {
    id: 'ana-scale',
    category: 'ANALYSIS',
    path: 'analysis/scalability_study.py',
    name: 'scalability_study.py',
    lines: 110,
    sizeStr: '3.6 KB',
    purpose: 'Projects architectural latency scaling across 16-bit, 32-bit, 64-bit, and 128-bit words',
    runCommand: 'python analysis/scalability_study.py',
    codeSnippet: `# Evaluates O(N), O(sqrt(N)), and O(log2(N)) delay scaling`
  },

  // Scripts
  {
    id: 'scr-pkg',
    category: 'SCRIPTS',
    path: 'scripts/package_submission.py',
    name: 'package_submission.py',
    lines: 145,
    sizeStr: '5.7 KB',
    purpose: 'Builds clean academic submission ZIP package excluding cache files and temporary artifacts',
    runCommand: 'python scripts/package_submission.py',
    codeSnippet: `# Packages clean 16bit_carry_skip_adder_sky130_submission.zip`
  }
]

export default function SourceCodeExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedScript, setSelectedScript] = useState<ScriptRecord>(SCRIPTS[0])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = [
    { id: 'ALL', label: 'All Files', count: SCRIPTS.length },
    { id: 'RTL', label: 'RTL Source', count: SCRIPTS.filter((s) => s.category === 'RTL').length },
    { id: 'TESTBENCH', label: 'Testbenches', count: SCRIPTS.filter((s) => s.category === 'TESTBENCH').length },
    { id: 'SYNTHESIS', label: 'Synthesis Yosys', count: SCRIPTS.filter((s) => s.category === 'SYNTHESIS').length },
    { id: 'PHYSICAL', label: 'Physical DEF/GDS', count: SCRIPTS.filter((s) => s.category === 'PHYSICAL').length },
    { id: 'ANALYSIS', label: 'Analysis & PPA', count: SCRIPTS.filter((s) => s.category === 'ANALYSIS').length },
    { id: 'SCRIPTS', label: 'Packaging', count: SCRIPTS.filter((s) => s.category === 'SCRIPTS').length }
  ]

  const filteredScripts = SCRIPTS.filter((s) => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
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
              <Code2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white glow-cyan">
                PROGRAMS & SOURCE CODE CATALOG
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Interactive Script Explorer • Verilog HDL, Yosys Synthesis, Physical DEF/GDS, and Analysis Automation
              </p>
            </div>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060A14] border border-[#1E293B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
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

      {/* Main Split-Pane Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Script List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredScripts.map((s) => {
            const isSelected = selectedScript.id === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSelectedScript(s)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex flex-col space-y-2 ${
                  isSelected
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-lg shadow-[#00F0FF]/15 text-white'
                    : 'bg-[#060A14]/70 border-[#1E293B] hover:border-[#334155] text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm tracking-wide text-white truncate">{s.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8]">
                    {s.category}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748B] font-mono truncate">{s.path}</div>

                <div className="text-[11px] text-[#CBD5E1] line-clamp-2 leading-relaxed">
                  {s.purpose}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#1E293B]/60 text-[10px] text-[#64748B]">
                  <span>{s.lines} Lines</span>
                  <span>{s.sizeStr}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Detail & Code Viewer */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 rounded bg-[#00F0FF]/20 text-[#00F0FF] font-bold border border-[#00F0FF]/40">
                  {selectedScript.category}
                </span>
                <h2 className="text-lg font-bold text-white tracking-wide glow-cyan">
                  {selectedScript.name}
                </h2>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-1">{selectedScript.path}</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded bg-[#1E293B] text-[11px] text-white">
                {selectedScript.lines} lines
              </span>
              <span className="px-2.5 py-1 rounded bg-[#1E293B] text-[11px] text-[#00DF72]">
                {selectedScript.sizeStr}
              </span>
            </div>
          </div>

          {/* Purpose */}
          <div className="p-4 rounded-xl bg-[#060A14] border border-[#1E293B] space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
              FUNCTIONAL PURPOSE & ARCHITECTURAL ROLE
            </span>
            <p className="text-xs text-[#E2E8F0] leading-relaxed">{selectedScript.purpose}</p>
          </div>

          {/* 1-Click Copy Runnable CLI Command */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>EXACT REPRODUCIBILITY COMMAND</span>
              </span>
              <span className="text-[10px] text-[#64748B]">Click to copy terminal command</span>
            </div>

            <button
              onClick={() => copyToClipboard(selectedScript.runCommand, 'cli')}
              className="w-full text-left p-3 rounded-xl bg-[#050811] border border-[#1E293B] hover:border-[#00F0FF]/50 text-[#00F0FF] font-mono text-xs flex items-center justify-between group transition shadow-inner"
            >
              <span className="truncate pr-4">{selectedScript.runCommand}</span>
              <span className="flex items-center space-x-1 shrink-0 px-2.5 py-1 rounded bg-[#1E293B] text-white group-hover:bg-[#00F0FF] group-hover:text-black transition font-bold text-[10px]">
                {copiedId === 'cli' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00DF72]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Code Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>CODE PREVIEW & ARCHITECTURE SNIPPET</span>
              </span>
              <button
                onClick={() => copyToClipboard(selectedScript.codeSnippet, 'code')}
                className="text-[10px] text-[#94A3B8] hover:text-white flex items-center space-x-1"
              >
                {copiedId === 'code' ? <Check className="w-3 h-3 text-[#00DF72]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'code' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#050811] border border-[#1E293B] text-xs font-mono text-[#CBD5E1] overflow-x-auto max-h-72 leading-relaxed">
              <code>{selectedScript.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

