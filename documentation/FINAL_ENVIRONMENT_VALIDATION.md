# FINAL DEVELOPMENT ENVIRONMENT & TOOLCHAIN VALIDATION
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Implementation  
**Workspace:** `D:\mini project`  
**Audit Date:** November 2026  
**Status:** **100% OPERATIONAL & VERIFIED**

---

## 1. Toolchain Matrix & Executable Registry

| Tool | Environment | Version | Executable / Container Path | Operational Status |
| :--- | :--- | :--- | :--- | :---: |
| **Git** | Windows 11 | 2.54.0.windows.1 | `C:\Program Files\Git\cmd\git.exe` | **OPERATIONAL** |
| **Python** | Windows Virtualenv | 3.14.10 (AMD64) | `D:\mini project\.venv\Scripts\python.exe` | **OPERATIONAL** |
| **Icarus Verilog** | Windows OSS CAD | v14.0 (devel) | `D:\mini project\tools\oss-cad-suite\bin\iverilog.exe` | **OPERATIONAL** |
| **VVP Runtime** | Windows OSS CAD | v14.0 (devel) | `D:\mini project\tools\oss-cad-suite\bin\vvp.exe` | **OPERATIONAL** |
| **Yosys** | Windows OSS CAD | 0.47+ | `D:\mini project\tools\oss-cad-suite\bin\yosys.exe` | **OPERATIONAL** |
| **WSL2** | Windows Subsystem | Ubuntu 24.04 LTS | `wsl.exe -d Ubuntu-24.04` | **OPERATIONAL** |
| **Docker** | WSL2 Ubuntu | 27.x CE | `/usr/bin/docker` | **OPERATIONAL** |
| **OpenROAD / ORFS** | Docker Container | `openroad/orfs:latest` | `/OpenROAD-flow-scripts/tools/install/OpenROAD/bin/openroad` | **OPERATIONAL** |
| **OpenSTA** | Docker Container | Built-in ORFS | `/OpenROAD-flow-scripts/tools/install/OpenROAD/bin/openroad` | **OPERATIONAL** |
| **KLayout** | Windows Native | 0.30.0 | User Desktop / Program Files (Verified with 6_final.gds) | **OPERATIONAL** |

---

## 2. PDK & Technology Platform Integrity

| Platform | PDK Library | Standard Cell Track | Target Operating Condition | Location |
| :--- | :--- | :---: | :---: | :--- |
| **SKY130HD** | `sky130_fd_sc_hd` | High Density (7-track) | $TT, 25^\circ\text{C}, 1.80\text{V}$ | `/OpenROAD-flow-scripts/flow/platforms/sky130hd` |
| **SKY130HS** | `sky130_fd_sc_hs` | High Speed (9-track) | $TT, 25^\circ\text{C}, 1.80\text{V}$ | `/OpenROAD-flow-scripts/flow/platforms/sky130hs` |

Both platform libraries are verified with full LEF, Liberty (`.lib`), Tech LEF, and GDS standard-cell definition streams.

