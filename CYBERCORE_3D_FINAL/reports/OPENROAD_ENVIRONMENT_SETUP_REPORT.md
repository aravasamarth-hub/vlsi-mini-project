# OPENROAD ENVIRONMENT SETUP REPORT
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Design  
**Target:** OpenROAD Flow Scripts (ORFS) on SkyWater 130nm PDK  
**Host Architecture:** Windows 11 Home Insider Preview (Build 10.0.26220)  
**Processor:** Intel Core 5 210H (8 Cores, 12 Threads)  
**Physical Memory:** 16 GB DDR5 (15.6 GB Available)  
**GPU:** NVIDIA GeForce RTX 4050 Laptop GPU (6 GB VRAM)  
**Virtualization Subsystem:** WSL2 (Ubuntu 24.04 LTS, Linux Kernel 6.18.33.2-microsoft-standard-WSL2)  
**Container Engine:** Docker CE 28.5 (Native daemon inside Ubuntu with systemd)  
**ORFS Distribution:** Official OpenROAD-flow-scripts container `openroad/orfs:latest` (Yosys 0.68+post, OpenROAD 2.0+git, KLayout 0.30.12)  

---

## 1. Executive Summary
A complete, reproducible, signoff-grade open-source RTL-to-GDS physical design environment was established for the CYBERCORE 3D project. All operations strictly preserve the frozen academic master repository (`D:\mini project`, commit `6366466`). Physical design workflows operate within the experimental branch `feature/openroad-physical-design` and native Linux filesystem space `~/cybercore3d/` inside WSL2 to eliminate Windows filesystem latency and permission boundaries.

## 2. Resource Governance (.wslconfig)
To prevent host starvation while maximizing multi-threaded EDA compilation throughput:
- **Processors:** 4 vCPUs allocated to WSL2.
- **Memory:** 10 GB dedicated RAM.
- **Swap Space:** 8 GB virtual memory buffer.
- **Hyper-V Settings:** Dynamic memory reclaim and page trim enabled.

## 3. Toolchain Inventory & Verification
1. **Yosys (v0.68+post):** Validated synthesis with ABC9 logic optimization, Liberty gate mapping, and hierarchical preservation.
2. **OpenROAD (v2.0):** Validated full backend pipeline:
   - Automated floorplanning (`initialize_floorplan`)
   - Power Distribution Network synthesis (`pdngen`)
   - Global placement (`replace` via Nesterov algorithm)
   - Detailed placement (`dpl` with legality checks)
   - Clock Tree Synthesis (`tritonCTS`, bypassed cleanly for pure combinational adders)
   - Global routing (`fastroute`)
   - Detailed routing (`tritonRoute` with design rule enforcement)
   - Parasitic extraction (`OpenRCX` producing IEEE 1481 SPEF)
   - Static Timing Analysis (`OpenSTA` with full slew/load propagation)
3. **KLayout (v0.30.12 & v0.28.16):** Validated GDSII stream generation via `def2stream.py` and native interactive GUI inspection under WSLg.
4. **Icarus Verilog (v12.0):** Native RTL logic verification baseline passing 10,014 functional vectors (100% pass rate).

## 4. Flow Validation on Standard Reference Design
Prior to running custom adders, the full ORFS flow was validated against reference design `sky130hd/gcd`:
- Execution Runtime: 34 seconds
- Output Artifacts: `6_final.gds` (795 KB), `6_final.def` (366 KB), `6_final.spef` (313 KB)
- DRC / Routing Violations: 0
