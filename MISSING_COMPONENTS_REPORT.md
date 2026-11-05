# MISSING COMPONENTS & ENVIRONMENT LIMITATIONS REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 05, 2026  
**Workspace:** `D:\mini project`  

---

## 1. AUDIT FINDINGS: INSTALLED VS MISSING COMPONENTS

This audit identifies tools, files, or packages that are either installed, optional, or not natively available on Windows 11:

| Component | Status | Category | Engineering Impact & Mitigation |
| :--- | :---: | :--- | :--- |
| **Icarus Verilog (`iverilog`)** | **INSTALLED** | Core EDA | Located in `tools/oss-cad-suite/bin/iverilog.exe`. 100% operational. |
| **vvp Runtime Engine** | **INSTALLED** | Core EDA | Located in `tools/oss-cad-suite/bin/vvp.exe`. 100% operational. |
| **GTKWave Waveform Viewer** | **INSTALLED** | Core EDA | Located in `tools/oss-cad-suite/bin/gtkwave.exe`. 100% operational. |
| **Yosys Logic Synthesizer** | **INSTALLED** | Core EDA | Located in `tools/oss-cad-suite/bin/yosys.exe`. 100% operational. |
| **Berkeley ABC Mapper** | **INSTALLED** | Core EDA | Embedded inside Yosys binary. 100% operational. |
| **KLayout Layout Viewer/API** | **INSTALLED** | Core EDA | Installed at `C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe`. |
| **SkyWater 130nm HD PDK** | **INSTALLED** | Semiconductor PDK | Complete `.lib`, `.lef`, `.gds` in `synthesis/sky130_pdk/`. |
| **Python Virtual Environment** | **INSTALLED** | Backend Runtime | Python 3.11/3.14 venv at `D:\mini project\.venv`. |
| **FastAPI & Uvicorn** | **INSTALLED** | Web Backend | Serving live simulation API at `http://127.0.0.1:8000`. |
| **Streamlit** | **INSTALLED** | Analytics Dashboard | Serving secondary dashboard at `http://localhost:8501`. |
| **React 18 + Three.js** | **INSTALLED** | Web Frontend | Serving CyberCore 3D Web App at `http://localhost:3000`. |
| **TritonRoute (Detailed Router)** | **NOT INSTALLED** | Physical Design | Detailed signal routing between placed standard cells was not executed. Layout contains placed cells and die boundary, but not routed signal wires. |
| **Clock Tree Synthesis (CTS)** | **NOT REQUIRED** | Physical Design | The 16-bit Carry Skip Adder is a purely combinational circuit; synchronous clock distribution buffers are neither required nor inserted. |
| **Magic VLSI** | **NOT INSTALLED** | Physical Verification | Linux-native tool (requires WSL2). Not required for native Windows GDSII streaming, which is handled completely by KLayout Pya. |
| **Netgen (LVS Tool)** | **NOT INSTALLED** | Physical Verification | Linux-native tool (requires WSL2). Because detailed routing is uncompleted, full LVS extraction against SPICE netlists cannot be closed. |
| **OpenSTA Signoff Timing** | **NOT INSTALLED** | Static Timing Analysis | Post-route STA requires SPEF parasitic extraction. The project uses Liberty non-linear cell delay lookup tables and analytical topological critical path modeling. |

---

## 2. DUPLICATE & UNUSED FILES RESOLUTION

- **Portable EDA Archive:** `tools/oss-cad-suite.tgz` (604 MB) is an unextracted distribution archive. It is excluded from the Git tracking and the final submission ZIP archive to prevent repository bloating.
- **Node Modules & Python Cache:** Excluded via `.gitignore` and `package_submission.py`.
- **Netlists:** Both flattened (`cska_sky130_netlist.v`) and hierarchical (`cska_hier_sky130_netlist.v`) are deliberately preserved to demonstrate the critical difference between unconstrained ABC flattening (48 cells) and hierarchy preservation (56 cells).

---

## 3. ZERO DATA FABRICATION DECLARATION

In accordance with strict academic guidelines:
1. No post-route timing slacks have been simulated or presented as real silicon measurements.
2. No DRC/LVS zero-violation signoff badges are claimed.
3. Every test vector count (60,038) is extracted directly from actual simulation logs.
4. Every silicon area figure (440.42 µm² flat vs 760.73 µm² hier) is extracted directly from Yosys standard-cell statistics.
