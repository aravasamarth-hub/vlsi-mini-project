# Physical Design Scope, Boundaries and Academic Limitations

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace:** `D:\mini project`  
**Target Node:** SkyWater SKY130 130nm CMOS  
**Date:** November 6, 2026  
**Auditor:** ASIC Physical Verification & CAD Flow Lead

---

## 1. Purpose & Academic Scope

In VLSI academic projects, clarity regarding the exact stage of the ASIC design flow reached is essential for scientific integrity. This document formally defines what was accomplished, what physical design steps are complete, and what remains outside the scope of this project.

---

## 2. ASIC Physical Design Flow Checklist

| Physical Design Stage | Status | Tools Used | Evidence Artifact | Technical Explanation |
| :--- | :---: | :--- | :--- | :--- |
| **Logic Synthesis** | **COMPLETE** | Yosys 0.70+ | `cska_hier_sky130_netlist.v` | Synthesized to 56 standard cells with Sky130 HD library. |
| **Floorplanning** | **COMPLETE** | Python script | `cska_hier_sky130.def` | Die (55×45 µm), Core (45×32.64 µm), 12 rows @ 2.72 µm pitch. |
| **I/O Pin Placement** | **COMPLETE** | DEF Generator | `cska_hier_sky130.def` | Boundary definitions and PRBOUNDARY layer (235/4). |
| **Standard-Cell Placement** | **COMPLETE** | Python / Custom CAD | `cska_hier_sky130.def` | 56 standard cells placed on legal site grid (`SITE unithd`). |
| **Placement Legality** | **VERIFIED** | Script verification | DEF coordinates | Zero macro overlaps; alternating N/FS row orientations. |
| **GDSII Stream Assembly** | **COMPLETE** | KLayout 0.30.0 | `cska_hier_sky130.gds` | Assembled 56 standard-cell macros into top cell (4.19 MB). |
| **Clock Tree Synthesis (CTS)**| **N/A** | — | — | **Not Applicable:** 16-bit CSKA is a purely combinational macro with no registers/clock pins. |
| **Detailed Global/Track Routing** | **NOT COMPLETED** | — | — | No M1–M5 metal interconnect wires or contact vias were routed. |
| **Parasitic Extraction (SPEF)**| **NOT COMPLETED** | — | — | Cannot be performed without detailed physical routing geometries. |
| **Signoff DRC (Design Rules)** | **PARTIAL** | KLayout placement | Macro placement check | Standard cell internals are DRC-clean; inter-cell metal DRC requires detailed routing. |
| **Signoff LVS (Layout vs Schematic)**| **NOT COMPLETED** | — | — | LVS compares routed metal connectivity against schematic netlist; requires routing. |

---

## 3. Detailed Explanation of Physical Boundaries

### A. Placement Legality vs Detailed Routing
- **What is present:** Both `cska_sky130.def` (48 cells) and `cska_hier_sky130.def` (56 cells) contain legally aligned macro coordinates. Cells are placed on the standard-cell site grid (`step = 0.46 µm`), snapped to row heights (`2.72 µm`), with alternating north and flipped-south (`N` / `FS`) orientations to allow shared power/ground rails (`VNB`, `VPB`, `VGND`, `VPWR`).
- **What is NOT present:** Detailed routing. There are no `TRACKS`, `VIAS`, or `SPECIALNETS` routing metal shapes connecting standard cell pins in the DEF files. The cells sit on the substrate with pins exposed, awaiting detailed global and track routing.

### B. GDSII Macro Assembly Reality
- Both `cska_sky130.gds` and `cska_hier_sky130.gds` are **placement-level GDSII stream files**.
- KLayout successfully loaded the vendor standard cell library (`sky130_fd_sc_hd.gds`) and placed 48 and 56 macro instances respectively, inserting boundary boxes on layer `235/4`.
- Because standard-cell layouts from SkyWater PDK are internally DRC-clean, every cell macro inside the GDSII possesses real diffusion, polysilicon, contact, and local interconnect geometries.
- However, the chip does **not** contain top-level interconnect routing between the standard cells.

### C. Clock Tree Synthesis (CTS)
- Combinational adders possess no flip-flops, latches, or sequential storage elements.
- Consequently, Clock Tree Synthesis (CTS) is neither required nor applicable to this design.

### D. Parasitic Extraction & Static Timing
- Accurate post-layout parasitic extraction requires SPEF (Standard Parasitic Exchange Format) generated from physical metal wirelengths, sidewall capacitances, and via resistances.
- Because metal routing was not performed, post-route extraction could not be executed.
- The 2.471 ns timing metric is an **analytical netlist-level timing estimate**, not a post-route extracted STA figure.

---

## 4. Defense Guidelines for College Viva Examination

When asked by evaluators or professors:
> *"Does your GDSII file represent a fully taped-out chip?"*

**The correct, scientifically rigorous answer is:**
> *"The GDSII file (`cska_hier_sky130.gds`) is a standard-cell placement stream generated using KLayout and the Google/SkyWater 130nm High-Density library. It contains all 56 standard-cell macros placed on the legal site grid, including the 4 carry-skip multiplexers and 4 group-propagate AND gates. Detailed routing (M1–M5 interconnects), parasitic extraction (SPEF), and signoff DRC/LVS were not completed, which represents the standard academic boundary for placement-level VLSI coursework."*

