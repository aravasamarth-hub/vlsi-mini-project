# GDSII PHYSICAL LAYOUT EXPLANATION & ARCHITECTURAL DISCLOSURE

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Layout File:** `physical_design/gds/cska_sky130.gds` (File size: 4,189,882 bytes / 4.18 MB)  
**DEF Placement File:** `physical_design/placement/cska_sky130.def` (3,643 bytes)  
**Layout Viewer:** KLayout 0.30.12 (Native) / KLayout 0.30.0 (Reference Environment)  
**PDK:** SkyWater 130nm High-Density Standard Cells (`sky130_fd_sc_hd`)  

---

## 1. WHAT IS GDSII STREAM FORMAT?

GDSII (Graphic Design System II) is the de facto semiconductor industry standard binary file format for transferring integrated circuit layout data between Electronic Design Automation (EDA) software and semiconductor fabrication foundries (photomask mask-shops):

- **Binary Representation:** Contains hierarchical geometric primitives (polygons, paths, text labels, boundaries, and cell references).
- **Layer & Datatype System:** Each physical fabrication mask is encoded as a `LayerNumber:DataTypeNumber` pair (e.g., `68:20` for Metal 1 drawing, `66:44` for active silicon diffusion).
- **Hierarchical Cell References:** Top-level designs instantiate lower-level leaf cells (standard cells, I/O pads, macros) using `AREF` (array reference) or `SREF` (structure reference) records without duplicating base polygon geometries.

---

## 2. PHYSICAL LAYOUT SPECIFICATIONS & DIE DIMENSIONS

The physical floorplan and standard cell placement for the 16-bit Carry Skip Adder were generated targeting the SkyWater 130nm High Density standard cell grid:

| Parameter | Dimension / Value | Engineering Significance |
| :--- | :--- | :--- |
| **Die Width** | **45.00 µm** (45,000 nm) | Outer boundary including I/O ring & seal ring keep-out |
| **Die Height** | **35.00 µm** (35,000 nm) | Total silicon footprint = **1,575.00 µm²** |
| **Core Width** | **35.00 µm** (35,000 nm) | Active standard cell placement cavity |
| **Core Height** | **24.50 µm** (24,500 nm) | Active placement area = **857.50 µm²** |
| **Standard Cell Area** | **440.42 µm²** | Cumulative silicon occupied by 48 standard logic cells |
| **Core Utilization** | **51.36%** | Healthy density providing ample whitespace for routing congestion relief |
| **Standard Cell Rows** | **9 Alternating Rows** | Row height: 2.72 µm; Row orientations: `FS` (Flipped South) / `N` (Normal) |
| **Site Definition** | `unit` (Width: 0.46 µm, Height: 2.72 µm) | Standard cell width quantization grid of SkyWater 130nm HD |
| **Die Margin (Pad to Core)** | 5.00 µm X-margin, 5.25 µm Y-margin | Provides dedicated area for power rings (VDD/VSS stripes) |

---

## 3. SKYWATER 130nm MASK LAYER ASSIGNMENTS

In KLayout, the layout layer properties file (`sky130hd.lyp`) maps GDSII layer and datatype numbers to physical fabrication masks and visual colors:

| Layer Number | Datatype | Layer Name | Physical Function in SkyWater 130nm Silicon | Visual Color in KLayout |
| :---: | :---: | :--- | :--- | :--- |
| **235** | **4** | `prBoundary` | Place and Route chip boundary & die outline | White dashed boundary box |
| **66** | **44** | `diff.drawing` | Active diffusion region ($N^+$ and $P^+$ silicon implants) | Emerald Green / Cyan tint |
| **68** | **44** | `poly.drawing` | Polysilicon transistor gate electrodes ($L_{eff} = 130\text{ nm}$) | Crimson Red |
| **66** | **20** | `li1.drawing` | Local Interconnect (Titanium Nitride / TiN low-resistance wiring) | Deep Indigo Blue |
| **67** | **20** | `mcon.drawing` | Contact cut connecting Polysilicon/Diffusion to Local Interconnect | Amber / Yellow squares |
| **68** | **20** | `met1.drawing` | **Metal 1**: Standard cell internal pin routing & local intra-cell nets | Cobalt Blue |
| **67** | **44** | `via1.drawing` | Inter-layer via connecting Metal 1 to Metal 2 | Magenta squares |
| **69** | **20** | `met2.drawing` | **Metal 2**: Horizontal skip bypass buses & block interconnects | Bright Electric Cyan |
| **69** | **44** | `via2.drawing` | Inter-layer via connecting Metal 2 to Metal 3 | Dark Orange squares |
| **70** | **20** | `met3.drawing` | **Metal 3**: Vertical VDD / VSS power grid straps | Tangerine Orange |

