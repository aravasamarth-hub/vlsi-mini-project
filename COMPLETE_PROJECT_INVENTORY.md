# COMPLETE PROJECT INVENTORY & ASSET MANIFEST

**Project Title:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Platform:** CYBERCORE 3D — VLSI Engineering Lab  
**Workspace:** `D:\mini project`  
**Generated Date:** November 06, 2026  
**Auditor:** Multidisciplinary Senior Engineering Team  

---

## 1. EXECUTIVE DIRECTORY AUDIT

The workspace `D:\mini project` is partitioned into distinct modular domains:

| Directory Path | File Count | Primary Contents & Functional Role |
| :--- | :---: | :--- |
| `rtl/` | 11 | Synthesizable Verilog HDL modules (CSKA, RCA, CLA, CSLA, BK primitives) |
| `verification/` | 8 | 6 Testbench suites, golden reference model, and JSON/CSV summary manifests |
| `synthesis/` | 20 | Yosys scripts, 7 gate netlists, synthesis logs, and SkyWater 130nm PDK models |
| `physical_design/` | 8 | DEF placement (`cska_sky130.def`), binary GDSII (`cska_sky130.gds`), and Pya scripts |
| `analysis/` | 14 | PPA models, performance evaluators, scalability studies, and 6 publication PNGs |
| `backend/` | 2 | FastAPI REST API (`app.py`) and Pytest suite (`test_api.py`) |
| `dashboard/` | 1 | Multi-page Streamlit analytics dashboard (`app.py`) |
| `frontend/` | 21 | React 18, Three.js, WebGL 3D Studio, 14 modular UI components, Vite bundle |
| `documentation/` | 2 | 15-slide seminar speaking script and 30-question examiner viva defense guide |
| `scripts/` | 3 | Submission packaging script (`package_submission.py`) and environment scripts |
| `simulation/` | 4 | Compiled VVP binaries (`tb_cska.vvp`, `tb_all.vvp`) and VCD waveforms |
| `submission/` | 2 | Final distributable ZIP archive (21.02 MB) and text manifest |
| `tools/` | 11 | Portable OSS CAD Suite (iverilog, yosys, abc, gtkwave) and KLayout verification |
| Root `.md` Reports | 25 | Academic reports, audits, workflow guides, and readiness checklists |

---

## 2. DETAILED FILE-BY-FILE MANIFEST

### A. RTL Source Modules (`rtl/`)
1. `rtl/carry_skip_adder.v` (82 lines, 2.9 KB): Top-level 16-bit CSKA interconnecting four 4-bit blocks.
2. `rtl/carry_skip_block_4bit.v` (55 lines, 1.9 KB): 4-bit building block with 4 FAs, AND4, and 2:1 bypass MUX.
3. `rtl/ripple_carry_adder.v` (38 lines, 982 B): Baseline 16-bit RCA.
4. `rtl/carry_lookahead_adder.v` (68 lines, 2.2 KB): 16-bit CLA.
5. `rtl/cla_block_4bit.v` (52 lines, 1.6 KB): 4-bit CLA carry generator.
6. `rtl/carry_select_adder.v` (56 lines, 1.8 KB): 16-bit CSLA with dual speculative paths.
7. `rtl/csla_block_4bit.v` (50 lines, 1.7 KB): 4-bit CSLA speculative block.
8. `rtl/brent_kung_adder.v` (178 lines, 6.4 KB): 16-bit parallel prefix Brent-Kung adder.
9. `rtl/parameterized_cska.v` (64 lines, 2.2 KB): Parameterized N-bit CSKA generator.
10. `rtl/full_adder.v` (29 lines, 659 B): 1-bit full adder primitive.
11. `rtl/half_adder.v` (21 lines, 433 B): 1-bit half adder primitive.

