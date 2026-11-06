# FINAL PHYSICAL DESIGN REPORT (OPENROAD FLOW)
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Implementation  
**Technology:** Google / SkyWater 130nm CMOS (`sky130hd` and `sky130hs`)  
**Flow Platform:** OpenROAD-flow-scripts (ORFS) v2.0 Docker  
**Workspace:** `D:\mini project\openroad_experiment`  
**Audit Date:** November 2026  
**Status:** **PHYSICAL DESIGN 100% COMPLETE (GDSII STREAMED & VERIFIED)**

---

## 1. Physical Design Implementation Stages

For each of the four configurations (CSKA HD, CSKA HS, RCA HD, RCA HS), the physical design was completed through all ten stages of the OpenROAD flow:

1. **Synthesis (Yosys + ABC):** Mapped RTL to SkyWater 130nm standard cells preserving structural hierarchy.
2. **Floorplanning:** Defined core boundary, halo, and pin placement along top/bottom boundaries.
3. **Power Planning (PDN):**
   - Synthesized power rings and vertical power straps on Metal 4 / Metal 5 (`VPWR` at $1.80\text{V}$, `VGND` at $0.0\text{V}$).
   - Followed standard cell row rail abutment on Metal 1.
4. **Global Placement:** Replaced cells across core area optimizing wirelength using RePlace engine.
5. **Detailed Placement:** Aligned cells to manufacturing grid site rows with legal non-overlapping spacing using OpenDP.
6. **Clock Tree Handling:** Combinational macro mode. Clock tree synthesis (CTS) correctly skipped for pure combinational adder.
7. **Global Routing:** FastRoute estimated congestion and generated global routing guides across Metal 1 to Metal 5.
8. **Detailed Routing:** TritonRoute routed all signal nets on manufacturing grid with 0 DRC violations.
9. **Parasitic Extraction (OpenRCX):** Extracted 3D distributed coupled capacitance and resistance to `6_final.spef`.
10. **Final GDSII Stream-out (KLayout Stream Engine):** Merged standard-cell layout abstracts into complete manufacturing stream `6_final.gds`.

---

## 2. Physical Layout Metrics Comparison

| Metric | CSKA (`sky130hs`) | RCA (`sky130hs`) | CSKA (`sky130hd`) | RCA (`sky130hd`) |
| :--- | :---: | :---: | :---: | :---: |
| **Die Boundary** | $33.58\text{ µm} \times 33.56\text{ µm}$ | $28.53\text{ µm} \times 28.53\text{ µm}$ | $27.78\text{ µm} \times 27.79\text{ µm}$ | $22.94\text{ µm} \times 22.93\text{ µm}$ |
| **Total Die Area** | **1,127.0 µm²** | **814.0 µm²** | **772.0 µm²** | **526.0 µm²** |
| **Cell Rows** | 8 standard cell rows | 6 standard cell rows | 10 standard cell rows | 8 standard cell rows |
| **Metal Layers Used** | Metal 1 – Metal 5 | Metal 1 – Metal 5 | Metal 1 – Metal 5 | Metal 1 – Metal 5 |
| **Final GDS Size** | 128,514 bytes | 92,768 bytes | 124,246 bytes | 88,170 bytes |
| **Final DEF Size** | 86,403 bytes | 72,309 bytes | 83,202 bytes | 68,227 bytes |
| **Detailed Route DRC** | **0 violations** | **0 violations** | **0 violations** | **0 violations** |
| **Antenna Violations** | **0 violations** | **0 violations** | **0 violations** | **0 violations** |

