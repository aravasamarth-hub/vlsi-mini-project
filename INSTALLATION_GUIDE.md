# VLSI TOOLCHAIN & ENVIRONMENT INSTALLATION REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit & Verification Date:** November 05, 2026  
**Status:** **100% VERIFIED & OPERATIONAL**  
**Workspace:** `D:\mini project` (Mapped to virtual clean drive `X:\`)  

---

## 1. VERIFIED TOOLCHAIN VERSIONS & PATHS

| Tool / Component | Version Detected | Installed Location | Verification Status |
| :--- | :--- | :--- | :--- |
| **Icarus Verilog (`iverilog`)** | `14.0 (devel) s20260301` | `X:\tools\oss-cad-suite\bin\iverilog.exe` | **PASSED** (Testbench executed via VVP) |
| **VVP Runtime Engine** | `14.0 (devel) s20260301` | `X:\tools\oss-cad-suite\bin\vvp.exe` | **PASSED** (Simulation output verified) |
| **GTKWave Waveform Viewer**| `v4.0.0-prealpha (e40ba79)`| `X:\tools\oss-cad-suite\bin\gtkwave.exe` | **PASSED** (CLI and engine operational) |
| **Yosys Open Synthesis** | `0.70+329 (git sha1 b8d84f823)`| `X:\tools\oss-cad-suite\bin\yosys.exe` | **PASSED** (RTL elaboration & mapping tested) |
| **ABC Logic Synthesis** | Integrated in Yosys | `X:\tools\oss-cad-suite\bin\abc.exe` | **PASSED** (Sky130 standard-cell mapping verified) |
| **KLayout Layout Engine** | `0.30.12 (Pya API 0.30.12)` | `C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe` | **PASSED** (Parsed 433 Sky130 HD layout cells) |
| **Python Virtual Env** | `Python 3.11/3.14 + uv` | `X:\.venv\Scripts\python.exe` | **PASSED** (FastAPI, NumPy, Pandas, Matplotlib) |

---

## 2. SKY130 HD PDK ASSETS (VERIFIED ON DISK)

Located in `synthesis/sky130_pdk/`:
1. `sky130_fd_sc_hd__tt_025C_1v80.lib` (12.5 MB) — SkyWater 130nm High-Density Standard Cell Liberty timing model.
2. `sky130_fd_sc_hd.gds` (4.1 MB) — Complete standard-cell transistor layout GDSII library.
3. `sky130_fd_sc_hd_merged.lef` (2.2 MB) — Standard-cell physical layout macros for place-and-route.
4. `sky130_fd_sc_hd.tlef` (17 KB) — Technology LEF containing 5-metal interconnect stack definitions.
5. `sky130hd.lyp` & `sky130hd.lyt` (253 KB) — KLayout layer properties and display technology rules.

---

## 3. ZERO-IMPACT ENVIRONMENT CONFIGURATION

To avoid polluting system-wide Windows registry or PATH:
- Project root mapped to virtual drive `X:\` using Windows `subst X: "D:\mini project"` (handles spaces seamlessly).
- Ready-to-use session activators provided in:
  - `scripts/setup_env.ps1` (PowerShell)
  - `scripts/setup_env.bat` (Command Prompt)
- Python runner scripts directly utilize `X:\tools\oss-cad-suite\bin`.

---
*Phase 2 Toolchain Installation Completed and 100% Empirically Validated.*
