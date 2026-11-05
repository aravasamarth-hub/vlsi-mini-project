# COMPLETE SOFTWARE INVENTORY & COMPREHENSIVE TOOLCHAIN GUIDE

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 06, 2026  
**Workspace:** `D:\mini project`  

---

## 1. COMPREHENSIVE SOFTWARE AUDIT (EVERY TOOL EXPLAINED)

For every software package utilized in this project, the seven required criteria are documented:

### 1. Icarus Verilog (`iverilog`)
1. **What it is:** An open-source IEEE 1364-2005 compliant Verilog hardware description language compiler and simulator.
2. **Why it is used:** To compile synthesizable Verilog RTL and simulation testbenches into executable simulation binaries.
3. **Project use:** Compiles all 11 RTL files and 6 testbenches in `verification/`.
4. **How it works:** Parses Verilog source code, elaborates module hierarchies, performs syntax checking, and generates target code (`.vvp`) for the vvp runtime engine.
5. **Exact version:** `v14.0 (devel) s20260301-812-g9f2605013-dirty`.
6. **Installation location:** `D:\mini project\tools\oss-cad-suite\bin\iverilog.exe`.
7. **Execution command:**
   ```powershell
   iverilog -o sim.vvp -I rtl verification/testbench_cska.v verification/common_reference_model.v rtl/*.v
   ```

### 2. vvp Runtime Engine (`vvp`)
1. **What it is:** The runtime simulation execution engine for Icarus Verilog.
2. **Why it is used:** To execute compiled `.vvp` files, perform time-wheel simulation, run golden-model assertions, and dump VCD waveforms.
3. **Project use:** Executes all 60,038 test vectors across the 6 testbenches.
4. **How it works:** Loads compiled byte-code, processes event queues, schedules logic transitions, and logs simulation messages.
5. **Exact version:** `v14.0 (devel)`.
6. **Installation location:** `D:\mini project\tools\oss-cad-suite\bin\vvp.exe`.
7. **Execution command:**
   ```powershell
   vvp sim.vvp
   ```

### 3. GTKWave Waveform Viewer (`gtkwave`)
1. **What it is:** An open-source digital waveform analyzer for electronic design automation.
2. **Why it is used:** To visually inspect multi-signal transition waveforms, observe carry ripple rippling versus carry skipping, and verify timing relations.
3. **Project use:** Inspects `simulation/waveforms/carry_skip_adder.vcd` and `all_adders_comparison.vcd`.
4. **How it works:** Parses Value Change Dump (`.vcd`) files and renders multi-trace digital logic levels versus simulation time.
5. **Exact version:** `v3.3.118`.
6. **Installation location:** `D:\mini project\tools\oss-cad-suite\bin\gtkwave.exe`.
7. **Execution command:**
   ```powershell
   gtkwave simulation/waveforms/carry_skip_adder.vcd
   ```

### 4. Yosys Open SYnthesis Suite (`yosys`)
1. **What it is:** A framework for Verilog RTL synthesis and formal verification.
2. **Why it is used:** To perform logic synthesis, infer arithmetic operators, preserve module hierarchies, and execute technology mapping to SkyWater 130nm standard cells.
3. **Project use:** Synthesizes all 5 adder architectures (7 netlists generated in `synthesis/netlists/`).
4. **How it works:** Elaborates AST, applies behavioral logic optimization, calls ABC mapper, and generates structural Verilog netlists.
5. **Exact version:** `0.70+329 (git sha1 b8d84f823)`.
6. **Installation location:** `D:\mini project\tools\oss-cad-suite\bin\yosys.exe`.
7. **Execution command:**
   ```powershell
   yosys -s synthesis/yosys_scripts/synth_cska_hier.ys
   ```

### 5. Berkeley ABC
1. **What it is:** A software system for sequential logic synthesis and formal verification developed at UC Berkeley.
2. **Why it is used:** Performs And-Inverter Graph (AIG) technology mapping targeting the SkyWater 130nm Liberty timing library.
3. **Project use:** Maps boolean expressions into standard cells like `maj3_1`, `xnor2_1`, `mux2_1`, and `and4_1`.
4. **How it works:** Rewrites logic graphs for minimum delay and area, then binds nodes to standard cells via pattern matching.
5. **Exact version:** Integrated within Yosys 0.70.
6. **Installation location:** Embedded inside `yosys.exe`.
7. **Execution command:** Triggered via Yosys `abc -liberty ...` command.

### 6. KLayout Layout Viewer & Python API
1. **What it is:** An open-source mask layout viewer and physical layout manipulation tool for GDSII and OASIS formats.
2. **Why it is used:** To open, inspect, and programmatically generate GDSII layout streams from DEF placement data using Python Pya.
3. **Project use:** Streamed `physical_design/gds/cska_sky130.gds` (4.18 MB) from `cska_sky130.def`.
4. **How it works:** Loads physical layer properties (`sky130hd.lyp`), references library cells, and streams hierarchical polygons.
5. **Exact version:** `v0.30.12 (Native Windows) / v0.30.0 (Reference Environment)`.
6. **Installation location:** `C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe`.
7. **Execution command:**
   ```powershell
   klayout_app.exe physical_design/gds/cska_sky130.gds -l synthesis/sky130_pdk/sky130hd.lyp
   ```

