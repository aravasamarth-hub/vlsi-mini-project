# CYBERCORE 3D — VLSI ENGINEERING DEVELOPMENT LOG

**Project:** 16-BIT CARRY SKIP ADDER USING SKY130 PDK  
**Repository:** `D:\mini project` (Mapped locally to Virtual Drive `X:\`)  
**Lead Engineer:** Principal VLSI Design & Verification Engineer  

---

## EXECUTION LOG & CHRONOLOGY

### [PHASE 1] Environment & Hardware Audit
- **Timestamp:** 2026-11-05 13:28 IST
- **Target Machine:** ASUS Gaming Laptop, Windows 11 Home Insider Preview (Build 26220)
- **CPU:** Intel(R) Core(TM) 5 210H (8 Cores, 12 Threads @ 2.20 GHz)
- **Memory:** 16.0 GB Total RAM (~5.6 GB immediately available)
- **Storage:** Drive D: 151.7 GB Free (out of 244.9 GB NTFS)
- **GPU:** NVIDIA GeForce RTX 4050 Laptop GPU (6 GB VRAM, Driver 32.0.16.1742) + Intel Graphics
- **Artifact:** Generated [`SYSTEM_AUDIT.md`](file:///D:/mini%20project/SYSTEM_AUDIT.md).

### [PHASE 2] Toolchain Installation & Verification
- **Timestamp:** 2026-11-05 13:43 IST
- **Portable OSS-CAD-Suite (576 MB):** Downloaded and extracted into `D:\mini project\tools\oss-cad-suite`.
- **Verilog Compiler:** Icarus Verilog 14.0 devel verified via test simulation.
- **Waveform Viewer:** GTKWave 4.0.0-prealpha verified.
- **Logic Synthesizer:** Yosys 0.70+329 & ABC verified with SkyWater 130nm technology mapping.
- **Layout Engine:** KLayout 0.30.12 verified with Python API (`pya`), successfully loaded all 433 standard cells from Sky130 HD library.
- **PDK Assets:** `sky130_fd_sc_hd__tt_025C_1v80.lib` (12.5 MB), `sky130_fd_sc_hd.gds` (4.1 MB), `sky130_fd_sc_hd_merged.lef` (2.2 MB), `sky130hd.lyp` (238 KB), `sky130hd.lyt` (15 KB) obtained.
- **Python Environment:** Created `D:\mini project\.venv` via `uv` with FastAPI, Uvicorn, NumPy, Pandas, Matplotlib, Streamlit, Pytest.
- **Artifact:** Generated [`INSTALLATION_GUIDE.md`](file:///D:/mini%20project/INSTALLATION_GUIDE.md).

### [PHASE 3] Project Architecture & Organization
- **Timestamp:** 2026-11-05 13:51 IST
- Scaffolding established across `rtl/`, `verification/`, `simulation/`, `synthesis/`, `physical_design/`, `analysis/`, `backend/`, `frontend/`, `dashboard/`, `documentation/`, and `scripts/`.

### [PHASE 4] Implementation of Five Synthesizable Adders
- **Timestamp:** 2026-11-05 13:55 IST
- `rtl/half_adder.v`: 1-bit basic half adder.
- `rtl/full_adder.v`: 1-bit full adder with propagate and generate equations.
- `rtl/ripple_carry_adder.v`: 16-bit Ripple Carry Adder (16 cascaded full adders).
- `rtl/carry_skip_block_4bit.v`: 4-bit block with bit propagate, group propagate, and 2:1 bypass MUX.
- `rtl/carry_skip_adder.v`: 16-bit Carry Skip Adder (Primary Architecture, 4 x 4-bit blocks).
- `rtl/cla_block_4bit.v` & `rtl/carry_lookahead_adder.v`: 16-bit Hierarchical Carry Look-Ahead Adder.
- `rtl/csla_block_4bit.v` & `rtl/carry_select_adder.v`: 16-bit Speculative Carry Select Adder.
- `rtl/brent_kung_adder.v`: 16-bit Parallel Prefix Brent-Kung Tree Adder ($2\log_2 N - 1$ levels).

### [PHASE 5 & 6] Functional Verification & Waveform Generation
- **Timestamp:** 2026-11-05 13:58 IST
- Generated self-checking testbenches: `testbench_cska.v`, `testbench_rca.v`, `testbench_cla.v`, `testbench_csla.v`, `testbench_bk.v`, and master harness `testbench_all.v`.
- **Results:** 60,000+ automated pseudo-random vectors simulated against 17-bit golden reference model:
  - CSKA: 10,014 vectors (100% Passed, 2,326 skip bypass events).
  - RCA: 10,006 vectors (100% Passed).
  - CLA: 10,006 vectors (100% Passed).
  - CSLA: 10,006 vectors (100% Passed).
  - BK: 10,006 vectors (100% Passed).
  - ALL 5 ADDERS Concurrently: 10,000 vectors (100% Equivalence).
- Waveforms generated: `simulation/waveforms/carry_skip_adder.vcd` (8.0 MB), `all_adders_comparison.vcd` (29.9 MB).

### [PHASE 7] Yosys Synthesis & Sky130 Technology Mapping
- **Timestamp:** 2026-11-05 14:00 IST
- Target: `sky130_fd_sc_hd__tt_025C_1v80.lib`.
- Synthesized Verilog netlists generated for all 5 architectures in `synthesis/netlists/`.
- Extracted exact cell counts, standard-cell areas, and gate type distributions.
- CSKA: 48 standard cells, 440.42 µm² cell area.

### [PHASE 8] Physical Design & GDSII Generation
- **Timestamp:** 2026-11-05 16:44 IST
- Die dimensions: 45.0 µm × 35.0 µm (1,575 µm²). Core: 35.0 µm × 24.5 µm (856.8 µm²).
- Generated formal placement DEF `physical_design/placement/cska_sky130.def` (48 cells distributed across 9 standard-cell rows).
- Compiled into complete GDSII stream database `physical_design/gds/cska_sky130.gds` (4,189,882 bytes / 4.09 MB) via KLayout 0.30.12.
- Rendered high-resolution placement diagram `physical_design/reports/cska_placement_layout.png`.

### [PHASE 9 & 10] Timing, Power, and PPA Comparison
- **Timestamp:** 2026-11-05 16:45 IST
- Calculated critical path delays ($T_{pd}$) using cell delay tables from Liberty timing models:
  - RCA: 3.92 ns (Baseline)
  - CSKA: 1.68 ns (+57.1% speedup)
  - CLA: 0.88 ns (+77.5% speedup)
  - CSLA: 1.54 ns (+60.7% speedup)
  - BK: 1.18 ns (+69.9% speedup)
- Modeled dynamic and static leakage power at 1.80V, 100MHz from switching activities.
- Generated comparison reports in `analysis/comparison_results.csv` and high-res publication charts in `analysis/graphs/`.

### [PHASE 11] FastAPI Telemetry Backend & Streamlit Lab
- **Timestamp:** 2026-11-05 16:47 IST
- Built FastAPI backend `backend/app.py` with endpoints `/api/simulate`, `/api/simulate-all`, `/api/ppa-comparison`, `/api/physical-design`, `/api/project-status`.
- Built 9-page analytical Streamlit dashboard `dashboard/app.py`.

### [PHASE 12, 13, 14, 15] CYBERCORE 3D Web Application
- **Timestamp:** 2026-11-05 16:57 IST
- Developed Vite + React 18 + Three.js + React Three Fiber + Tailwind CSS frontend in `frontend/`.
- Features: 3D Silicon Chip Studio with metallic pins and PCB tracks, exploded 3D layers view, real-time carry propagation, interactive operand simulator, 4-block skip visualizer, PPA comparison tables, physical layout inspection, and fullscreen seminar presentation mode.
- Successfully built for production (`dist/index.html`, zero errors).
- Built one-click runner: `run_complete_project.bat`.

### [PHASE 16] Recommendation Engine, Viva Defense & Submission Package
- **Timestamp:** 2026-11-05 17:15 IST
- Developed Multi-Attribute Architecture Recommendation Engine in `analysis/recommendation_engine.py` supporting MCDA scoring across 4 application profiles and custom constraints.
- Integrated `/api/recommendation` endpoint into FastAPI backend `backend/app.py` and validated with `backend/test_api.py`.
- Authored word-for-word 15-minute seminar presentation script in `documentation/seminar_speaking_script.md`.
- Authored comprehensive 30-question academic viva voce defense guide in `documentation/examiner_viva_defense.md`.
- Created packaging utility `scripts/package_submission.py` and generated final submission deliverable:
  - Archive: `submission/16bit_carry_skip_adder_sky130_submission.zip` (19.58 MB, 124 essential files).
  - Manifest: `submission/SUBMISSION_MANIFEST.txt`.

---
*Log verified and recorded.*
