# SKY130HS PHYSICAL DESIGN IMPLEMENTATION REPORT
**Design:** 16-Bit Carry Skip Adder (`carry_skip_adder`)  
**Technology:** SkyWater 130nm High-Speed (`sky130hs`)  
**Artifact Identification:** Matches the exact physical layout inspected via KLayout in user laboratory captures (`6_final.gds [carry_skip_adder]`).  

---

## 1. Physical Layout Summary
- **Die / Design Boundary:** 1127.0 µm²
- **Core Utilization:** 65.0%
- **Total Standard Cells:** 233 instances
  - Combinational Logic Cells: 40 instances (773.63 µm²)
  - Timing Repair Buffers: 50 instances (319.68 µm²)
  - Substrate Tap Cells: 21 instances (33.57 µm²)
  - High-Speed Fillers: 122 instances (618.58 µm²)
- **Total Placed Standard Cell Area:** 1745.45 µm²

## 2. Power Distribution Network (PDN)
- **Top Straps:** Metal 4 / Metal 1 grid
- **Static IR Drop:**
  - Net VDD: Supply 1.8000 V, Worst-Case IR drop = 38.6 µV
  - Net VSS: Worst-case ground bounce = 35.1 µV
  - Total Power Dissipation: 81.1 µW

## 3. Detailed Routing & Signoff Verification
- **Router:** TritonRoute (OpenROAD DRT)
- **Total Wire Length:** 4,065 µm
- **Total Vias:** 495
- **DRC Violations:** 0 (Clean)
- **Antenna Violations:** 0 (Clean)
- **GDS Stream Merge:** Generated `results/sky130hs/carry_skip_adder/base/6_final.gds` (128,514 bytes) via KLayout 0.30.12. Standard cell library prefix `sky130_fd_sc_hs` confirmed on all bit-slice macros.
