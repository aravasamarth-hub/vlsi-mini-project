# PROGRAMS AND SCRIPTS CATALOG

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Catalog Version:** 2.2 Academic Edition  
**Repository Path:** `D:\mini project`  

---

## 1. RTL SOURCE CODE CATALOG (`rtl/`)

All 11 Verilog modules are synthesizable, parameter-free or parameter-compliant, and adhere to IEEE 1364-2005 Verilog standards:

| # | Filename | Line Count | Primary Module Name | Description & Architecture | Synthesis Status |
| :---: | :--- | :---: | :--- | :--- | :---: |
| 1 | `rtl/half_adder.v` | 21 | `half_adder` | 1-bit primitive computing $S = A \oplus B$, $C = A \cdot B$ | Verified Primitive |
| 2 | `rtl/full_adder.v` | 29 | `full_adder` | 1-bit full adder computing Sum and Carry-out via internal gate primitives | Verified Primitive |
| 3 | `rtl/carry_skip_block_4bit.v` | 55 | `carry_skip_block_4bit` | 4-bit CSKA building block: 4 full adders, 4-input AND propagate detector, and 2:1 bypass multiplexer | Synthesized (Hierarchical) |
| 4 | `rtl/carry_skip_adder.v` | 82 | `carry_skip_adder` | Top-level 16-bit Carry Skip Adder chaining four 4-bit blocks with ripple bypass | Primary Design |
| 5 | `rtl/parameterized_cska.v` | 64 | `parameterized_cska` | Generic $N$-bit CSKA supporting arbitrary bitwidths and block sizes via Verilog `generate` | Exploratory Model |
| 6 | `rtl/ripple_carry_adder.v` | 38 | `ripple_carry_adder` | Baseline 16-bit Ripple Carry Adder chaining 16 full adders sequentially | Baseline Comparison |
| 7 | `rtl/cla_block_4bit.v` | 52 | `cla_block_4bit` | 4-bit Carry Lookahead generator with internal carry lookahead logic | Sub-block |
| 8 | `rtl/carry_lookahead_adder.v` | 68 | `carry_lookahead_adder` | 16-bit Carry Lookahead Adder using hierarchical 4-bit CLA blocks | High-Speed Benchmark |
| 9 | `rtl/csla_block_4bit.v` | 50 | `csla_block_4bit` | Dual-speculative 4-bit adder evaluating sum paths for $C_{in}=0$ and $C_{in}=1$ | Sub-block |
| 10 | `rtl/carry_select_adder.v` | 56 | `carry_select_adder` | 16-bit Carry Select Adder using multiplexer-selected speculative blocks | High-Speed Benchmark |
| 11 | `rtl/brent_kung_adder.v` | 178 | `brent_kung_adder` | 16-bit parallel prefix Brent-Kung adder with logarithmic carry tree | Tree-Adder Benchmark |

---

## 2. VERIFICATION & TESTBENCH SUITES (`verification/`)

The verification environment validates functional equivalence against a 17-bit golden reference adder model ($A + B + C_{in}$) across standard corner vectors, worst-case carry propagation, alternating patterns, and randomized vectors:

| # | Filename | Vectors Executed | Mismatches | Waveform Dump | Execution Command |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `verification/common_reference_model.v` | Golden Ref | 0 | None | Self-checking module included by testbenches |
| 2 | `verification/testbench_cska.v` | 10,038 | 0 | `cska.vcd` | `iverilog -o tb_cska.vvp -I rtl verification/testbench_cska.v rtl/*.v && vvp tb_cska.vvp` |
| 3 | `verification/testbench_rca.v` | 10,000 | 0 | `rca.vcd` | `iverilog -o tb_rca.vvp -I rtl verification/testbench_rca.v rtl/ripple_carry_adder.v rtl/full_adder.v && vvp tb_rca.vvp` |
| 4 | `verification/testbench_cla.v` | 10,000 | 0 | `cla.vcd` | `iverilog -o tb_cla.vvp -I rtl verification/testbench_cla.v rtl/carry_lookahead_adder.v rtl/cla_block_4bit.v rtl/full_adder.v && vvp tb_cla.vvp` |
| 5 | `verification/testbench_csla.v` | 10,000 | 0 | `csla.vcd` | `iverilog -o tb_csla.vvp -I rtl verification/testbench_csla.v rtl/carry_select_adder.v rtl/csla_block_4bit.v rtl/full_adder.v && vvp tb_csla.vvp` |
| 6 | `verification/testbench_bk.v` | 10,000 | 0 | `bk.vcd` | `iverilog -o tb_bk.vvp -I rtl verification/testbench_bk.v rtl/brent_kung_adder.v && vvp tb_bk.vvp` |
| 7 | `verification/testbench_all.v` | Unified Suite | 0 | `all.vcd` | `iverilog -o tb_all.vvp -I rtl verification/testbench_all.v rtl/*.v && vvp tb_all.vvp` |

**Total Cumulative Verified Vectors:** **60,038 vectors** (100% Pass Rate).

---

## 3. LOGIC SYNTHESIS SCRIPTS (`synthesis/`)

Yosys automation maps synthesizable Verilog directly to the open-source Google/SkyWater 130nm High-Density Standard Cell Library (`sky130_fd_sc_hd__tt_025C_1v80.lib`):

