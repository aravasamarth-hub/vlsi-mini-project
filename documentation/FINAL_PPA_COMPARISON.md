# FINAL POWER-PERFORMANCE-AREA (PPA) BENCHMARK REPORT
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Implementation  
**Technology:** Google / SkyWater 130nm CMOS (`sky130hd` vs `sky130hs`)  
**Flow:** OpenROAD RTL-to-GDS Physical Design Flow  
**Workspace:** `D:\mini project`  
**Audit Date:** November 2026  
**Status:** **EMPIRICALLY VALIDATED PPA MATRIX WITH UNIT CALIBRATION**

---

## 1. Master PPA Benchmark Matrix

All metrics below are extracted from completed post-route databases (`6_final.odb`, `6_final.spef`, `6_final.gds`, `6_report.log`) with post-route extracted RC parasitics from SPEF under identical operating conditions ($TT, 25^\circ\text{C}, 1.80\text{V}$, $slew = 40\text{ ps}$, $C_{load} = 17.7\text{ fF}$):

| Architectural Metric | CSKA (`sky130hs`) | RCA (`sky130hs`) | CSKA (`sky130hd`) | RCA (`sky130hd`) | Unit / Basis |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Critical Sensitized Delay (`SUM[15]`)** | **2.6154** | **3.8123** | **4.4489** | **6.7188** | nanoseconds (ns) |
| **Critical Sensitized Delay (`Cout`)** | **2.6631** | **3.7199** | **4.5437** | **6.5581** | nanoseconds (ns) |
| **Unconstrained Topological Delay** | 4.3795 | 3.8123 | 7.6665 | 6.7188 | nanoseconds (ns) |
| **Sensitized Speedup over RCA (`SUM[15]`)** | **+31.39%** | Baseline | **+33.78%** | Baseline | Verified on matching endpoint |
| **Sensitized Speedup over RCA (`Cout`)** | **+28.41%** | Baseline | **+30.72%** | Baseline | Verified on matching endpoint |
| **Total Die Area** | **1,127.0** | **814.0** | **772.0** | **526.0** | micrometers squared (µm²) |
| **Area Overhead vs RCA** | +38.4% | Baseline | +46.8% | Baseline | Additional MUX & AND logic |
| **Total Standard Cells** | 90 | 68 | 90 | 68 | cell instances |
| **Total Power Consumption** | **81.1** | **63.1** | **45.3** | **34.9** | microwatts (µW, vectorless) |
| **Power Overhead vs RCA** | +28.5% | Baseline | +29.8% | Baseline | Dynamic + internal power |
| **Estimated Energy per Interval ($P \times T$)** | **0.2121** (212.1) | **0.2406** (240.6) | **0.2015** (201.5) | **0.2345** (234.5) | $\text{pJ}$ ($\text{fJ}$) |
| **Energy Comparison vs RCA** | **-11.85%** (Lower) | Baseline | **-14.07%** (Lower) | Baseline | Lower is better |
| **Energy-Delay Product ($P \times T^2$)** | **0.5547** (554.7) | **0.9171** (917.1) | **0.8966** (896.6) | **1.5755** (1575.5) | **`pJ·ns`** (`fJ·ns`) |
| **EDP Comparison vs RCA** | **-39.52%** (Superior) | Baseline | **-43.09%** (Superior) | Baseline | Lower is superior |
| **EDP in SI Units** | **$5.5475 \times 10^{-22}$** | $9.1707 \times 10^{-22}$ | **$8.9661 \times 10^{-22}$** | $1.5755 \times 10^{-21}$ | $\text{J}\cdot\text{s}$ |
| **Detailed Route DRC Violations** | **0** | **0** | **0** | **0** | TritonRoute sign-off |
| **Antenna Violations** | **0** | **0** | **0** | **0** | OpenROAD antenna engine |

---

## 2. Engineering Trade-off & Synthesis Conclusions

1. **Energy-Delay Product (EDP) Advantage:**  
   Because CSKA reduces critical propagation delay by **~31%–34%**, its **Energy-Delay Product ($P \times T^2$) is 39.5% to 43.1% superior to RCA** ($0.555\text{ pJ}\cdot\text{ns}$ vs $0.917\text{ pJ}\cdot\text{ns}$ in HS). Additionally, the estimated energy consumed during one critical-path interval ($P \times T$) is **11.8% to 14.1% lower** than RCA.
2. **Library Trade-off (HS vs HD):**  
   - SKY130HS delivers **$1.70\times$ higher operational performance** over SKY130HD at the cost of $1.46\times$ larger die area and $1.79\times$ higher power.
   - For high-frequency compute pipelines, SKY130HS CSKA provides the optimal throughput. For area-constrained IoT applications, SKY130HD CSKA achieves energy-efficient arithmetic with minimal silicon footprint ($772\text{ µm²}$).
