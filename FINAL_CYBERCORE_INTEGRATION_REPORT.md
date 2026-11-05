# FINAL CYBERCORE 3D INTEGRATION & TECHNICAL CONSISTENCY REPORT

**Project Identity:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Platform:** CYBERCORE 3D — VLSI Engineering Lab  
**Workspace:** `D:\mini project`  
**Technology Node:** Google / SkyWater SKY130 130nm High-Density CMOS (`sky130_fd_sc_hd`)  
**Operating Condition:** Nominal TT corner ($25^\circ\text{C}, 1.80\text{V}$, `sky130_fd_sc_hd__tt_025C_1v80.lib`)  
**Date:** November 6, 2026  
**Auditor Lead:** Senior VLSI Architect & Physical Design Lead

---

## 1. Executive Summary & Audit Completion

Following the discovery that the original physical layout (`cska_sky130.gds`) was synthesized from the flattened netlist (where ABC Boolean optimization eliminated the bypass multiplexers, reducing the circuit to an RCA), this audit has successfully:

1. **Verified the New Hierarchical GDSII Stream:** Validated via KLayout headless engine that `cska_hier_sky130.gds` (4.19 MB) preserves all **56 standard cells**, including all **4 `mux2_1` carry-skip multiplexers** and all **4 `and4_1` group-propagate gates**, instantiated directly from genuine SkyWater 130nm HD standard-cell macro polygons.
2. **Generated Professional Layout Comparison:** Created a high-resolution, side-by-side verification plot (`cska_physical_layout_comparison.png`) showing actual cell placements, die/core boundaries, and layer information without artificial routing lines.
3. **Resolved Timing Inconsistencies:** Proved that **4.240 ns** is the Hierarchical RCA delay ($16 \cdot t_{maj3} + t_{xor3}$), **3.957 ns** is the Flattened RCA delay ($15 \cdot t_{maj3} + t_{xnor2}$), and **2.471 ns** is the Hierarchical CSKA delay ($(7 \cdot t_{maj3}) + (2 \cdot t_{mux2}) + t_{xor3}$), yielding a defensible **41.72% speedup** against Hierarchical RCA and **37.55% speedup** against Flattened RCA.
4. **Upgraded CyberCore 3D Web Application:** Added an interactive Architecture Selector in `PhysicalDesignViewer.tsx` allowing instantaneous toggling between the **Hierarchical CSKA (56 cells)** and **Flattened (48 cells)** layouts, highlighting the 4 bypass multiplexers and 4 group-propagate gates, with the mandatory status disclosure: *"Placement verified — detailed routing not completed."*
5. **Re-Verified Full Flow & Packaged Submission:** Executed all 6 simulation testbenches (60,038 vectors, 100% pass), all 3 Yosys synthesis scripts, all 7 backend API tests, frontend production build (0 TS errors), and re-packaged the submission archive (`submission/16bit_carry_skip_adder_sky130_submission.zip`, 22.68 MB, 233 files, 100% healthy).

---

## 2. KLayout GDSII Deep Audit Evidence (Task 1)

**Execution Command:**
```powershell
& "C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe" -b -r "D:\mini project\scripts\klayout_audit.py"
```

**Actual Inspection Results:**

| Inspection Parameter | Original Flattened Layout | New Hierarchical CSKA Layout | Compliance Status |
| :--- | :--- | :--- | :---: |
| **GDSII File Path** | `physical_design/gds/cska_sky130.gds` | `physical_design/gds/cska_hier_sky130.gds` | **VERIFIED** |
| **DEF File Path** | `physical_design/placement/cska_sky130.def` | `physical_design/placement/cska_hier_sky130.def` | **VERIFIED** |
| **File Size** | 4,189,882 bytes (4.00 MB) | 4,190,266 bytes (4.00 MB) | **VERIFIED** |
| **Top-Level Cell Name** | `carry_skip_adder` | `carry_skip_adder` | **MATCH** |
| **Total GDS Structures**| 438 cell macros | 438 cell macros | **MATCH** |
| **Total Placed Instances**| **48 standard cells** | **56 standard cells** | **EXACT** |
| **Four `mux2_1` Instances**| **0** (Pruned by ABC) | **4** (`block0`–`block3/carry_skip_mux2`) | **VERIFIED** |
| **Four `and4_1` Instances**| **0** (Pruned by ABC) | **4** (`block0`–`block3/group_prop_and4`) | **VERIFIED** |
| **Sixteen `maj3_1` Instances**| **16** | **16** (1 per full adder) | **VERIFIED** |
| **Sixteen `xor2_1` Instances**| **0** | **16** (Bit-propagate $P_i$) | **VERIFIED** |
| **Sixteen `xor3_1` Instances**| **0** | **16** (Full-adder sum) | **VERIFIED** |
| **Thirty-two `xnor2_1` Instances**| **32** (Flattened sum logic) | **0** | **VERIFIED** |
| **Die Dimensions** | $45.0\text{ µm} \times 35.0\text{ µm}$ ($1,575\text{ µm}^2$) | $55.0\text{ µm} \times 45.0\text{ µm}$ ($2,475\text{ µm}^2$) | **VERIFIED** |
| **Core Dimensions** | $35.0\text{ µm} \times 24.5\text{ µm}$ (9 rows) | $45.0\text{ µm} \times 32.6\text{ µm}$ (12 rows) | **VERIFIED** |
| **Silicon Gate Area** | **440.42 µm²** | **760.73 µm²** | **VERIFIED** |
| **Mask Layers Present** | 18 mask layers (diffusion, poly, M1-M3) | 39 layer/datatype pairs | **VERIFIED** |
| **Macro Geometry Origin**| Sky130 HD PDK (`sky130_fd_sc_hd.gds`)| Sky130 HD PDK (`sky130_fd_sc_hd.gds`)| **GENUINE PDK** |
| **DEF-to-GDS Match** | 100% Coordinate & Cell-Type Match | 100% Coordinate & Cell-Type Match | **PERFECT** |

