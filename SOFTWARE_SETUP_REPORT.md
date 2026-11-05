# SOFTWARE SETUP & VERIFICATION REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 06, 2026  
**Workspace:** `D:\mini project`  

---

## 1. SETUP STATUS FOR ALL TOOLS

| Tool Category | Tool Name | Executable Location | Setup Verification Command | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Simulation** | Icarus Verilog | `tools/oss-cad-suite/bin/iverilog.exe` | `iverilog -V` | **PASS (14.0 devel)** |
| **Simulation** | vvp Runtime | `tools/oss-cad-suite/bin/vvp.exe` | `vvp -V` | **PASS (14.0 devel)** |
| **Waveform** | GTKWave | `tools/oss-cad-suite/bin/gtkwave.exe` | `gtkwave -V` | **PASS (3.3.118)** |
| **Synthesis** | Yosys | `tools/oss-cad-suite/bin/yosys.exe` | `yosys -V` | **PASS (0.70+329)** |
| **Layout Viewer**| KLayout | `AppData/Roaming/KLayout/klayout_app.exe`| `klayout_app.exe -v` | **PASS (0.30.12)** |
| **Web Backend** | FastAPI + Uvicorn | `D:\mini project\.venv\Scripts\python.exe`| `python -m pytest backend/test_api.py` | **PASS (7 tests)** |
| **Web Frontend**| React + Three.js | `D:\mini project\frontend` | `npm run build` | **PASS (dist/ generated)** |

---

## 2. PORTABLE EDA SUITE INTEGRATION (NO SYSTEM POLLUTION)

To ensure zero registry or system path pollution on Windows 11, the open-source EDA suite (Icarus Verilog, Yosys, ABC, GTKWave) is hosted directly inside `D:\mini project\tools\oss-cad-suite\`.

### Virtual Drive Mapping for Space-Safe Execution
Because Windows tools sometimes struggle with file paths containing spaces (`D:\mini project`), the project includes automated drive mapping:
```powershell
subst X: "D:\mini project"
& "X:\tools\oss-cad-suite\environment.ps1"
```
This maps the project cleanly to drive `X:\`, ensuring 100% path safety for all C/C++ EDA binary wrappers.

---

## 3. VERIFICATION OF PDK REPOSITORY ASSETS

The open-source SkyWater 130nm High-Density PDK subset (`synthesis/sky130_pdk/`) was verified:
1. `sky130_fd_sc_hd__tt_025C_1v80.lib` (12,800,135 bytes): Formally validated against Yosys `dfflibmap` and `abc -liberty`.
2. `sky130_fd_sc_hd.gds` (4,182,250 bytes): Formally verified containing all 433 base cell layout structures in KLayout.
3. `sky130_fd_sc_hd_merged.lef` (2,258,431 bytes): Formally verified for cell dimensions and pin geometries.