### 7. Google / SkyWater SKY130 PDK
1. **What it is:** The open-source 130nm CMOS process design kit manufactured by SkyWater Technology foundry.
2. **Why it is used:** Provides industrial-grade standard cell models, timing libraries, and mask definitions for realistic silicon realization.
3. **Project use:** Supplies `sky130_fd_sc_hd` (High Density) standard cells (`.lib`, `.lef`, `.gds`).
4. **How it works:** Defines electrical parameters, transistor geometries, layer numbers, and site snapping grids.
5. **Exact version:** Rev 1.0 (7-track high-density library).
6. **Installation location:** `D:\mini project\synthesis\sky130_pdk\`.
7. **Execution command:** Referenced by Yosys and KLayout scripts.

### 8. Python Runtime & Scientific Stack
1. **What it is:** High-level programming language and package ecosystem.
2. **Why it is used:** Automates physical floorplanning, Liberty parsing, performance modeling, and hosts the FastAPI server.
3. **Project use:** `physical_design/*.py`, `analysis/*.py`, `backend/*.py`.
4. **How it works:** Python 3.11 virtual environment executing async web sockets and NumPy matrix operations.
5. **Exact version:** Python 3.11.15 / 3.14.10 64-bit.
6. **Installation location:** `D:\mini project\.venv\Scripts\python.exe`.
7. **Execution command:**
   ```powershell
   python backend/app.py
   ```

### 9. FastAPI & Uvicorn
1. **What it is:** Modern, high-performance web framework for building REST APIs with Python 3.8+ using standard Python type hints.
2. **Why it is used:** Connects the 3D web frontend directly to the Verilog simulation telemetry engine.
3. **Project use:** Serves `/api/simulate`, `/api/health`, and `/api/ppa-comparison` on port 8000.
4. **How it works:** Asynchronous ASGI server routing JSON requests to adder calculation engines.
5. **Exact version:** FastAPI 0.110.1, Uvicorn 0.25.0.
6. **Installation location:** `D:\mini project\.venv\Lib\site-packages\fastapi`.
7. **Execution command:**
   ```powershell
   uvicorn backend.app:app --host 127.0.0.1 --port 8000
   ```

### 10. Node.js & npm
1. **What it is:** Asynchronous event-driven JavaScript runtime and package manager.
2. **Why it is used:** Builds and serves the React 18 frontend and manages Three.js dependencies.
3. **Project use:** `frontend/` package building, TypeScript compilation, Vite bundling.
4. **How it works:** V8 engine executing local JavaScript scripts and bundlers.
5. **Exact version:** Node v24.17.0, npm 11.13.0.
6. **Installation location:** `C:\Program Files\nodejs\node.exe`.
7. **Execution command:**
   ```powershell
   npm run build
   ```

### 11. React 18, Three.js & Vite
1. **What it is:** Modern declarative UI library, WebGL 3D graphics engine, and fast build bundler.
2. **Why it is used:** Powers the CyberCore 3D engineering lab, interactive package rendering, exploded layers, and live controls.
3. **Project use:** All views in `frontend/src/`.
4. **How it works:** WebGL 2.0 hardware-accelerated rendering on the NVIDIA RTX 4050 GPU at 60 FPS.
5. **Exact version:** React 18.3.1, Three.js 0.170.0, Vite 6.0.1.
6. **Installation location:** `frontend/node_modules/`.
7. **Execution command:**
   ```powershell
   npm run preview -- --port 3000
   ```

### 12. Streamlit
1. **What it is:** Python-based framework for rapid data science and analytical dashboards.
2. **Why it is used:** Provides a secondary data-centric analytics dashboard for academic review.
3. **Project use:** `dashboard/app.py`.
4. **How it works:** Binds Python dataframes directly to web widgets on port 8501.
5. **Exact version:** 1.40.0+.
6. **Installation location:** `D:\mini project\.venv\Scripts\streamlit.exe`.
7. **Execution command:**
   ```powershell
   streamlit run dashboard/app.py --server.port 8501
   ```

### 13. Git Version Control
1. **What it is:** Distributed version control system for software and hardware projects.
2. **Why it is used:** Tracks all engineering revisions, RTL changes, synthesis netlists, and documentation.
3. **Project use:** Workspace repository `D:\mini project` on branch `master`.
4. **How it works:** Cryptographically tracks content changes via SHA-1 trees.
5. **Exact version:** `2.54.0.windows.1`.
6. **Installation location:** `C:\Program Files\Git\cmd\git.exe`.
7. **Execution command:**
   ```powershell
   git status
   ```

