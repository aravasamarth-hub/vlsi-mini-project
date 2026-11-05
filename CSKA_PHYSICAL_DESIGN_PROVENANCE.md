# Physical Design Provenance and Flow Traceability Report

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace:** `D:\mini project`  
**Flow Target:** Google / SkyWater SKY130 High-Density CMOS  
**Date:** November 6, 2026  
**Auditor:** ASIC Physical Design & Verification Lead

---

## 1. Flow Overview & Traceability Matrix

This document establishes the exact provenance of all physical layout files in `physical_design/`. It traces each layout artifact back to its generating script, netlist, and RTL source.

| Physical Artifact | File Path | Generating Script | Netlist Input | Standard Cells | Architecture Realized |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Original DEF** | [`physical_design/placement/cska_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_sky130.def) | [`physical_design/generate_physical_layout.py`](file:///D:/mini%20project/physical_design/generate_physical_layout.py) | `cska_sky130_netlist.v` | **48** | Flattened RCA-equivalent |
| **Original GDSII** | [`physical_design/gds/cska_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_sky130.gds) | [`physical_design/generate_physical_layout.py`](file:///D:/mini%20project/physical_design/generate_physical_layout.py) | `cska_sky130.def` | **48** | Flattened RCA-equivalent |
| **Hierarchical DEF** | [`physical_design/placement/cska_hier_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_hier_sky130.def) | [`physical_design/generate_hier_physical_layout.py`](file:///D:/mini%20project/physical_design/generate_hier_physical_layout.py) | `cska_hier_sky130_netlist.v` | **56** | True Hierarchical CSKA |
| **Hierarchical GDSII** | [`physical_design/gds/cska_hier_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_hier_sky130.gds) | [`physical_design/generate_hier_physical_layout.py`](file:///D:/mini%20project/physical_design/generate_hier_physical_layout.py) | `cska_hier_sky130.def` | **56** | True Hierarchical CSKA |

---

## 2. Lineage Analysis: Original Layout (`cska_sky130.gds`)

### Step 1: RTL Source
- **Files:** [`rtl/adder_modules/carry_skip_adder.v`](file:///D:/mini%20project/rtl/adder_modules/carry_skip_adder.v), [`rtl/adder_modules/carry_skip_block_4bit.v`](file:///D:/mini%20project/rtl/adder_modules/carry_skip_block_4bit.v), [`rtl/adder_modules/full_adder.v`](file:///D:/mini%20project/rtl/adder_modules/full_adder.v).
- **Semantics:** Explicitly specifies 4 4-bit blocks with bit propagate, group propagate AND4, and 2:1 multiplexers.

### Step 2: Synthesis Flow
- **Script:** [`synthesis/yosys_scripts/synth_cska.ys`](file:///D:/mini%20project/synthesis/yosys_scripts/synth_cska.ys)
- **Command:** `yosys synthesis/yosys_scripts/synth_cska.ys`
- **TCL Pipeline:**
  ```tcl
  read_verilog rtl/adder_modules/carry_skip_adder.v ...
  hierarchy -top carry_skip_adder
  flatten
  synth -top carry_skip_adder
  dfflibmap -liberty synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib
  abc -liberty synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib
  write_verilog -noattr synthesis/netlists/cska_sky130_netlist.v
  ```
- **Output Netlist:** `synthesis/netlists/cska_sky130_netlist.v` (48 cells: 16 `maj3_1`, 32 `xnor2_1`).

### Step 3: DEF Placement Generation
- **Script:** [`physical_design/generate_physical_layout.py`](file:///D:/mini%20project/physical_design/generate_physical_layout.py)
- **Input:** Reads line 17: `NETLIST = os.path.join(..., "cska_sky130_netlist.v")`.
- **Parsing:** Line 40 calls `cells = parse_netlist_instances(NETLIST)`.
- **DEF Output:** Declares `COMPONENTS 48 ;` placing 16 `maj3_1` and 32 `xnor2_1` across 9 rows in a 45 µm × 35 µm die.

### Step 4: GDSII Macro Assembly
- **Engine:** KLayout 0.30.0 (`klayout_app.exe -b -r script.py`)
- **PDK Library:** `synthesis/sky130_pdk/sky130_fd_sc_hd.gds` (4.18 MB standard cell stream).
- **Assembly:** Reads `cska_sky130.def`, instantiates 48 macro bounding boxes as SREFs into top cell `carry_skip_adder`, adds PRBOUNDARY layer (235/4), and writes `cska_sky130.gds` (4,189,882 bytes).

**Provenance Finding:** The original `cska_sky130.gds` is **empirically proven** to be the physical placement stream of the **flattened RCA-equivalent netlist**.

---

## 3. Lineage Analysis: True Hierarchical Layout (`cska_hier_sky130.gds`)

To resolve the architectural discrepancy without overwriting original artifacts, a dedicated hierarchical flow was executed:

### Step 1: RTL Source
- **Files:** Identical RTL source files.

### Step 2: Hierarchical Synthesis Flow
- **Script:** [`synthesis/yosys_scripts/synth_cska_hier.ys`](file:///D:/mini%20project/synthesis/yosys_scripts/synth_cska_hier.ys)
- **Command:** `yosys synthesis/yosys_scripts/synth_cska_hier.ys`
- **TCL Pipeline:** Preserves module boundaries (`hierarchy -check -top carry_skip_adder` without `flatten`), synthesizing submodules independently.
- **Output Netlist:** `synthesis/netlists/cska_hier_sky130_netlist.v` (56 cells total: 16 `xor3_1`, 16 `maj3_1`, 16 `xor2_1`, 4 `and4_1`, 4 `mux2_1`).

### Step 3: Hierarchical DEF Generation
- **Script:** [`physical_design/generate_hier_physical_layout.py`](file:///D:/mini%20project/physical_design/generate_hier_physical_layout.py)
- **Floorplan:** Die area 55 µm × 45 µm, Core area 45 µm × 32.64 µm (12 standard cell rows).
- **Placement:** Places all 56 instances grouped by 4-bit block hierarchy (`block0` through `block3`), maintaining clear spatial localization for each block's ripple chain, propagate tree, and skip multiplexer.
- **DEF Output:** [`physical_design/placement/cska_hier_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_hier_sky130.def) (`COMPONENTS 56 ;`).

### Step 4: Hierarchical GDSII Assembly
- **Engine:** KLayout 0.30.0 in headless batch mode.
- **Assembly:** Instantiates all 56 standard-cell macros from `sky130_fd_sc_hd.gds` into top cell `carry_skip_adder`.
- **Output GDSII:** [`physical_design/gds/cska_hier_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_hier_sky130.gds) (4,190,266 bytes).
- **Verification Plot:** [`physical_design/reports/cska_hier_placement_layout.png`](file:///D:/mini%20project/physical_design/reports/cska_hier_placement_layout.png).

---

## 4. Summary & Preservation Guarantee

1. No original files were modified or deleted. Both `cska_sky130.gds` and `cska_hier_sky130.gds` coexist in `physical_design/gds/`.
2. Both layouts have clear provenance and can be fully reproduced using their respective documented commands.

