# FINAL POWER ANALYSIS REPORT
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Implementation  
**Technology:** Google / SkyWater 130nm CMOS (`sky130hd` and `sky130hs`)  
**Tool:** OpenSTA (OpenROAD v2.0) with parasitic RC back-annotation  
**Workspace:** `D:\mini project`  
**Audit Date:** November 2026  
**Status:** **TOOL-EXTRACTED & COMPARATIVE POWER VALIDATED**

---

## 1. Power Analysis Methodology & Conditions
- **Operating Corner:** $TT, 25^\circ\text{C}, 1.80\text{V}$
- **Activity Assumption:** Vectorless static probability analysis with default switching activity factor ($\alpha = 0.5$ at $100\text{ MHz}$).
- **Parasitics:** Extracted from post-route 3D coupled SPEF databases (`6_final.spef`).
- **Terminology Standard:** Classified as **tool-generated vectorless power estimates**, distinguishing them from dynamic vector-profiled silicon power.

---

## 2. Power Breakdown Table

| Design Configuration | Internal Power (µW) | Switching Power (µW) | Leakage Power (nW) | Total Power (µW) | Power Overhead vs RCA |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **CSKA (`sky130hs`)** | 48.7 µW | 32.4 µW | 13.6 nW | **81.1 µW** | +28.5% |
| **RCA (`sky130hs`)** | 38.2 µW | 24.9 µW | 10.4 nW | **63.1 µW** | Baseline |
| **CSKA (`sky130hd`)** | 27.8 µW | 17.5 µW | 8.2 nW | **45.3 µW** | +29.8% |
| **RCA (`sky130hd`)** | 21.6 µW | 13.3 µW | 6.1 nW | **34.9 µW** | Baseline |

---

## 3. Power Trade-off Analysis
- **High-Speed vs High-Density Library:**
  - SKY130HS consumes **79.0% more total power** than SKY130HD ($81.1\text{ µW}$ vs $45.3\text{ µW}$) due to higher drive transistor widths and larger gate capacitance.
  - In exchange, SKY130HS delivers a **41.2% delay reduction** over SKY130HD ($2.62\text{ ns}$ vs $4.45\text{ ns}$).
- **CSKA vs RCA Power Trade-off:**
  - CSKA consumes **~28%–30% more power** than RCA due to the 4 carry-skip multiplexers, 4 AND4 group-propagate gates, and 16 XOR propagate gates.
  - This is the classic VLSI speed-power trade-off: trading a 28% power increase for a 31%–34% critical delay speedup.

