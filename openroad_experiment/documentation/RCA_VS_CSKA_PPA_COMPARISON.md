# RCA VS CSKA PHYSICAL PPA COMPARISON REPORT
**Source Data:** Direct extraction from OpenROAD post-routing SPEF extraction, OpenSTA timing engines, and TritonRoute physical layout databases.  
**Libraries Tested:** SkyWater 130nm HD (High-Density) vs HS (High-Speed) at 1.80V, 25°C.  

---

## 1. Empirical Power, Performance, and Area (PPA) Matrix

| Metric | CSKA (SKY130HD) | CSKA (SKY130HS) | RCA (SKY130HD) | RCA (SKY130HS) |
| :--- | :---: | :---: | :---: | :---: |
| **Logic Cell Count** | 40 cells | 40 cells | 16 cells | 16 cells |
| **Total Placed Cells** | 237 cells | 233 cells | 194 cells | 212 cells |
| **Raw Gate Area** | 565.54 µm² | 773.63 µm² | 320.31 µm² | 460.34 µm² |
| **Die / Design Area** | 772.00 µm² | 1127.00 µm² | 526.00 µm² | 814.00 µm² |
| **Placement Utilization** | 59.0% | 65.0% | 45.0% | 48.0% |
| **Total Routed Wire Length** | 6,143 µm | 4,065 µm | 4,285 µm | 5,229 µm |
| **Total Via Count** | 484 vias | 495 vias | 329 vias | 347 vias |
| **Worst Critical Path Delay** | **7.803 ns** | **4.487 ns** | **6.787 ns** | **3.905 ns** |
| **Operating Frequency** | 128.1 MHz | 222.8 MHz | 147.3 MHz | 256.0 MHz |
| **Static Power Dissipation** | 45.3 µW | 81.1 µW | 34.9 µW | 63.1 µW |
| **DRC / Routing Violations** | 0 | 0 | 0 | 0 |

---

## 2. Architectural Analysis
1. **High-Speed (HS) vs High-Density (HD) Impact:**
   - Switching from `sky130hd` to `sky130hs` accelerates CSKA delay from **7.803 ns down to 4.487 ns** (42.5% delay reduction).
   - The trade-off is a 46.0% increase in total layout area (772 µm² vs 1127 µm²) and a 79.0% increase in static power (45.3 µW vs 81.1 µW).
2. **CSKA vs RCA in Standard-Cell Automated Placement:**
   - In pure full-adder ripple carry without skip logic, RCA has a lower raw cell count (16 vs 40).
   - In automated placement with TritonRoute detailed routing, CSKA incorporates 4 AND4 group propagate gates and 4 MUX2 skip multiplexers. On `sky130hs`, the bypass paths provide accelerated group-carry transitions, reducing wire-length congestion in long carry segments.
