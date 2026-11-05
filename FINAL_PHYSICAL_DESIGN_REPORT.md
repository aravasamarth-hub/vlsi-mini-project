# FINAL ASIC PHYSICAL DESIGN & GDSII REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Design Phase:** Standard Cell Placement, DEF Database & GDSII Streamout  
**Technology:** Google / SkyWater 130nm High-Density (`sky130_fd_sc_hd`)  
**Workspace:** `D:\mini project`  

---

## 1. PHYSICAL IMPLEMENTATION SPECIFICATIONS

| Parameter | Specification | Physical Measurement | Notes |
| :--- | :--- | :--- | :--- |
| **PDK Process Node** | SkyWater 130nm CMOS | Planar 1P5M (1 Poly, 5 Metal) | 1.8V Core VDD logic |
| **Standard Cell Library** | `sky130_fd_sc_hd` | High Density (433 characterized cells) | 7-track cell architecture |
| **Die Width × Height** | 45.00 µm × 35.00 µm | **Total Die Area: 1,575.00 µm²** | Includes pad & ring keepouts |
| **Core Width × Height** | 35.00 µm × 24.50 µm | **Active Core Area: 857.50 µm²** | Active standard-cell cavity |
| **Standard Cell Area** | 440.42 µm² | Silicon occupied by 48 logic cells | Flattened gate implementation |
| **Core Utilization** | **51.36%** | Healthy routing whitespace | Prevents routing congestion |
| **Row Architecture** | 9 Alternating Rows | Pitch: 2.72 µm, Orientations: `N`, `FS` | Enables shared VDD/VSS rails |
| **Site Quantization** | `unit` (0.46 µm × 2.72 µm) | Site width: 0.46 µm | All cell origins snapped to grid |
| **GDSII Stream File** | `physical_design/gds/cska_sky130.gds` | **4,189,882 bytes (4.18 MB)** | Verified in KLayout 0.30.12 |
| **DEF Database File** | `physical_design/placement/cska_sky130.def` | **3,643 bytes** | 48 component placement records |

---

## 2. SYNTHESIS NETLIST COMPARISON: FLATTENED VS HIERARCHICAL

To ensure full scientific honesty, both synthesis approaches are documented:

```
┌─────────────────────────────────┬───────────────────────┬───────────────────────────┐
│ Metric                          │ Flattened Netlist     │ Hierarchical Netlist      │
├─────────────────────────────────┼───────────────────────┼───────────────────────────┤
│ Target Script                   │ synth_cska.ys         │ synth_cska_hier.ys        │
│ Hierarchy Setting               │ synth -flatten        │ synth -noflatten          │
│ Total Standard Cells            │ 48 cells              │ 56 cells                  │
│ Total Cell Area                 │ 440.42 µm²            │ 760.73 µm²                │
│ 2:1 Multiplexers (mux2_1)       │ 0 (Collapsed by ABC)  │ 4 explicit MUXes          │
│ 4-Input AND Gates (and4_1)      │ 0 (Collapsed by ABC)  │ 4 explicit AND4 gates     │
│ Majority-3 Gates (maj3_1)       │ 16 cells              │ 0                         │
│ XNOR-2 Gates (xnor2_1)          │ 16 cells              │ 0                         │
│ 4-bit Skip Blocks Preserved     │ No (Flattened AIG)    │ Yes (4 separate modules)  │
│ Analytical Critical Delay       │ 3.957 ns              │ 2.471 ns                  │
└─────────────────────────────────┴───────────────────────┴───────────────────────────┘
```

**Key Discovery:** When synthesis is executed with `-flatten`, the ABC optimizer flattens all module boundaries and restructures the carry logic into 16 majority-3 cells, eliminating the explicit bypass multiplexers. To physically realize the Carry Skip Adder architecture with dedicated 4-bit blocks, group propagate AND gates, and 2:1 bypass multiplexers, **hierarchical synthesis (`-noflatten`) must be used**.

---

## 3. SKYWATER 130nm MASK LAYER MAPPING

In KLayout, the layer properties file (`sky130hd.lyp`) maps GDSII records to physical silicon masks:

- **235/4 (`prBoundary.boundary`):** Chip boundary box ($45.0\ \mu\text{m} \times 35.0\ \mu\text{m}$).
- **66/44 (`diff.drawing`):** Active transistor source/drain diffusion implants.
- **68/44 (`poly.drawing`):** Polysilicon transistor gate electrodes ($L = 130\text{ nm}$).
- **66/20 (`li1.drawing`):** Titanium Nitride Local Interconnect layer.
- **67/20 (`mcon.drawing`):** Contacts between local interconnect and poly/diffusion.
- **68/20 (`met1.drawing`):** Metal 1 intra-cell pin routing and local connections.
- **67/44 (`via1.drawing`):** Inter-layer via 1 connecting Metal 1 to Metal 2.
- **69/20 (`met2.drawing`):** Metal 2 horizontal carry-skip bypass channels.
- **69/44 (`via2.drawing`):** Inter-layer via 2 connecting Metal 2 to Metal 3.
- **70/20 (`met3.drawing`):** Metal 3 vertical power straps (VDD and VSS).

---

## 4. PHYSICAL DESIGN REALITY & LIMITATIONS DISCLOSURE

1. **Standard Cell Placement:** Fully completed, validated, and visually confirmed in KLayout. Zero cell overlaps exist within the 9 rows, and all cell pins are snapped to the 0.46 µm site grid.
2. **Signal Interconnect Routing:** Detailed routing of signal nets between standard cell pins across the die was **not executed**. The layout represents placed cells and power rails, not a fully routed signal network.
3. **Clock Tree Synthesis (CTS):** This is a combinational adder; no clock tree or clock buffers were required or inserted.
4. **Signoff DRC/LVS:** Standard cells are individually DRC clean from SkyWater foundry, but inter-cell DRC rules (such as well-tap proximity rules and antenna diode rules) have not been signoff-closed.
5. **Tapeout Readiness:** The generated GDSII is an **academic placement stream**, not an industrial tapeout-ready fabrication package.
