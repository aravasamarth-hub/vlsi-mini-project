# CSKA vs RCA Netlist Architectural Consistency & Comparison Report

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace:** `D:\mini project`  
**Technology:** SkyWater SKY130 130nm High-Density CMOS (`sky130_fd_sc_hd`)  
**Operating Corner:** TT, 25°C, 1.80V (`sky130_fd_sc_hd__tt_025C_1v80.lib`)  
**Date:** November 6, 2026  
**Auditor:** Independent Technical Auditor & ASIC Physical Design Specialist

---

## 1. Executive Summary

This audit inspects and compares the gate-level synthesized netlists within the CYBERCORE 3D project:
1. **Hierarchical CSKA Netlist:** [`synthesis/netlists/cska_hier_sky130_netlist.v`](file:///D:/mini%20project/synthesis/netlists/cska_hier_sky130_netlist.v)
2. **Flattened CSKA Netlist:** [`synthesis/netlists/cska_sky130_netlist.v`](file:///D:/mini%20project/synthesis/netlists/cska_sky130_netlist.v)
3. **Flattened RCA Netlist:** [`synthesis/netlists/rca_sky130_netlist.v`](file:///D:/mini%20project/synthesis/netlists/rca_sky130_netlist.v)

### Key Empirical Findings:
- The **Hierarchical CSKA netlist** strictly preserves all 4 4-bit blocks, containing **56 standard cells** with an active silicon area of **760.73 µm²**. It retains **4 explicit carry-skip multiplexers (`sky130_fd_sc_hd__mux2_1`)** and **4 group-propagate AND gates (`sky130_fd_sc_hd__and4_1`)**.
- The **Flattened CSKA netlist** contains **48 standard cells** with an active silicon area of **440.42 µm²**. It contains **zero multiplexers** and **zero 4-input AND gates**.
- At the structural and gate level, the **Flattened CSKA netlist is 100% topologically identical to the Flattened RCA netlist** (both consisting of exactly 16 `maj3_1` and 32 `xnor2_1` cells).
- This collapse occurred because Berkeley ABC Boolean optimization during flattened synthesis eliminated the redundant bypass logic to optimize total gate count and area.

---

## 2. Machine-Readable Cell Inventory

| Netlist File | Architecture | Total Cells | Area (µm²) | `maj3_1` | `xnor2_1` | `xor2_1` | `xor3_1` | `and4_1` | `mux2_1` | Carry-Skip Bypass Present? |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `cska_hier_sky130_netlist.v` | **Hierarchical CSKA** | **56** | **760.73** | 16 | 0 | 16 | 16 | **4** | **4** | **YES (4 MUXes)** |
| `cska_sky130_netlist.v` | **Flattened CSKA** | **48** | **440.42** | 16 | 32 | 0 | 0 | **0** | **0** | **NO (0 MUXes)** |
| `rca_sky130_netlist.v` | **Flattened RCA** | **48** | **440.42** | 16 | 32 | 0 | 0 | **0** | **0** | **NO (0 MUXes)** |

---

## 3. Detailed Cell Breakdown & Silicon Area (SKY130 HD)

Cell area figures are extracted directly from `sky130_fd_sc_hd__tt_025C_1v80.lib` (row height = 2.72 µm):

### A. Hierarchical CSKA Netlist (56 Cells)
*Top Module: `carry_skip_adder` instantiates 4x `carry_skip_block_4bit` (`block0`, `block1`, `block2`, `block3`).*
*Each block contains 4x `full_adder` + 4x `xor2_1` + 1x `and4_1` + 1x `mux2_1`.*

- **Full Adder Sum:** 16 × `sky130_fd_sc_hd__xor3_1` (23.77 µm² each) = **380.36 µm²**
- **Full Adder Carry:** 16 × `sky130_fd_sc_hd__maj3_1` (10.01 µm² each) = **160.15 µm²**
- **Bit Propagate ($P_i$):** 16 × `sky130_fd_sc_hd__xor2_1` (8.76 µm² each) = **140.13 µm²**
- **Group Propagate ($P_{grp}$):** 4 × `sky130_fd_sc_hd__and4_1` (8.76 µm² each) = **35.03 µm²**
- **Carry-Skip Bypass:** 4 × `sky130_fd_sc_hd__mux2_1` (11.26 µm² each) = **45.04 µm²**
- **Total Silicon Gate Area:** **760.73 µm²**

### B. Flattened CSKA Netlist (48 Cells)
*Top Module: `carry_skip_adder` (flattened into flat netlist).*

- **Carry Logic:** 16 × `sky130_fd_sc_hd__maj3_1` (10.01 µm² each) = **160.15 µm²**
- **Sum Logic:** 32 × `sky130_fd_sc_hd__xnor2_1` (8.76 µm² each) = **280.27 µm²**
- **Bypass MUXes / AND4:** **0 instances**
- **Total Silicon Gate Area:** **440.42 µm²**

### C. Flattened RCA Netlist (48 Cells)
*Top Module: `ripple_carry_adder` (flattened into flat netlist).*

- **Carry Logic:** 16 × `sky130_fd_sc_hd__maj3_1` (10.01 µm² each) = **160.15 µm²**
- **Sum Logic:** 32 × `sky130_fd_sc_hd__xnor2_1` (8.76 µm² each) = **280.27 µm²**
- **Bypass MUXes / AND4:** **0 instances**
- **Total Silicon Gate Area:** **440.42 µm²**

---

## 4. Root-Cause Analysis: Why ABC Optimization Flattened CSKA

When Yosys synthesizes with unconstrained flattening:
```tcl
hierarchy -top carry_skip_adder
flatten
synth -top carry_skip_adder
abc -liberty sky130_fd_sc_hd__tt_025C_1v80.lib
```
1. The `flatten` command dissolves module boundaries for `carry_skip_block_4bit` and `full_adder`.
2. Berkeley ABC constructs an And-Inverter Graph (AIG) for the entire 16-bit logic cone.
3. The Boolean equation for the skip multiplexer in Block $k$ is:
   $$C_{out,k} = (P_{grp,k} \cdot C_{in,k}) + (\overline{P_{grp,k}} \cdot C_{ripple,k})$$
   where $P_{grp,k} = \prod_{i=0}^3 (A_i \oplus B_i)$.
4. Logically, $C_{out,k}$ computes the exact same truth table as the ripple-carry output $C_{ripple,k}$ for all possible inputs because if $P_{grp}=1$, the carry in ripples to the carry out anyway.
5. In academic Carry Skip theory, the skip path exists solely to bypass the intermediate propagation delay of the ripple stages ($4 \cdot \tau_{FA} \to \tau_{MUX}$).
6. However, standard logic synthesis without tight path timing constraints evaluates purely for **minimal area and gate count**.
7. ABC recognizes the bypass multiplexer and group-propagate AND gate as redundant Boolean logic that does not alter the output truth table, and prunes them completely.
8. The result is the absolute minimal Boolean implementation of a 16-bit addition in Sky130 HD: 16 Majority-3 gates and 32 XNOR-2 gates (48 cells).

---

## 5. Architectural Verdict

- The **Flattened CSKA netlist** is physically and logically an **RCA**.
- The **Hierarchical CSKA netlist** preserves the true academic architecture with 56 cells, 4 bypass multiplexers, and 4 group-propagate AND gates.
- Both netlists are valid project artifacts, but their distinctions must be transparently declared in academic defense and documentation.