| Script Path | Purpose | Key Yosys Commands | Output Netlist Artifact |
| :--- | :--- | :--- | :--- |
| `synthesis/run_synthesis.py` | Master Python synthesis orchestrator | Executes all 7 synthesis recipes sequentially, extracts cell counts, gate distribution, and silicon area | `synthesis/reports/synthesis_summary.json` & `.csv` |
| `synthesis/yosys_scripts/synth_cska.ys` | Flattened CSKA synthesis | `read_verilog`, `synth -top carry_skip_adder -flatten`, `dfflibmap`, `abc -liberty ...`, `stat` | `synthesis/netlists/cska_sky130_netlist.v` (48 cells, 440.42 µm²) |
| `synthesis/yosys_scripts/synth_cska_hier.ys` | Hierarchical CSKA synthesis | `read_verilog`, `hierarchy -top carry_skip_adder -check`, `synth -top carry_skip_adder -noflatten`, `abc -liberty ...` | `synthesis/netlists/cska_hier_sky130_netlist.v` (56 cells, 760.73 µm²) |
| `synthesis/yosys_scripts/synth_rca.ys` | Flattened RCA synthesis | `read_verilog`, `synth -top ripple_carry_adder -flatten`, `abc -liberty ...` | `synthesis/netlists/rca_sky130_netlist.v` (48 cells, 440.42 µm²) |
| `synthesis/yosys_scripts/synth_rca_hier.ys` | Hierarchical RCA synthesis | `read_verilog`, `synth -top ripple_carry_adder -noflatten`, `abc -liberty ...` | `synthesis/netlists/rca_hier_sky130_netlist.v` (32 cells, 497.02 µm²) |
| `synthesis/yosys_scripts/synth_cla.ys` | 16-bit CLA synthesis | `synth -top carry_lookahead_adder -flatten`, `abc -liberty ...` | `synthesis/netlists/cla_sky130_netlist.v` (61 cells, 638.30 µm²) |
| `synthesis/yosys_scripts/synth_csla.ys` | 16-bit CSLA synthesis | `synth -top carry_select_adder -flatten`, `abc -liberty ...` | `synthesis/netlists/csla_sky130_netlist.v` (87 cells, 863.66 µm²) |
| `synthesis/yosys_scripts/synth_bk.ys` | 16-bit Brent-Kung synthesis | `synth -top brent_kung_adder -flatten`, `abc -liberty ...` | `synthesis/netlists/bk_sky130_netlist.v` (64 cells, 680.12 µm²) |

---

## 4. ASIC PHYSICAL DESIGN SCRIPTS (`physical_design/`)

These scripts translate the synthesized standard-cell netlist into physical standard-cell rows, generate DEF placement, and stream out the complete multi-layer GDSII stream:

| Script Path | Role in Physical Flow | Inputs | Key Outputs | Execution Command |
| :--- | :--- | :--- | :--- | :--- |
| `physical_design/generate_physical_layout.py` | Computes core/die dimensions, creates standard-cell rows (46.0 µm x 35.0 µm), assigns cell coordinates, generates DEF file | `synthesis/netlists/cska_sky130_netlist.v` | `physical_design/placement/cska_sky130.def` | `python physical_design/generate_physical_layout.py` |
| `physical_design/export_gds.py` | Reads DEF placement, instantiates SkyWater 130nm HD standard-cell geometries via KLayout Pya engine, streams out binary GDSII | `cska_sky130.def`, `sky130_fd_sc_hd.gds` | `physical_design/gds/cska_sky130.gds` (4.18 MB) | `klayout_app.exe -z -r physical_design/export_gds.py` |
| `physical_design/plot_layout.py` | Extracts standard cell coordinates and renders a 2D floorplan visualization with cell color categorization | `cska_sky130.def` | `physical_design/reports/cska_placement_layout.png` | `python physical_design/plot_layout.py` |
| `physical_design/export_snapshot.py` | Automated high-resolution KLayout off-screen render generator | `cska_sky130.gds` | `physical_design/reports/gds_snapshot.png` | `python physical_design/export_snapshot.py` |

---

## 5. COMPARATIVE ANALYSIS & REPORTING SCRIPTS (`analysis/`)

Quantitative post-synthesis analysis, architectural trade-off evaluation, and graph generation:

| Script Path | Purpose | Key Mathematical Models | Generated Output Files |
| :--- | :--- | :--- | :--- |
| `analysis/performance_analysis.py` | Calculates area, delay, dynamic power, leakage power, and Area-Delay Product (ADP) across all 5 adders | Liberty cell delay modeling, dynamic switching $P = \alpha C V^2 f$, static leakage summation | `analysis/comparison_results.csv`, `analysis/comparison_results.json` |
| `analysis/block_size_experiment.py` | Evaluates CSKA delay across block sizes (2-bit, 4-bit, 8-bit, variable) | $T_{CSKA} = 2(k-1)\tau_{ripple} + (M-2)\tau_{skip}$ | `analysis/block_size_experiment.csv`, `analysis/graphs/block_size_experiment.png` |
| `analysis/scalability_study.py` | Projects architectural scaling across 16-bit, 32-bit, 64-bit, and 128-bit operands | Delay asymptotic orders: $O(N)$ for RCA, $O(\sqrt{N})$ for CSKA, $O(\log_2 N)$ for CLA/BK | `analysis/scalability_results.csv`, `analysis/graphs/scalability_delay_curve.png` |
| `analysis/recommendation_engine.py` | Generates context-aware architecture selection recommendations based on power/area/speed budgets | Multi-objective scoring matrix, Pareto-optimal frontier | `analysis/recommendation_report.json` |

---

## 6. PROJECT ORCHESTRATION & PACKAGING SCRIPTS (`scripts/`)

| Script Path | Purpose | Usage |
| :--- | :--- | :--- |
| `scripts/package_submission.py` | Bundles complete project deliverables into clean ZIP archive excluding caches | `python scripts/package_submission.py` |
| `scripts/setup_env.ps1` | Configures PowerShell environment paths for OSS CAD Suite and Python | `.\scripts\setup_env.ps1` |
| `scripts/setup_env.bat` | Command prompt launcher for Windows batch environments | `scripts\setup_env.bat` |

