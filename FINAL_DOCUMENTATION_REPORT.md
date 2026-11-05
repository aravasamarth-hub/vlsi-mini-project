# FINAL DOCUMENTATION & ACADEMIC DEFENSE REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Academic Level:** Digital VLSI Design & ASIC Physical Implementation  
**Submission Date:** November 05, 2026  
**Workspace:** `D:\mini project`  

---

## 1. PROJECT EXECUTIVE SUMMARY

This project presents a comprehensive, industrially grounded design, verification, logic synthesis, and physical layout placement flow for a **16-bit Carry Skip Adder (CSKA)** targeting the open-source **Google/SkyWater 130nm High-Density (`sky130_fd_sc_hd`) CMOS Process Design Kit (PDK)**.

The project demonstrates:
1. **Modular RTL Design:** 11 synthesizable Verilog modules modeling primitives, 4-bit carry-skip blocks, top-level adder, and 4 comparative adder benchmarks (RCA, CLA, CSLA, Brent-Kung).
2. **Empirical Verification:** 60,038 test vectors executed across 6 testbenches using Icarus Verilog v14.0 against a 17-bit self-checking golden reference model, achieving 100% pass rate with zero mismatches.
3. **Logic Synthesis:** Yosys 0.70 with Berkeley ABC mapping RTL to SkyWater 130nm standard cells under both flattened (48 cells, 440.42 µm²) and hierarchical (56 cells, 760.73 µm²) constraints.
4. **Physical ASIC Placement:** Python and KLayout Pya scripts constructing a 45.0 µm x 35.0 µm die with 9 alternating rows, generating `cska_sky130.def` and streaming a 4.18 MB binary GDSII (`cska_sky130.gds`).
5. **Interactive 3D Platform:** CyberCore 3D engineering lab built with React 18, Three.js, WebGL 2.0, and FastAPI, providing interactive layer exploration, live Verilog simulation, and an integrated seminar defense mode.

---

## 2. KEY TECHNICAL SPECIFICATIONS & METRICS

| Category | Parameter | Verified Project Value | Verification Source |
| :--- | :--- | :--- | :--- |
| **Architecture** | Adder Type | 16-Bit Carry Skip Adder (4 x 4-bit uniform blocks) | `rtl/carry_skip_adder.v` |
| **Technology Node** | PDK Standard Cells | SkyWater 130nm High-Density (`sky130_fd_sc_hd`) | `synthesis/sky130_pdk/` |
| **Verification** | Executed Test Vectors | **60,038 vectors (100% Pass, 0 Mismatches)** | `verification/verification_results/summary.json` |
| **Synthesis (Flat)** | Cell Count / Area | **48 cells / 440.42 µm²** | `synthesis/netlists/cska_sky130_netlist.v` |
| **Synthesis (Hier)** | Cell Count / Area | **56 cells / 760.73 µm²** | `synthesis/netlists/cska_hier_sky130_netlist.v` |
| **Timing Estimate** | Critical Path Delay | **2.471 ns** (Analytical hierarchical estimate) | Liberty arc lookup & delay modeling |
| **Power Consumption** | Dynamic Power @ 100MHz | **0.142 mW** (Hierarchical) / 0.122 mW (Flat) | Switching activity calculation ($\alpha=0.5$) |
| **Physical Die** | Die Dimensions | **45.00 µm x 35.00 µm (Area: 1,575.00 µm²)** | `physical_design/placement/cska_sky130.def` |
| **Physical Core** | Core Cavity | **35.00 µm x 24.50 µm (Area: 857.50 µm²)** | `physical_design/placement/cska_sky130.def` |
| **Core Utilization** | Placement Density | **51.36%** (48 placed standard cells in 9 rows) | `physical_design/placement/cska_sky130.def` |
| **GDSII Streamout** | Binary Layout Size | **4,189,882 bytes (4.18 MB)** | `physical_design/gds/cska_sky130.gds` |

---

## 3. COMPARATIVE ADDER BENCHMARK MATRIX

Targeting SkyWater 130nm HD Nominal Corner ($TT, 25^\circ\text{C}, 1.80\text{V}$):

```
┌─────────────────────┬──────────────┬──────────────┬──────────────────┬──────────────┬────────────────┐
│ Architecture        │ Cells        │ Area (µm²)   │ Delay (ns)       │ Power (mW)   │ ADP (µm²·ns)   │
├─────────────────────┼──────────────┼──────────────┼──────────────────┼──────────────┼────────────────┤
│ RCA (Hierarchical)  │ 32           │ 497.02       │ 3.957 ns         │ 0.117 mW     │ 1,966.7        │
│ CSKA (Hierarchical) │ 56           │ 760.73       │ 2.471 ns (1.60x) │ 0.142 mW     │ 1,879.6        │
│ CSKA (Flattened)    │ 48           │ 440.42       │ 3.957 ns         │ 0.122 mW     │ 1,743.4        │
│ CLA (16-bit)        │ 61           │ 638.30       │ 1.954 ns (2.02x) │ 0.185 mW     │ 1,247.2        │
│ CSLA (16-bit)       │ 87           │ 863.66       │ 1.842 ns (2.15x) │ 0.245 mW     │ 1,590.9        │
│ Brent-Kung (16-bit) │ 64           │ 680.12       │ 1.680 ns (2.36x) │ 0.198 mW     │ 1,142.6        │
└─────────────────────┴──────────────┴──────────────┴──────────────────┴──────────────┴────────────────┘
```

---

## 4. MASTER DOCUMENTATION FILE DIRECTORY

All documentation reports adhere strictly to markdownlint standards and provide comprehensive academic coverage:

1. `PROJECT_INVENTORY.md`: Complete audit of all workspace assets, file sizes, and directory structures.
2. `SOFTWARE_AND_EXTENSION_INVENTORY.md`: Hardware specifications (Core 5 210H, RTX 4050, 16GB RAM), EDA tool versions (Icarus 14.0, GTKWave 3.3.118, Yosys 0.70, KLayout 0.30.12), Python libraries, and IDE extensions.
3. `PROGRAMS_AND_SCRIPTS_CATALOG.md`: Detailed catalog of 11 RTL files, 7 testbenches, 3 synthesis scripts, 4 physical design scripts, and 4 analysis scripts with runnable CLI commands.
4. `GDSII_LAYOUT_EXPLANATION.md`: Physical design breakdown, SkyWater 130nm mask layer assignments, DEF placement details, and KLayout screenshot analysis.
5. `PROJECT_WORKFLOW.md`: Complete 7-stage engineering lifecycle documentation.
6. `ACADEMIC_RESULTS_AND_LIMITATIONS.md`: Deep dive on RCA vs CSKA synthesis, 48 vs 56 cell counts, Liberty timing estimates, and physical placement limits.
7. `FINAL_DOCUMENTATION_REPORT.md`: This comprehensive project report.
8. `VISUAL_QA_REPORT.md`: Quality assurance audit of 3D rendering, WebGL performance, and user interface responsiveness.

