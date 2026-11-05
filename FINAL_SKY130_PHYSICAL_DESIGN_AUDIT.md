# CYBERCORE 3D — FINAL SKY130 PHYSICAL DESIGN AUDIT
## Physical Implementation, DEF Floorplanning and GDSII Mask Stream Audit
**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Foundry Target:** Google / SkyWater 130nm CMOS (`sky130_fd_sc_hd`)  
**Physical Design Directory:** `D:\mini project\physical_design\`  
**Audit Timestamp:** November 6, 2026  

---

## 1. Physical Design Deliverables Inventory & Dual Stream Declaration

> [!NOTE]
> **Dual Physical Layout Streams Available:**
> 1. **Hierarchical CSKA Stream (True Architecture):** [`physical_design/gds/cska_hier_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_hier_sky130.gds) and [`physical_design/placement/cska_hier_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_hier_sky130.def) — **56 cells**, **760.73 µm²**, preserving all 4 `mux2_1` and 4 `and4_1` bypass gates.
> 2. **Original Flattened Stream (RCA-Equivalent):** [`physical_design/gds/cska_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_sky130.gds) and [`physical_design/placement/cska_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_sky130.def) — **48 cells**, **440.42 µm²**, where ABC Boolean synthesis collapsed bypass gates into RCA majority carry gates.
>
> **Physical Design Status:** Standard-cell placement verified with KLayout macros; detailed routing (M1–M5) and signoff DRC/LVS were not completed in this academic flow.

## 1. Physical Design Deliverables Inventory

| File Path | File Format | Size | Description / Purpose |
|---|---|---|---|
| `physical_design/placement/cska_sky130.def` | ASCII DEF 5.8 | **3,643 bytes** | Placement DEF defining die/core area, rows, and cell coordinates |
| `physical_design/gds/cska_sky130.gds` | Binary GDSII Stream | **4,189,882 bytes (4.18 MB)** | Multi-mask physical layout stream containing 433 instances |
| `physical_design/sdc/cska_sky130.sdc` | Synopsys SDC | **746 bytes** | Timing constraints file specifying 100 MHz clock and I/O delays |
| `physical_design/reports/cska_placement_layout.png` | PNG Raster Image | **191,728 bytes** | Rendered visualization of cell placement rows |
| `synthesis/sky130_pdk/sky130_fd_sc_hd.tlef` | Technology LEF | **18,031 bytes** | Metal layers (M1–M5), pitch, spacing, and design rules |
| `synthesis/sky130_pdk/sky130_fd_sc_hd_merged.lef` | Standard Cell LEF | **2,258,431 bytes** | Macro boundaries and pin locations for standard cells |
| `synthesis/sky130_pdk/sky130hd.lyp` & `.lyt` | KLayout Tech | **259,751 bytes** | SkyWater 130nm layer properties and technology mapping |

---

## 2. Floorplan & Placement Specifications

- **Die Boundary:** $45.0\text{ µm} \times 35.0\text{ µm}$ (Total Die Area: $1,575.00\text{ µm}^2$)
- **Core Boundary:** $35.0\text{ µm} \times 24.5\text{ µm}$ (Core Area: $857.50\text{ µm}^2$)
- **Core Margins:** $5.0\text{ µm}$ horizontal, $5.44\text{ µm}$ vertical
- **Standard Cell Row Pitch:** $2.72\text{ µm}$ (SkyWater 130nm High-Density pitch)
- **Row Count:** 9 alternating rows (orientations `N` and `FS`)
- **Placed Standard Cells:** 48 cells (16 `sky130_fd_sc_hd__maj3_1`, 32 `sky130_fd_sc_hd__xnor2_1`)
- **Total Cell Area:** $440.42\text{ µm}^2$
- **Core Utilization:** $51.36\%$ ($440.42 / 857.50$)

---

## 3. GDSII Geometry & Cell Hierarchy Verification

Inspected via KLayout 0.30.0 Pya engine:
- **Top Cell Name:** `carry_skip_adder`
- **Total Cell Instances:** 433 geometry instances
- **Standard Cell Sub-Cells Instantiated:**
  - `sky130_fd_sc_hd__maj3_1` (Majority-3 Carry Cell)
  - `sky130_fd_sc_hd__xnor2_1` (XNOR2 Sum Cell)
- **Active Physical Layers:**
  - Layer 65/20: `diff` (Diffusion / Active)
  - Layer 66/20: `poly` (Polysilicon Gates)
  - Layer 67/20: `li1` (Local Interconnect)
  - Layer 68/20: `met1` (Metal-1 Power & Pins)
  - Layer 69/20: `met2` (Metal-2 Horizontal Interconnect)
  - Layer 70/20: `met3` (Metal-3 Power Stripes)
  - Layer 235/4: `prBoundary` (Die and Core Boundaries)

---

## 4. Physical Signoff Reality & Scope Boundary

| Physical Design Stage | Completed? | Verification Notes |
|---|---|---|
| **Die Floorplanning** | **YES** | Defined in DEF and GDSII (45 µm × 35 µm) |
| **Row Definition** | **YES** | 9 standard-cell rows with alternating site orientations |
| **Standard-Cell Placement** | **YES** | 48 cells placed without overlap at legal grid sites |
| **Power Distribution Grid** | **PARTIAL** | Power ring tracks generated; global power mesh unrouted |
| **Clock Tree Synthesis (CTS)** | **N/A** | Pure combinational adder; no sequential flip-flops present |
| **Detailed Signal Routing** | **NO** | Routing tracks unrouted due to Windows OpenROAD constraints |
| **Signoff DRC / LVS** | **NO** | Requires full routing before design rule checking |
| **Antenna Checking** | **NO** | Academic placement-only deliverable |

**Summary:** The GDSII deliverable is an authentic **standard-cell placement stream**. It must not be presented as a tapeout-ready routed silicon chip.