---

## 4. HOW `cska_sky130.gds` WAS CREATED

The physical GDSII layout was compiled through an automated two-step flow:

```
[Synthesized Netlist] (cska_sky130_netlist.v)
         │
         ▼
[Placement Engine] (generate_physical_layout.py)
         │  - Calculates core cavity (35.0 µm x 24.5 µm)
         │  - Establishes 9 standard cell rows
         │  - Places 48 standard cells into rows with alternating N/FS orientations
         │  - Enforces Sky130 HD site snapping (0.46 µm grid)
         ▼
[DEF Placement File] (cska_sky130.def)
         │
         ▼
[KLayout Python Engine] (export_gds.py)
         │  - Reads cska_sky130.def
         │  - Loads reference SkyWater 130nm cell library (sky130_fd_sc_hd.gds, 433 cells)
         │  - Instantiates each cell geometry into top cell 'carry_skip_adder'
         │  - Writes out complete binary GDSII stream
         ▼
[Binary GDSII File] (cska_sky130.gds - 4.18 MB)
```

---

## 5. ANALYSIS OF ATTACHED KLAYOUT SCREENSHOTS (`6_final.gds`)

The user-supplied KLayout 0.30.0 screenshots demonstrate an industrially standard layout workflow:

1. **Cell Hierarchy Tree (Left Panel):**
   - Displays the top-level cell (`carry_skip_adder`) referencing sub-blocks and primitive standard cells (`sky130_fd_sc_hd__*`).
   - Confirms that standard-cell geometries are linked via cell references (`SREF`), allowing KLayout to load full internal transistor diffusion, poly, contacts, and Metal 1 geometries.

2. **Layer List & Visibility (Right Panel):**
   - Shows active mask layers: `235/4 (prBoundary)`, `68/20 (met1)`, `69/20 (met2)`, `70/20 (met3)`, `66/20 (li1)`, `66/44 (diff)`, `68/44 (poly)`.
   - Toggle visibility checkmarks permit isolating metal routing layers from active transistor gates.

3. **Standard Cell Row Alignment (Center Viewport):**
   - Cells are arranged in discrete horizontal rows with back-to-back flipped rows (`N`, `FS`, `N`), allowing adjacent rows to share common VDD and VSS power distribution rails.

---

## 6. ACADEMIC & PHYSICAL DESIGN HONESTY DISCLOSURE

In accordance with strict academic integrity standards:

1. **Completed Milestones:**
   - Standard cell placement was successfully completed and validated.
   - Core and die boundaries (`prBoundary`) are correctly snapped to SkyWater 130nm rules.
   - Zero cell overlaps exist within the 9 rows.
   - Core utilization is 51.36%, providing a valid physical floorplan.
   - Complete 4.18 MB GDSII file was successfully generated and visually inspected in KLayout.

2. **Uncompleted Physical Design Stages (Explicitly Disclosed):**
   - **Detailed Routing:** Signal interconnects between standard cell pins (Metal 1 to Metal 2/3) were not routed with an automated router (such as TritonRoute). The layout contains placed standard cells and die boundaries, but not completed signal routing nets.
   - **Clock Tree Synthesis (CTS):** This is a purely combinational adder circuit; therefore, no clock tree or clock buffers were required or inserted.
   - **Signoff DRC (Design Rule Checking):** Standard cells are internally DRC clean from SkyWater foundry, but inter-cell DRC rules (such as well-tap proximity and antenna diode rules) have not been signoff-closed.
   - **Signoff LVS (Layout Versus Schematic):** Because detailed signal routing is uncompleted, full LVS extraction against the SPICE netlist cannot be run.
   - **Tapeout Readiness:** The GDSII is an **academic placement stream**, NOT a tapeout-ready fabrication package.

