# CSKA GDSII Binary Architecture Verification Report

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace:** `D:\mini project`  
**Binary Parser Tool:** [`scripts/compare_gds.py`](file:///D:/mini%20project/scripts/compare_gds.py)  
**Date:** November 6, 2026  
**Auditor:** Semiconductor Verification Specialist & Binary Stream Auditor

---

## 1. Binary Stream Parsing Methodology

To eliminate all ambiguity, an independent binary stream decoder was built using Python's `struct` module to parse raw IEEE GDSII stream records without depending on third-party CAD libraries. The decoder parses:
- `STRNAME` (Record `0x0606`): Structure definitions.
- `SNAME` (Record `0x1206`): Structure reference calls inside top cell `carry_skip_adder`.
- `LAYER` (Record `0x0D02`): Physical mask layers.

---

## 2. Side-by-Side GDSII Stream Inspection Results

```
==================== ORIGINAL GDSII (FLATTENED) ====================
Path: physical_design/gds/cska_sky130.gds
File Size: 4,189,882 bytes (4.00 MB)
Top / Primary Cell: carry_skip_adder
Direct Sub-Cell SREFs in carry_skip_adder: 48 instances
Instance Counts by Cell Type:
  sky130_fd_sc_hd__maj3_1: 16 instances
  sky130_fd_sc_hd__xnor2_1: 32 instances
Contains mux2_1 (Carry-Skip MUX)? FALSE (0 instances)
Contains and4_1 (Group Propagate)? FALSE (0 instances)
Physical Mask Layers Present (18 layers): [64, 65, 66, 67, 68, 69, 70, 71, 72, 78, 81, 83, 93, 94, 95, 122, 235, 236]

==================== NEW HIERARCHICAL GDSII (TRUE CSKA) ====================
Path: physical_design/gds/cska_hier_sky130.gds
File Size: 4,190,266 bytes (4.00 MB)
Top / Primary Cell: carry_skip_adder
Direct Sub-Cell SREFs in carry_skip_adder: 56 instances
Instance Counts by Cell Type:
  sky130_fd_sc_hd__and4_1: 4 instances
  sky130_fd_sc_hd__maj3_1: 16 instances
  sky130_fd_sc_hd__mux2_1: 4 instances
  sky130_fd_sc_hd__xor2_1: 16 instances
  sky130_fd_sc_hd__xor3_1: 16 instances
Contains mux2_1 (Carry-Skip MUX)? TRUE (4 instances)
Contains and4_1 (Group Propagate)? TRUE (4 instances)
Physical Mask Layers Present (18 layers): [64, 65, 66, 67, 68, 69, 70, 71, 72, 78, 81, 83, 93, 94, 95, 122, 235, 236]
```

---

## 3. Answers to the Five Core Architectural Questions

### Question 1: Was the original GDSII generated from the flattened or hierarchical netlist?
**Empirical Answer:**
The original GDSII (`cska_sky130.gds`) was generated directly from the **flattened netlist** (`synthesis/netlists/cska_sky130_netlist.v`). This is proven by:
1. `physical_design/generate_physical_layout.py` explicitly specifying `NETLIST = ... "cska_sky130_netlist.v"`.
2. The DEF declaring `COMPONENTS 48 ;`.
3. The binary stream containing exactly 48 SREFs (`maj3_1` and `xnor2_1`), matching the flattened netlist cell count exactly.

### Question 2: Does the original GDSII layout have carry-skip multiplexers?
**Empirical Answer:**
**No.** The original GDSII contains **0 instances** of `sky130_fd_sc_hd__mux2_1` and **0 instances** of `sky130_fd_sc_hd__and4_1`. The carry bypass mechanism was pruned by ABC Boolean synthesis before placement. In contrast, the newly generated `cska_hier_sky130.gds` contains all **4 `mux2_1` bypass multiplexers** and all **4 `and4_1` group propagate gates**.

### Question 3: Does the original GDSII layout physically differ from the RCA layout?
**Empirical Answer:**
**No, not structurally.** The cell instances in `cska_sky130.gds` are 16 `maj3_1` and 32 `xnor2_1`, which is identical to the gate count and cell inventory of `rca_sky130_netlist.v`. Any physical difference between the original CSKA GDSII and an RCA GDSII would merely be the coordinate placement permutation of these 48 identical standard cells. Functionally, topologically, and structurally, the original GDSII represents an RCA.

### Question 4: Why did ABC optimization flatten the architecture?
**Empirical Answer:**
When Yosys invokes ABC without `-keep_hierarchy` or without false-path/multicycle timing constraints on the bypass mux, ABC targets minimal Boolean literals and gate area. In Boolean algebra, the CSKA skip path is logically redundant:
$$C_{out} = P_{grp} \cdot C_{in} + \overline{P_{grp}} \cdot C_{ripple} \equiv C_{ripple}$$
Because $C_{ripple}$ already equals $C_{in}$ when $P_{grp}=1$. Since standard area-driven technology mapping treats all paths identically, ABC recognizes that eliminating the 4 MUX2 and 4 AND4 gates saves area and cells without changing functional outputs.

### Question 5: Which netlist matches the academic claims of the project?
**Empirical Answer:**
The **hierarchical netlist** ([`cska_hier_sky130_netlist.v`](file:///D:/mini%20project/synthesis/netlists/cska_hier_sky130_netlist.v)) and its corresponding placement stream ([`cska_hier_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_hier_sky130.gds)) match the academic claims of the project.
- **Academic Claim:** 16-bit Carry Skip Adder with 4 4-bit blocks, group propagate logic, and 2:1 skip multiplexers achieving $O(\sqrt{N})$ asymptotic delay.
- **Hierarchical Implementation:** Retains all 4 blocks, 4 `mux2_1` bypass multiplexers, 4 `and4_1` gates, and achieves the analytical critical-path delay estimate of **2.471 ns** (vs 3.957 ns RCA) with **56 standard cells** and **760.73 µm²** silicon gate area.
