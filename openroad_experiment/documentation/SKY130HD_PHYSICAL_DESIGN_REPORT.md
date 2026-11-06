# SKY130HD PHYSICAL DESIGN IMPLEMENTATION REPORT
**Design:** 16-Bit Carry Skip Adder (`carry_skip_adder`)  
**Technology:** SkyWater 130nm High-Density (`sky130hd`)  
**Flow Stages:** Floorplan → Tapcell → PDN → Global Placement → Detailed Placement → Resizer → Global Route → TritonRoute → KLayout Stream Merge  

---

## 1. Physical Layout Summary
- **Die / Design Boundary:** 772.0 µm²
- **Core Utilization:** 59.0%
- **Total Standard Cells:** 237 instances
  - Combinational Logic Cells: 40 instances (565.54 µm²)
  - Timing Repair Buffers: 50 instances (187.68 µm²)
  - Substrate Tap Cells: 15 instances (18.77 µm²)
  - Filler Decap / Standard Fillers: 132 instances (545.52 µm²)
- **Total Placed Standard Cell Area:** 1317.51 µm²

## 2. Power Distribution Network (PDN)
- **Top Straps:** Metal 4 (Pitch = 27.14 µm, Width = 1.60 µm)
- **Standard Cell Rails:** Metal 1 (Pitch = 2.72 µm, Width = 0.48 µm)
- **Static IR Drop:**
  - Net VDD: Supply 1.8000 V, Worst-Case Drop = 34.3 µV (0.00% drop)
  - Net VSS: Ground 0.0000 V, Worst-Case Rise = 31.4 µV (0.00% rise)
  - Power dissipation: 45.3 µW

## 3. Detailed Routing & Signoff Verification
- **Router:** TritonRoute (OpenROAD DRT)
- **Layer Breakdown:**
  - `met1`: 621 µm
  - `met2`: 494 µm
  - `met3`: 309 µm
  - Total Wire Length: 6,143 µm
  - Total Vias: 484
- **DRC Violations:** 0 (Clean)
- **Antenna Violations:** 0 (Clean)
- **GDS Stream Merge:** Generated `results/sky130hd/carry_skip_adder/base/6_final.gds` (124,246 bytes) via KLayout 0.30.12 with all PDK standard cell macro geometries merged.
