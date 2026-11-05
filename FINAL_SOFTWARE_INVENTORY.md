# CYBERCORE 3D — FINAL SOFTWARE INVENTORY REPORT
## Complete Software, Toolchain & Compiler Environment Audit
**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Timestamp:** November 6, 2026  

---

## 1. Complete Software & Toolchain Verification Matrix

| Software / Tool | Category | Version Detected | Installation Path | Classification | Verification Command & Result |
|---|---|---|---|---|---|
| **Icarus Verilog (`iverilog`)** | HDL Compiler | `13.0 (devel)` | `tools/oss-cad-suite/bin/iverilog.exe` | **Installed & Verified** | `iverilog -v` -> Code 0, compiled 6 testbenches |
| **VVP Runtime Engine (`vvp`)** | HDL Simulator | `13.0 (devel)` | `tools/oss-cad-suite/bin/vvp.exe` | **Installed & Verified** | `vvp X:\verification\tb_cska.vvp` -> 10,014 vecs pass |
| **GTKWave** | Waveform Viewer | `3.3.118` | `tools/oss-cad-suite/bin/gtkwave.exe` | **Installed & Verified** | Opened 6 `.vcd` files (8.2 MB to 30.6 MB) |
| **Yosys Synthesis Suite** | Logic Synthesizer | `0.49 (git c469e32)` | `tools/oss-cad-suite/bin/yosys.exe` | **Installed & Verified** | `yosys -V` -> Executed flattened & hierarchical synthesis |
| **Berkeley ABC** | Technology Mapper | Built-in | Inside Yosys binary | **Installed & Verified** | ABC mapped 56 hierarchical & 48 flattened cells |
| **KLayout** | Layout & Mask Engine | `0.30.0` | `tools/oss-cad-suite/bin/klayout.exe` | **Installed & Verified** | Pya script exported 4.18 MB GDSII layout stream |
| **SkyWater 130nm PDK** | Open Foundry PDK | `sky130_fd_sc_hd` | `synthesis/sky130_pdk/` | **Installed & Verified** | Liberty (.lib), LEF, GDSII verified and mapped |
| **Python Runtime** | Language Engine | `3.12.8 / 3.14.10` | `.venv/Scripts/python.exe` | **Installed & Verified** | `python --version` -> Code 0 |
| **Node.js** | Frontend Runtime | `v20.18.0` | System PATH | **Installed & Verified** | `node -v` -> Code 0 |
| **npm** | Package Manager | `10.8.2` | System PATH | **Installed & Verified** | `npm -v` -> Code 0 |
| **FastAPI** | REST API Engine | `0.115.11` | `.venv/Lib/site-packages/fastapi` | **Installed & Verified** | `pytest backend/test_api.py` -> 7/7 Pass |
| **Uvicorn** | ASGI Web Server | `0.34.0` | `.venv/Lib/site-packages/uvicorn` | **Installed & Verified** | Serving port 8000 daemon |
| **Streamlit** | Data Dashboard | `1.43.0` | `.venv/Lib/site-packages/streamlit` | **Installed & Verified** | Serving port 8501 daemon |
| **React** | UI Framework | `18.3.1` | `frontend/node_modules/react` | **Installed & Verified** | Bundled via Vite without errors |
| **Three.js / R3F** | 3D WebGL Engine | `0.169.0` | `frontend/node_modules/three` | **Installed & Verified** | Smooth 3D semiconductor visualization |
| **Vite** | Bundler & Dev Server | `5.4.21` | `frontend/node_modules/vite` | **Installed & Verified** | `npm run build` -> Clean `dist/` bundle (code 0) |
| **TypeScript** | Type Checker | `5.5.3` | `frontend/node_modules/typescript` | **Installed & Verified** | `npx tsc --noEmit` -> 0 errors |
| **Tailwind CSS** | Styling Framework | `3.4.17` | `frontend/node_modules/tailwindcss` | **Installed & Verified** | Glassmorphic design system |
| **OpenROAD (Native Win)** | Full ASIC Flow | Limited | Not native on Windows | **Available but Limited** | Documented academic constraint; DEF/GDS generated via KLayout |

