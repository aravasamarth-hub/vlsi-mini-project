# CYBERCORE 3D — FINAL WORKSPACE DISCOVERY REPORT
## Complete Architectural Discovery & Workspace Manifest
**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace Root:** `D:\mini project` (Virtual Alias: `X:\`)  
**Audit Timestamp:** November 6, 2026  
**Auditor:** Senior VLSI System Architect & Workspace Auditor  

---

## 1. Eight-Layer Project Architecture Map

```
+---------------------------------------------------------------------------------------------------------+
|                                  CYBERCORE 3D SYSTEM ARCHITECTURE                                       |
+---------------------------------------------------------------------------------------------------------+
| LAYER 1: HARDWARE DESIGN (RTL)                                                                          |
|   Directory: rtl/                                                                                       |
|   Modules: carry_skip_adder.v (Top), carry_skip_block_4bit.v, full_adder.v, half_adder.v,               |
|            ripple_carry_adder.v, carry_lookahead_adder.v, cla_block_4bit.v,                             |
|            carry_select_adder.v, csla_block_4bit.v, brent_kung_adder.v, parameterized_cska.v           |
|                                                    |                                                    |
| LAYER 2: SIMULATION & VERIFICATION (Icarus Verilog + VVP)                                              |
|   Directory: verification/, simulation/                                                                 |
|   Testbenches: testbench_cska.v (10,014 vecs), testbench_all.v (10,000 vecs),                           |
|                testbench_rca.v, testbench_cla.v, testbench_csla.v, testbench_bk.v (10,006 vecs each)     |
|   Golden Model: common_reference_model.v (17-bit behavioral unconstrained addition)                     |
|   Waveforms: simulation/waveforms/*.vcd (6 GTKWave stream files)                                        |
|                                                    |                                                    |
| LAYER 3: SYNTHESIS & CELL MAPPING (Yosys 0.49 + ABC)                                                    |
|   Directory: synthesis/                                                                                 |
|   Target PDK: SkyWater 130nm HD CMOS (sky130_fd_sc_hd__tt_025C_1v80.lib)                                |
|   Outputs: synthesis/netlists/cska_hier_sky130_netlist.v (56 cells, preserved MUX & AND4)               |
|            synthesis/netlists/cska_sky130_netlist.v (48 cells, ABC flattened majority-3 netlist)        |
|                                                    |                                                    |
| LAYER 4: PHYSICAL DESIGN & GDSII (KLayout Pya Engine + DEF)                                             |
|   Directory: physical_design/                                                                           |
|   Floorplan: placement/cska_sky130.def (45 um x 35 um die, 9 rows, 48 placed standard cells)            |
|   Mask Stream: gds/cska_sky130.gds (4.18 MB binary GDSII layout with 433 geometry structures)           |
|                                                    |                                                    |
| LAYER 5: BACKEND / REST API (FastAPI + Uvicorn)                                                         |
|   Directory: backend/                                                                                   |
|   Daemon: app.py serving at http://127.0.0.1:8000                                                       |
|   Endpoints: /api/health, /api/simulate, /api/ppa, /api/physical-design, /api/status, /api/recommend     |
|   Test Suite: test_api.py (7 automated Pytest assertions, 100% pass)                                    |
|                                                    |                                                    |
| LAYER 6: FRONTEND APPLICATION (React 18 + TypeScript + Vite)                                            |
|   Directory: frontend/                                                                                  |
|   Daemon: Vite preview server at http://localhost:3000                                                  |
|   Views: 13 dedicated interactive modules (Overview, Workflow, Simulator, PPA, GDS, Viva, Seminar)     |
|                                                    |                                                    |
| LAYER 7: 3D SEMICONDUCTOR VISUALIZATION (Three.js + React Three Fiber)                                  |
|   Component: frontend/src/components/Chip3D.tsx                                                        |
|   Features: QFP gull-wing leads, 7 exploded layers, photon carry pulses, camera rig with smooth damping|
|                                                    |                                                    |
| LAYER 8: DOCUMENTATION, SCRIPTS & SUBMISSION ARCHIVE                                                    |
|   Directories: root, scripts/, submission/                                                              |
|   Launcher: START_CYBERCORE.bat and STOP_CYBERCORE.bat                                                  |
|   Submission Package: submission/16bit_carry_skip_adder_sky130_submission.zip (21.05 MB)               |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Inventory & File Discovery Audit

- **Root Markdown Documents:** 40 comprehensive technical reports and audit guides.
- **RTL Source Files:** 11 Verilog modules (`.v`), 0 latches, fully compliant with IEEE 1364-2005.
- **Verification Harnesses:** 6 testbenches, 1 golden behavioral reference model, 6 compiled `.vvp` binaries, 6 `.vcd` waveform dumps.
- **Synthesis Artifacts:** 7 `.ys` scripts, 7 synthesized Verilog netlists, 6 detailed synthesis logs, 1 JSON/CSV summary.
- **Physical Design Deliverables:** 1 `.def` floorplan, 1 `.gds` layout (4.18 MB), 1 `.sdc` timing constraint file, 1 layout plot.
- **SkyWater 130nm PDK Files:** Complete Liberty timing table (`.lib`, 12.8 MB), LEF files (`.tlef`, `.lef`), layout layer definitions (`.lyp`, `.lyt`), standard cell library GDS (`.gds`, 4.18 MB).
- **Backend Files:** `backend/app.py`, `backend/test_api.py`, `backend/requirements.txt`.
- **Frontend Files:** 18 React components (`.tsx`), Tailwind configuration, Vite bundler configuration, TypeScript configuration (`tsconfig.json`).
- **Dashboard Files:** `dashboard/app.py` (Streamlit analytics engine).
- **Automation Scripts:** `scripts/package_submission.py`, `physical_design/generate_physical_layout.py`, `physical_design/export_gds.py`, `START_CYBERCORE.bat`, `STOP_CYBERCORE.bat`.

---

## 3. Discrepancy & Health Findings

1. **Path Space Limitation in Icarus Verilog:** Bypassed with zero defect via `subst X: "D:\mini project"`.
2. **Flattened vs Hierarchical Logic Preservation:** Documented and verified. ABC optimizes away bypass multiplexers when unconstrained; hierarchical synthesis preserves all 4 `mux2_1` and `and4_1` gates.
3. **Physical Layout Boundary:** Honest documentation verified: GDSII file is an authentic standard-cell placement stream; detailed metal routing, CTS, and signoff DRC/LVS were not completed due to native Windows OpenROAD constraints.
4. **Active Services:** All 3 daemons (Vite on port 3000, FastAPI on port 8000, Streamlit on port 8501) tested and responding 200 OK.