### B. Verification & Testbenches (`verification/`)
1. `verification/common_reference_model.v` (25 lines, 615 B): 17-bit golden model `{Cout, Sum} = A + B + Cin`.
2. `verification/testbench_cska.v` (142 lines, 5.3 KB): 10,014-vector CSKA testbench.
3. `verification/testbench_all.v` (156 lines, 5.5 KB): 10,000-cycle unified lockstep 5-adder testbench.
4. `verification/testbench_rca.v` (78 lines, 2.7 KB): 10,006-vector RCA testbench.
5. `verification/testbench_cla.v` (78 lines, 2.7 KB): 10,006-vector CLA testbench.
6. `verification/testbench_csla.v` (78 lines, 2.7 KB): 10,006-vector CSLA testbench.
7. `verification/testbench_bk.v` (78 lines, 2.7 KB): 10,006-vector Brent-Kung testbench.
8. `verification/verification_results/verification_summary.json` (1.4 KB): Formal verification scoreboard.
9. `verification/verification_results/verification_summary.csv` (720 B): Tabular verification data.

### C. Logic Synthesis & Netlists (`synthesis/`)
1. `synthesis/netlists/cska_sky130_netlist.v` (11.0 KB): Flattened CSKA netlist (48 cells, 440.42 µm²).
2. `synthesis/netlists/cska_hier_sky130_netlist.v` (3.7 KB): Hierarchical CSKA netlist (56 cells, 760.73 µm²).
3. `synthesis/netlists/rca_sky130_netlist.v` (12.5 KB): Flattened RCA netlist (48 cells, 440.42 µm²).
4. `synthesis/netlists/rca_hier_sky130_netlist.v` (2.9 KB): Hierarchical RCA netlist (32 cells, 497.02 µm²).
5. `synthesis/netlists/cla_sky130_netlist.v` (8.6 KB): Mapped CLA netlist (61 cells, 638.30 µm²).
6. `synthesis/netlists/csla_sky130_netlist.v` (18.4 KB): Mapped CSLA netlist (87 cells, 863.66 µm²).
7. `synthesis/netlists/bk_sky130_netlist.v` (8.8 KB): Mapped Brent-Kung netlist (64 cells, 680.12 µm²).
8. `synthesis/reports/synthesis_summary.json` (4.4 KB) & `synthesis_summary.csv` (329 B).
9. `synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib` (12.8 MB): Liberty timing models.
10. `synthesis/sky130_pdk/sky130_fd_sc_hd.gds` (4.18 MB): Standard cell layout library.
11. `synthesis/sky130_pdk/sky130_fd_sc_hd_merged.lef` (2.25 MB): LEF pin and boundary models.

### D. Physical Layout & Floorplan (`physical_design/`)
1. `physical_design/gds/cska_sky130.gds` (4,189,882 bytes / 4.18 MB): Binary GDSII stream.
2. `physical_design/placement/cska_sky130.def` (3,643 bytes): 48-cell standard cell placement DEF.
3. `physical_design/reports/cska_placement_layout.png` (191.7 KB): High-res 2D placement plot.
4. `physical_design/generate_physical_layout.py` (6.0 KB): Core/die & 9-row placement engine.
5. `physical_design/export_gds.py` (1.8 KB): KLayout Pya GDSII streaming engine.

### E. Analysis & PPA Benchmarks (`analysis/`)
1. `analysis/comparison_results.csv` (615 B) & `comparison_results.json` (2.5 KB).
2. `analysis/performance_analysis.py` (12.0 KB): Critical path delay & dynamic power calculation.
3. `analysis/block_size_experiment.py` (6.0 KB): CSKA block-size delay curve evaluator.
4. `analysis/scalability_study.py` (3.6 KB): 16 to 128-bit asymptotic scaling model.
5. `analysis/graphs/*.png` (6 files): High-res Matplotlib 300-DPI charts.

### F. Applications & Services
1. `frontend/` (React 18 + Three.js + Vite): Serving at `http://localhost:3000`.
2. `backend/app.py` (FastAPI + Uvicorn): Serving at `http://127.0.0.1:8000`.
3. `dashboard/app.py` (Streamlit): Serving at `http://localhost:8501`.
4. `submission/16bit_carry_skip_adder_sky130_submission.zip` (21.02 MB): Distributable package.
