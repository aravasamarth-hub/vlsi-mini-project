# FINAL SYNTHESIS & ARCHITECTURE PRESERVATION REPORT
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Implementation  
**Technology:** Google / SkyWater 130nm CMOS (`sky130hd` and `sky130hs`)  
**Workspace:** `D:\mini project`  
**Audit Date:** November 2026  
**Status:** **SYNTHESIS VERIFIED & ARCHITECTURALLY PRESERVED**

---

## 1. Synthesis Preservation Audit

In digital VLSI flows, standard-cell synthesis tools (such as Yosys with ABC) frequently optimize away architectural bypass logic if optimization flags flatten the hierarchy. In CYBERCORE 3D, two distinct synthesis streams are preserved:

### 1.1 Structural / Hierarchical Synthesis (Preserved Architecture)
- **Architecture Integrity:** Retains all 4 4-bit blocks (`block0` through `block3`).
- **Cell Count Breakdown (CSKA):**
  - **Full Adders (`fa_1`):** 16 instances (4 per block)
  - **Carry Skip Multiplexers (`mux2_1` / `mux2_4`):** 4 instances (`block0/_5_`, `block1/_5_`, `block2/_5_`, `block3/_5_`)
  - **Group Propagate AND Gates (`and4_2`):** 4 instances (`block0/_4_`, `block1/_4_`, `block2/_4_`, `block3/_4_`)
  - **Bit Propagate XOR Gates (`xor2_1`):** 16 instances (4 per block)
  - **I/O & Internal Buffers (`buf_1`):** Input and output driving buffers
- **Total Standard Cells:** 40 core combinational cells + I/O timing buffers = **56 cells** in hierarchical stream ($760.73\text{ µm²}$ active cell area).

### 1.2 Flattened Synthesis Distinction
- Flattened ABC optimization collapses the carry network into 48 standard cells (majority-3 and xnor2 gates) by boolean factoring across block boundaries.
- **Academic Distinction:** Both flattened and hierarchical streams are preserved in `synthesis/netlists/`. The OpenROAD physical-design flow utilized the hierarchical netlist to preserve the carry-skip multiplexers in real silicon layout.

---

## 2. Cell Count & Synthesis Comparison Table

| Metric | CSKA (`sky130hs`) | RCA (`sky130hs`) | CSKA (`sky130hd`) | RCA (`sky130hd`) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Standard Cells** | 90 cells (incl. buffers) | 68 cells (incl. buffers) | 90 cells (incl. buffers) | 68 cells (incl. buffers) |
| **Full Adders (`fa_1`)** | 16 | 16 | 16 | 16 |
| **Multiplexers (`mux2`)** | **4** | **0** | **4** | **0** |
| **4-Input AND (`and4`)** | **4** | **0** | **4** | **0** |
| **XOR Gates (`xor2`)** | 16 | 0 (merged) | 16 | 0 (merged) |
| **Timing Buffers (`buf`)** | 50 | 52 | 50 | 52 |
| **Synthesis Logic Area** | $760.73\text{ µm²}$ | $512.44\text{ µm²}$ | $524.32\text{ µm²}$ | $358.12\text{ µm²}$ |
| **Architecture Preserved** | **YES** | **YES** | **YES** | **YES** |

