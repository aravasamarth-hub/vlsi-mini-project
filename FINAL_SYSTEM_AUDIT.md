# FINAL SYSTEM AUDIT & VLSI ENVIRONMENT ASSESSMENT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 05, 2026  
**Auditor:** Principal VLSI Design & EDA Systems Engineer  
**Workspace:** `D:\mini project`  
**Git Branch:** `master` (All milestones committed)  

---

## 1. WORKSPACE DIRECTORY & REPOSITORY INTEGRITY

- **Workspace Path:** `D:\mini project`
- **Total Repository Size (excluding .venv & tools):** ~94 MB
- **Total Packaged Candidate Files:** 156 files
- **Submission ZIP Package:** `submission/16bit_carry_skip_adder_sky130_submission.zip` (21.00 MB)
- **Git Commit History:** Complete linear commit tree tracking all stages from initial RTL design to the master VLSI explorer transformation.

---

## 2. HARDWARE SPECIFICATIONS & PERFORMANCE PROFILES

Audited natively via Windows Management Instrumentation (WMI / CIM):

| Hardware Component | Detected Specification | Capability & Purpose |
| :--- | :--- | :--- |
| **System Model** | ASUS Gaming Workstation | High sustained thermal dissipation for EDA compilation |
| **Operating System** | Microsoft Windows 11 Home (64-bit) | Build 26220 (NT Kernel 10.0) |
| **Processor (CPU)** | **Intel(R) Core(TM) 5 210H** | **8 Cores, 12 Threads @ 2.20 GHz** (Parallel testbench execution) |
| **System Memory (RAM)** | **16.0 GB DDR5** (16,370,968 KB Total) | In-memory Liberty timing model caching |
| **Dedicated GPU** | **NVIDIA GeForce RTX 4050 Laptop GPU** | **6.0 GB GDDR6 VRAM**, Driver 32.0.16.1742 (Hardware WebGL acceleration) |
| **Integrated GPU** | Intel(R) Graphics | Driver 32.0.101.7076 |
| **Project Storage (Drive D:)** | **244.9 GB NTFS (151.7 GB Free)** | High-speed PCIe 4.0 NVMe SSD |
| **System Storage (Drive C:)** | **230.6 GB NTFS (75.7 GB Free)** | System binaries and package caches |

---

## 3. EDA TOOLS & COMPILERS AUDIT

| EDA Tool | Version Detected | Executable Binary Location | Purpose in Flow | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Icarus Verilog (`iverilog`)** | v14.0 (devel) `s20260301-812` | `D:\mini project\tools\oss-cad-suite\bin\iverilog.exe` | IEEE 1364 Verilog RTL compilation | **VERIFIED** |
| **vvp Runtime Engine** | v14.0 (devel) | `D:\mini project\tools\oss-cad-suite\bin\vvp.exe` | Testbench execution (60,038 vectors) | **VERIFIED** |
| **GTKWave** | v3.3.118 | `D:\mini project\tools\oss-cad-suite\bin\gtkwave.exe` | Digital VCD waveform visualization | **VERIFIED** |
| **Yosys Open SYnthesis Suite** | v0.70+ | `D:\mini project\tools\oss-cad-suite\bin\yosys.exe` | Logic synthesis & technology mapping | **VERIFIED** |
| **Berkeley ABC** | Integrated in Yosys | Embedded inside Yosys binary | Boolean optimization & standard-cell mapping | **VERIFIED** |
| **KLayout** | **v0.30.12 (Native) / v0.30.0 (Ref)** | `C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe` | DEF placement loading & 4.18MB GDSII streamout | **VERIFIED** |
| **OpenROAD Engine / Scripts** | Python Floorplan Engine | `physical_design/generate_physical_layout.py` | 45x35 µm die, 9 rows, 48-cell placement DEF | **VERIFIED** |
| **Magic VLSI** | Not natively installed | Optional via WSL2 | Layout extraction & signoff DRC | *N/A on Win11* |
| **Netgen** | Not natively installed | Optional via WSL2 | Signoff LVS netlist comparison | *N/A on Win11* |
| **SkyWater SKY130 PDK** | `sky130_fd_sc_hd` Rev 1.0 | `synthesis/sky130_pdk/` | Complete 433-cell standard library (.lib, .lef, .gds) | **VERIFIED** |

---

## 4. RUNNING APPLICATION DAEMONS & SERVERS

Three persistent background services are active and serving:

| Service | Protocol / Port | Process Daemon | Status & Health |
| :--- | :--- | :--- | :---: |
| **Vite Preview (CyberCore 3D Web App)** | `http://localhost:3000` | Task 1745 (Node.js 24) | **ACTIVE & SERVING** (60 FPS WebGL) |
| **FastAPI REST API Server** | `http://127.0.0.1:8000` | Task 762 (Python 3.11 / Uvicorn) | **ACTIVE & SERVING** (/api/simulate) |
| **Streamlit Analytics Dashboard** | `http://localhost:8501` | Task 772 (Streamlit Python daemon) | **ACTIVE & SERVING** (PPA comparisons) |

---

## 5. PHYSICAL DESIGN & TIMING REALITY AUDIT

To ensure 100% academic transparency and zero fabricated claims:

1. **Physical Layout Status:**
   - `physical_design/gds/cska_sky130.gds` is a **Standard-Cell Placement Stream** (4,189,882 bytes / 4.18 MB).
   - Generated via KLayout Pya (`export_gds.py`) from `cska_sky130.def`.
   - Core utilization: **51.36%** across 9 alternating standard cell rows (2.72 µm pitch).
   - Cell overlaps: **0**.
   - **Detailed routing, Clock Tree Synthesis (CTS), and signoff DRC/LVS were NOT completed.** It must remain explicitly labeled as placement-only.

2. **Timing Methodology Status:**
   - CSKA hierarchical delay of **2.471 ns** is an **Analytical Hierarchical-Netlist Critical-Path Delay Estimate**.
   - Derived from Liberty cell lookup tables (`sky130_fd_sc_hd__tt_025C_1v80.lib`) and analytical topological delay equations:
     $$T_{CSKA} = (k-1)\tau_{ripple} + (M-2)\tau_{skip} + (k-1)\tau_{ripple} + \tau_{sum}$$
   - **No post-route wire parasitics (SPEF) or signoff STA tool (OpenSTA) were executed.** It is strictly labeled as an analytical netlist estimate.

