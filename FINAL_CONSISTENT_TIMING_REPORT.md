# Final Consistent Timing & Critical-Path Verification Report

**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace:** `D:\mini project`  
**Technology:** Google / SkyWater SKY130 High-Density CMOS (`sky130_fd_sc_hd`)  
**Corner:** Nominal TT, 25°C, 1.80V (`sky130_fd_sc_hd__tt_025C_1v80.lib`)  
**Date:** November 6, 2026  
**Status:** Validated & Unified

---

## 1. Unified Project Timing Summary

This document serves as the single source of truth for all timing and delay claims across the CYBERCORE 3D project.

### Unified Timing Matrix:

| Adder Configuration | Netlist Type | Cells | Area (µm²) | Critical Path Topology | Analytical Delay | Speedup vs Baseline |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **Ripple Carry Adder (Hier.)** | Hierarchical | 48 | 540.52 | $16 \cdot t_{maj3} + t_{xor3}$ | **4.240 ns** | Reference |
| **Ripple Carry Adder (Flat.)** | Flattened | 48 | 440.42 | $15 \cdot t_{maj3} + t_{xnor2}$ | **3.957 ns** | +6.67% (via ABC) |
| **Carry Skip Adder (Flat.)** | Flattened | 48 | 440.42 | $15 \cdot t_{maj3} + t_{xnor2}$ (RCA equiv.) | **3.957 ns** | +6.67% |
| **Carry Skip Adder (Hier.)** | **Hierarchical** | **56** | **760.73** | $(7 \cdot t_{maj3}) + (2 \cdot t_{mux2}) + t_{xor3}$ | **2.471 ns** | **+41.72% (vs Hier. RCA)**<br>**+37.55% (vs Flat. RCA)** |

---

## 2. Gate Delay Characterization & Liberty Basis

From `sky130_fd_sc_hd__tt_025C_1v80.lib` (typical slew = $0.053\text{ ns}$, fanout load = $3.4\text{ fF}$):
- Full-adder carry delay ($t_{maj3}$): **0.245 ns**
- Full-adder sum delay ($t_{xor3}$): **0.320 ns**
- Flattened XNOR sum delay ($t_{xnor2}$): **0.282 ns**
- Carry-skip bypass MUX delay ($t_{mux2}$): **0.218 ns**
- Group-propagate AND4 delay ($t_{and4}$): **0.185 ns**

---

## 3. Step-by-Step Critical Path Derivations

### A. Hierarchical CSKA (2.471 ns):
```
Worst-case Input Vector Scenario: A = 16'h0001, B = 16'hFFFF, Cin = 0
1. Block 0 (Bits [3:0]):
   - A[0] & B[0] generate carry.
   - Carry ripples through FA[1], FA[2], FA[3]: 3 stages of maj3_1.
   - Delay = 3 * 0.245 ns = 0.735 ns.
2. Block 1 (Bits [7:4]):
   - All bits propagate (P_group[1] = 1).
   - Carry skips through 2:1 multiplexer: 1 stage of mux2_1.
   - Delay = 1 * 0.218 ns = 0.218 ns.
3. Block 2 (Bits [11:8]):
   - All bits propagate (P_group[2] = 1).
   - Carry skips through 2:1 multiplexer: 1 stage of mux2_1.
   - Delay = 1 * 0.218 ns = 0.218 ns.
4. Block 3 (Bits [15:12]):
   - Carry enters Block 3 and ripples through all 4 full adders.
   - Carry resolves SUM[15] through final XOR3 gate.
   - Delay = (4 * 0.245 ns) + 0.320 ns = 1.300 ns.

Total Critical-Path Delay:
T_CSKA = 0.735 ns + 0.218 ns + 0.218 ns + 1.300 ns = 2.471 ns.
```

### B. Hierarchical RCA (4.240 ns):
```
1. Carry ripples sequentially across all 16 full-adder stages:
   Delay = 16 * 0.245 ns = 3.920 ns.
2. Final sum resolution at Bit 15:
   Delay = 1 * 0.320 ns = 0.320 ns.

Total Critical-Path Delay:
T_RCA_hier = 3.920 ns + 0.320 ns = 4.240 ns.
```

### C. Flattened RCA (3.957 ns):
```
1. 15 stages of Majority-3 carry propagation:
   Delay = 15 * 0.245 ns = 3.675 ns.
2. Final sum resolution through XNOR-2 gate:
   Delay = 1 * 0.282 ns = 0.282 ns.

Total Critical-Path Delay:
T_RCA_flat = 3.675 ns + 0.282 ns = 3.957 ns.
```

---

## 4. Scientific Honesty & Analytical Classification

> [!IMPORTANT]
> **Analytical Netlist-Level Timing Label:**
> All figures in this report are **Analytical Netlist-Level Critical-Path Estimates** derived from Liberty characterization tables and gate-level topological tracing.
> Because detailed routing (M1–M5) and parasitic extraction (SPEF) were not executed in this academic placement-level flow, these numbers represent topological lower bounds under nominal fanout loads, not post-route back-annotated STA measurements.
> 
> In college vivas, faculty interviews, and project presentations, always state:
> *"The 2.471 ns CSKA and 4.240 ns RCA timings are analytical estimates calculated from the SkyWater 130nm Liberty NLDM tables under typical operating conditions ($TT, 25^\circ\text{C}, 1.80\text{V}$)."*

