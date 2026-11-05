# SYSTEM AUDIT & VLSI ENVIRONMENT ASSESSMENT REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 05, 2026  
**Auditor:** Principal VLSI Design & EDA Systems Engineer  
**Workspace:** `D:\mini project`  

---

## 1. HARDWARE SPECIFICATIONS

| Component | Specification / Detected Value | Status / Capability |
| :--- | :--- | :--- |
| **System Model** | ASUS Gaming Laptop | High performance mobile workstation |
| **Operating System** | Microsoft Windows 11 Home Insider Preview (64-bit) | Build 26220 |
| **CPU Model** | Intel(R) Core(TM) 5 210H | 8 Cores, 12 Logical Threads @ 2.20 GHz |
| **System Memory (RAM)** | 16.0 GB (16,370,968 KB Total) | ~5.6 GB Available (Sufficient for ASIC synthesis & simulation) |
| **Dedicated GPU** | NVIDIA GeForce RTX 4050 Laptop GPU (Driver: 32.0.16.1742) | 6.0 GB VRAM, Hardware WebGL / Three.js acceleration enabled |
| **Integrated GPU** | Intel(R) Graphics (Driver: 32.0.101.7076) | Secondary display engine |
| **Storage (Project Drive D:)** | **151.7 GB Free** (out of 244.9 GB NTFS) | **Optimal location for PDK, layout artifacts & toolchains** |
| **Storage (System Drive C:)** | **75.7 GB Free** (out of 230.6 GB NTFS) | Sufficient for OS / WSL rootfs image |

---

## 2. SOFTWARE & RUNTIME AUDIT

| Software / Tool | Detected Version | Availability | Notes |
| :--- | :--- | :--- | :--- |
| **Git** | `2.54.0.windows.1` | **INSTALLED** | Ready for version control & submodule tracking |
| **Python** | `Python 3.11.15` | **INSTALLED** | 64-bit Python runtime |
| **Node.js** | `v24.17.0` | **INSTALLED** | Modern runtime for Vite + React Three Fiber |
| **npm** | `11.13.0` | **INSTALLED** | Ready for 3D UI dependencies |
| **Windows Package Manager** | `winget v1.29.250` | **INSTALLED** | Native automated software installer |
| **WSL Status** | WSL2 Engine Installed | **ACTIVE (No distros)** | Ready to spawn Ubuntu instance for OpenROAD |
| **Docker** | Not detected | Missing | WSL2 can run containerless or with Docker |
| **Python Libraries** | `fastapi 0.110.1`, `uvicorn 0.25.0`, `numpy 2.4.6`, `pandas 3.0.6`, `pydantic 2.13.5`, `pytest 9.1.1` | **INSTALLED** | Core backend engine ready |

---

## 3. VLSI & EDA TOOLCHAIN STATUS

| Tool Required | Role in Project | Current Status | Recommended Installation Path |
| :--- | :--- | :--- | :--- |
| **Icarus Verilog (`iverilog`, `vvp`)** | Verilog RTL simulation & VCD dumping | Missing | Windows installer / OSS-CAD-Suite / WSL2 |
| **GTKWave** | Digital waveform viewing | Missing | Included with Icarus Verilog / OSS-CAD-Suite |
| **Yosys & ABC** | RTL synthesis, Sky130 technology mapping | Missing | OSS-CAD-Suite (Windows) or apt/source in WSL2 |
| **SKY130 PDK** | SkyWater 130nm Standard Cells (`sky130_fd_sc_hd`) | Missing | Clone open-source Sky130 standard cell Liberty & LEF |
| **OpenROAD** | Floorplan, Placement, CTS, Routing, Timing | Missing | Prebuilt OpenROAD binary or WSL2 Ubuntu package |
| **KLayout** | GDSII layout viewer & physical inspection | Missing | `winget install KLayout.KLayout` (Verified available) |
| **Matplotlib & Streamlit** | PPA charts & alternative dashboard | Missing | `pip install matplotlib streamlit` |

---

## 4. EXISTING WORKSPACE AUDIT

- **Path:** `D:\mini project`
- **Initial Status:** Clean directory (no legacy conflicting files or broken build artifacts).
- **Preservation Assurance:** No existing files overwritten or deleted.

---

## 5. RECOMMENDED DUAL-TIER EXECUTION STRATEGY

To ensure **100% reproducibility, zero system corruption, and maximum speed** on this laptop:

1. **Tier 1 — High-Speed Native Windows EDA Flow:**
   - Install **Icarus Verilog + GTKWave** for Windows (instant compilation & microsecond testbench execution).
   - Install **Yosys + ABC** via native OSS-CAD-Suite or Windows binaries.
   - Target the official Google/SkyWater Sky130 High Density (`sky130_fd_sc_hd`) Liberty models (`.lib`, `.v`) directly in Yosys to generate standard-cell mapped netlists, cell counts, gate distribution, and area metrics.
   - Install **KLayout** for viewing GDSII and standard cell DEF/LEF layouts via native Windows package.

2. **Tier 2 — ASIC Physical Flow (OpenROAD & Sky130):**
   - Use OpenROAD / OpenROAD Flow Scripts on WSL2 (Ubuntu 24.04 LTS) for detailed placement, global routing, detailed routing, and timing slack analysis.

3. **Tier 3 — CYBERCORE 3D Interactive Lab:**
   - **Frontend:** React 18, Vite, Three.js, React Three Fiber, Framer Motion, Tailwind CSS running smoothly on Node.js 24 with RTX 4050 GPU acceleration.
   - **Backend:** FastAPI + Uvicorn server connecting the interactive 3D UI directly to Verilog simulation executables for real bit/group propagate and carry skip telemetry.

---

## 6. EXPECTED DISK SPACE BUDGET

- **Icarus Verilog & GTKWave:** ~50 MB
- **OSS-CAD-Suite (Yosys, ABC):** ~350 MB
- **SKY130 HD Standard Cell Library:** ~120 MB
- **KLayout:** ~200 MB
- **CYBERCORE 3D (React + Node modules):** ~450 MB
- **Total Drive D: consumption:** < 1.5 GB (Well within 151.7 GB available headroom).

---
*Status: Phase 1 Laptop & Environment Audit Completed Successfully.*

