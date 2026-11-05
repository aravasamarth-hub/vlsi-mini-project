# SOFTWARE AND HARDWARE INVENTORY

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 06, 2026  
**Auditor:** Multidisciplinary Senior Engineering Team  
**Workspace:** `D:\mini project`  

---

## 1. WORKSTATION HARDWARE INVENTORY

| Hardware Component | Detected Specification | Engineering Role in Project | Verification Status |
| :--- | :--- | :--- | :---: |
| **System Model** | ASUS Gaming Workstation | High thermal dissipation for synthesis runs | **ACTIVE** |
| **Operating System** | Windows 11 Home 64-bit (Build 26220) | Host execution environment | **ACTIVE** |
| **Processor (CPU)** | **Intel(R) Core(TM) 5 210H** | 8 Physical Cores, 12 Threads @ 2.20 GHz (Parallel Verilog testbenches) | **VERIFIED** |
| **System Memory (RAM)**| **16.0 GB DDR5** (16,370,968 KB Total) | In-memory caching of 12.8MB SkyWater Liberty timing models | **VERIFIED** |
| **Dedicated GPU** | **NVIDIA GeForce RTX 4050 Laptop GPU** | 6.0 GB GDDR6 VRAM, Driver: 32.0.16.1742 (Hardware WebGL acceleration) | **ACTIVE** |
| **Integrated GPU** | Intel(R) Graphics | Driver: 32.0.101.7076 | **ACTIVE** |
| **Drive D: (Project)** | **244.9 GB NTFS (148.1 GB Free)** | High-speed PCIe 4.0 NVMe SSD for PDK and layout data | **VERIFIED** |
| **Drive C: (System)** | **230.6 GB NTFS (75.7 GB Free)** | OS, development tools, and package managers | **VERIFIED** |

---

## 2. EDA TOOLS & COMPILERS INVENTORY

| Tool Name | Version Detected | Executable Binary Location | Purpose in Flow | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Icarus Verilog (`iverilog`)** | v14.0 (devel) `s20260301-812` | `tools/oss-cad-suite/bin/iverilog.exe` | IEEE 1364 Verilog RTL simulation compiler | **VERIFIED** |
| **vvp Runtime Engine** | v14.0 (devel) | `tools/oss-cad-suite/bin/vvp.exe` | High-speed execution engine (60,038 vectors) | **VERIFIED** |
| **GTKWave** | v3.3.118 | `tools/oss-cad-suite/bin/gtkwave.exe` | Digital VCD waveform visualization | **VERIFIED** |
| **Yosys Open SYnthesis Suite** | v0.70+329 | `tools/oss-cad-suite/bin/yosys.exe` | Logic synthesis & technology mapping | **VERIFIED** |
| **Berkeley ABC Mapper** | Integrated in Yosys | Embedded inside Yosys | Standard cell technology binding | **VERIFIED** |
| **KLayout** | v0.30.12 (Native) / v0.30.0 (Ref) | `AppData/Roaming/KLayout/klayout_app.exe` | GDSII viewer & Python Pya binary streamout | **VERIFIED** |
| **OpenROAD Engine / Scripts** | Python Floorplan Engine | `physical_design/generate_physical_layout.py` | 45x35 µm die, 9 rows, DEF placement | **VERIFIED** |
| **SkyWater SKY130 PDK** | `sky130_fd_sc_hd` Rev 1.0 | `synthesis/sky130_pdk/` | Complete 433-cell standard library | **VERIFIED** |

---

## 3. PROGRAMMING ENVIRONMENTS & RUNTIMES

| Software / Runtime | Version | Installation Location | Primary Role | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Python** | 3.11.15 / 3.14.10 64-bit | `D:\mini project\.venv\Scripts\python.exe` | Backend, analysis, and layout scripts | **ACTIVE** |
| **Node.js** | v24.17.0 | `C:\Program Files\nodejs\node.exe` | Web frontend build & runtime environment | **ACTIVE** |
| **npm** | 11.13.0 | `C:\Program Files\nodejs\npm.cmd` | JavaScript package manager | **ACTIVE** |
| **Git** | 2.54.0.windows.1 | `C:\Program Files\Git\cmd\git.exe` | Version control & repository tracking | **ACTIVE** |
| **FastAPI** | 0.110.1 | Python virtual environment | REST API simulation engine (Port 8000) | **ACTIVE** |
| **Uvicorn** | 0.25.0 | Python virtual environment | High-performance ASGI async server | **ACTIVE** |
| **Streamlit** | 1.40.0+ | Python virtual environment | Secondary analytics dashboard (Port 8501) | **ACTIVE** |
| **React** | 18.3.1 | `frontend/node_modules/react` | Declarative UI framework | **ACTIVE** |
| **Three.js** | 0.170.0 | `frontend/node_modules/three` | 3D WebGL semiconductor rendering | **ACTIVE** |
| **Vite** | 6.0.1 | `frontend/node_modules/vite` | Fast frontend bundler (Serving on Port 3000)| **ACTIVE** |
| **Tailwind CSS** | 4.0.0 | `frontend/node_modules/tailwindcss`| Obsidian glassmorphic styling | **ACTIVE** |