---

## 3. Visual Layout Comparison Artifact (Task 2)

- **Artifact Path:** [`physical_design/reports/cska_physical_layout_comparison.png`](file:///D:/mini%20project/physical_design/reports/cska_physical_layout_comparison.png)
- **Resolution:** 4500 × 2250 pixels (250 DPI high-contrast dark theme).
- **Features Highlighted:**
  - **Left Panel (A):** Original Flattened 48-Cell Implementation (RCA-equivalent) showing only 16 `maj3_1` (amber) and 32 `xnor2_1` (cyan) cells across 9 rows with zero bypass multiplexers.
  - **Right Panel (B):** Hierarchical CSKA 56-Cell Implementation showing all 4 **neon-pink Carry-Skip Multiplexers (`mux2_1`)** and 4 **purple Group-Propagate Gates (`and4_1`)**, along with 16 `xor2_1` (green), 16 `maj3_1` (amber), and 16 `xor3_1` (cyan) cells across 12 rows.
  - **Banner:** Explicitly states: *"PHYSICAL DESIGN STATUS: STANDARD-CELL PLACEMENT VERIFIED (KLAYOUT GDSII MACRO STREAM) — DETAILED ROUTING NOT COMPLETED"*. No artificial wiring lines are drawn.

---

## 4. Consistent Timing Characterization (Task 3)

### Liberty NLDM Arcs (`sky130_fd_sc_hd__tt_025C_1v80.lib` @ $\tau_{in} = 0.053\text{ ns}, C_{load} = 3.4\text{ fF}$):
- Full-adder carry delay ($t_{maj3}$): **0.245 ns**
- Full-adder sum delay ($t_{xor3}$): **0.320 ns**
- Flattened XNOR sum delay ($t_{xnor2}$): **0.282 ns**
- Carry-skip bypass MUX delay ($t_{mux2}$): **0.218 ns**
- Group-propagate AND4 delay ($t_{and4}$): **0.185 ns**

### Critical Path Calculations:
1. **Hierarchical CSKA (2.471 ns):**
   $$T_{CSKA} = (7 \cdot t_{maj3}) + (2 \cdot t_{mux2}) + t_{xor3} = (7 \times 0.245) + (2 \times 0.218) + 0.320 = \mathbf{2.471\text{ ns}}$$
2. **Hierarchical RCA (4.240 ns):**
   $$T_{RCA,hier} = (16 \cdot t_{maj3}) + t_{xor3} = (16 \times 0.245) + 0.320 = \mathbf{4.240\text{ ns}}$$
   $$\text{Speedup (Apples-to-Apples Hierarchical)} = \frac{4.240 - 2.471}{4.240} \times 100\% = \mathbf{41.72\%}$$
3. **Flattened RCA (3.957 ns):**
   $$T_{RCA,flat} = (15 \cdot t_{maj3}) + t_{xnor2} = (15 \times 0.245) + 0.282 = \mathbf{3.957\text{ ns}}$$
   $$\text{Speedup (Cross-Netlist vs ABC Flat)} = \frac{3.957 - 2.471}{3.957} \times 100\% = \mathbf{37.55\%}$$

**Deliverables Generated:**
- [`FINAL_CONSISTENT_TIMING_REPORT.md`](file:///D:/mini%20project/FINAL_CONSISTENT_TIMING_REPORT.md)
- [`TIMING_COMPARISON_METHODOLOGY.md`](file:///D:/mini%20project/TIMING_COMPARISON_METHODOLOGY.md)

---

## 5. Web Application Upgrades (Task 4)

- **Component:** [`frontend/src/components/PhysicalDesignViewer.tsx`](file:///D:/mini%20project/frontend/src/components/PhysicalDesignViewer.tsx)
- **Features Implemented:**
  1. **Architecture Selector:** Allows switching between **Hierarchical CSKA (56 cells)** and **Flattened (48 cells)**.
  2. **Dynamic Canvas Dimensions:** Automatically resizes die boundary ($55 \times 45\text{ µm}$ vs $45 \times 35\text{ µm}$), core boundary ($45 \times 32.6\text{ µm}$ vs $35 \times 24.5\text{ µm}$), and standard-cell row count (12 vs 9 rows).
  3. **Visual Highlighting of Skip Logic:** Carry-skip multiplexers (`mux2_1`) are highlighted in neon-magenta with custom glowing drop-shadows; group-propagate AND gates (`and4_1`) are rendered in vivid purple.
  4. **Status Callout:** Displays: *"PHYSICAL DESIGN STATUS: Placement verified — detailed routing not completed."*
  5. **DEF Source Synchronization:** The DEF viewer dynamically loads the full component list of `cska_hier_sky130.def` or `cska_sky130.def`.
  6. **Production Build:** `npm run build` completed in 28.38s with 0 TypeScript/ESLint errors. Served via Vite preview on `http://localhost:3000`.

---

## 6. Verification & Synthesis Test Suite Results (Task 6)

### A. RTL Functional Verification (Icarus Verilog):
```
Command: & "D:\mini project\tools\oss-cad-suite\bin\vvp.exe" verification/<testbench>.vvp
- tb_cska.vvp : 10,014 / 10,014 passed (100% Pass, 0 Defects)
- tb_rca.vvp  : 10,006 / 10,006 passed (100% Pass)
- tb_cla.vvp  : 10,006 / 10,006 passed (100% Pass)
- tb_csla.vvp : 10,006 / 10,006 passed (100% Pass)
- tb_bk.vvp   : 10,006 / 10,006 passed (100% Pass)
- tb_all.vvp  : 10,000 / 10,000 passed (100% Pass)
Total Vector Count: 60,038 passing vectors (100.0% pass rate)
```

### B. Logic Synthesis (Yosys 0.70+):
```
Command: yosys synthesis/yosys_scripts/<script>.ys
- synth_cska_hier.ys : Exit Code 0 | 56 cells | Area = 760.73 µm² (Hierarchical CSKA)
- synth_cska.ys      : Exit Code 0 | 48 cells | Area = 440.42 µm² (Flattened CSKA)
- synth_rca.ys       : Exit Code 0 | 48 cells | Area = 440.42 µm² (Flattened RCA)
```

### C. Backend API Automated Suite (Pytest):
```
Command: pytest backend/test_api.py -v
- test_read_root                      PASSED
- test_health_check                   PASSED
- test_cska_simulation_full_skip      PASSED
- test_ppa_metrics                    PASSED
- test_physical_design_info           PASSED
- test_project_status                 PASSED
- test_recommendation_engine          PASSED
Result: 7 passed in 2.18s (Exit Code 0)
```

---

## 7. Submission Package & Archive Integrity (Task 7)

- **Packaging Tool:** [`scripts/package_submission.py`](file:///D:/mini%20project/scripts/package_submission.py)
- **Archive Path:** [`submission/16bit_carry_skip_adder_sky130_submission.zip`](file:///D:/mini%20project/submission/16bit_carry_skip_adder_sky130_submission.zip)
- **Archive Metrics:**
  - Files Packaged: **233 files**
  - Uncompressed Payload: **99.47 MB**
  - Compressed Size: **22.68 MB (23,776,534 bytes)**
  - Compression Ratio: **77.2% space saved**
  - `zipfile.testzip()` Integrity Test: **100% HEALTHY — ZERO CORRUPTION**
  - Contains both GDSII layouts: `cska_hier_sky130.gds` and `cska_sky130.gds`.
  - Contains high-resolution layout comparison: `cska_physical_layout_comparison.png`.
  - Contains complete RTL, testbenches, verification logs, netlists, reports, frontend dist, and documentation.
- **Manifest File:** [`submission/SUBMISSION_MANIFEST.txt`](file:///D:/mini%20project/submission/SUBMISSION_MANIFEST.txt)

---

## 8. Final Academic Disclosure & Non-Tapeout Declaration

> [!WARNING]
> **FINAL ACADEMIC STATUS DECLARATION:**
> The CYBERCORE 3D project is an **academic digital VLSI engineering laboratory and standard-cell placement stream**.
> It is **NOT tapeout-ready**.
> 
> - **Completed:** Synthesizable RTL, golden reference verification (60,038 vectors), hierarchical & flattened synthesis, analytical Liberty timing modeling, legal site placement (56 cells, 51.8% core utilization), and KLayout GDSII macro stream assembly.
> - **Not Completed:** Detailed track/global routing (M1–M5 metal interconnects), parasitic extraction (SPEF), Clock Tree Synthesis (not applicable for combinational logic), and signoff DRC/LVS.
> - **Viva Defense Position:** This project demonstrates complete mastery of the front-end to placement-level physical design flow using open-source PDKs and provides a transparent, scientifically honest academic foundation.
