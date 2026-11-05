# CYBERCORE 3D — FINAL SYNTHESIS & TECHNOLOGY MAPPING AUDIT
## Gate-Level Technology Mapping into SkyWater 130nm CMOS
**Synthesis Tool:** Yosys Open SYNThesis Suite 0.49 (Git SHA1 c469e32) with Berkeley ABC  
**PDK Target:** SkyWater 130nm High-Density (`sky130_fd_sc_hd`)  
**Liberty File:** `synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib`  
**Operating Corner:** Typical-Typical, 25°C, 1.80V  
**Audit Timestamp:** November 6, 2026  

---

## 1. Synthesis Hierarchy: Flattened vs. Hierarchical Analysis

A critical academic insight demonstrated in this project is the impact of Boolean optimization on arithmetic hierarchy:

### 1.1 Flattened Synthesis (`synth_cska.ys`)
- **Command:** `yosys -s synthesis/yosys_scripts/synth_cska.ys`
- **Methodology:** The design is fully flattened (`flatten` pass). Berkeley ABC performs unconstrained technology mapping across the entire 16-bit network.
- **Result:** ABC discovers that $(P_{grp} \cdot C_{in}) + (\overline{P_{grp}} \cdot C_{ripple})$ has the identical Boolean truth table to canonical carry propagation. It collapses the ripple adders and multiplexers into:
  - 16 `sky130_fd_sc_hd__maj3_1` (Majority-3 Carry Cells)
  - 32 `sky130_fd_sc_hd__xnor2_1` (XNOR2 Sum Cells)
- **Total Standard Cells:** **48 cells**
- **Total Cell Area:** **440.42 µm²**
- **Physical Consequence:** Explicit 2:1 multiplexers are erased; the resulting netlist behaves like an optimized ripple carry chain.

### 1.2 Hierarchical Synthesis (`synth_cska_hier.ys`)
- **Command:** `yosys -s synthesis/yosys_scripts/synth_cska_hier.ys`
- **Methodology:** Preserves `carry_skip_block_4bit` sub-module boundaries (`hierarchy -check -top carry_skip_adder` without `flatten`).
- **Result:** Standard cells mapped inside the preserved hierarchy:
  - 4 `sky130_fd_sc_hd__and4_1` (4-input AND Group Propagate Gates, area: 35.03 µm²)
  - 4 `sky130_fd_sc_hd__mux2_1` (2:1 Carry Skip Multiplexers, area: 45.04 µm²)
  - 16 `sky130_fd_sc_hd__maj3_1` (Majority-3 Carry Gates, area: 160.15 µm²)
  - 16 `sky130_fd_sc_hd__xor2_1` (XOR2 Gates, area: 140.13 µm²)
  - 16 `sky130_fd_sc_hd__xor3_1` (XOR3 Gates, area: 380.37 µm²)
- **Total Standard Cells:** **56 cells**
- **Total Cell Area:** **760.73 µm²**
- **Physical Consequence:** Hardware carry-skip bypass structures survive 100% intact into physical silicon.

---

## 2. Five-Adder Architecture Synthesis Benchmark

| Architecture | Synthesis Script | Gate / Cell Count | Cell Area (µm²) | Preserved Hierarchy | Top Cell Types |
|---|---|---|---|---|---|
| **Ripple Carry (RCA)** | `synth_rca.ys` | 32 (Hier) / 48 (Flat) | 540.52 / 440.42 | 16 Full Adders | `maj3_1`, `xnor2_1` |
| **Carry Skip (CSKA)** | `synth_cska_hier.ys` | **56** | **760.73** | 4 Blocks + 4 MUX2 + 4 AND4 | `mux2_1`, `and4_1`, `maj3_1`, `xor3_1` |
| **Carry Look-Ahead (CLA)** | `synth_cla.ys` | 65 | 479.21 | 4 CLA Generators | `nand2_1`, `o21a_1`, `xnor2_1` |
| **Carry Select (CSLA)** | `synth_csla.ys` | 48 | 440.42 | Dual Carry Chains + MUX | `mux2_1`, `maj3_1`, `xnor2_1` |
| **Brent-Kung (BK)** | `synth_bk.ys` | 77 | 506.74 | Binary Prefix Tree | `and2_1`, `or2_1`, `xor2_1` |

---

## 3. Netlist Verification
- Hierarchical Netlist: `synthesis/netlists/cska_hier_sky130_netlist.v`
- Flattened Netlist: `synthesis/netlists/cska_sky130_netlist.v`
- Both netlists verified cleanly without syntax errors and without sequential element warnings.
