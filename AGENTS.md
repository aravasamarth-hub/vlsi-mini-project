# CyberCore 3D VLSI Engineering Workspace Rules

This file governs all AI and engineering workflows within `D:\mini project`.

## 1. Primary Design & Technology Target
- **Primary Design Under Test (DUT):** 16-Bit Carry Skip Adder (CSKA).
- **Target Technology:** Google / SkyWater 130nm High-Density CMOS (`sky130_fd_sc_hd`).
- **Nominal Corner:** $TT, 25^\circ\text{C}, 1.80\text{V}$ (`sky130_fd_sc_hd__tt_025C_1v80.lib`).

## 2. Academic Integrity & Scientific Honesty
- **Verification Vector Standard:** The exact test count across all 6 testbenches is 60,038 vectors (100% pass rate). Never invent or hardcode simulated results.
- **Synthesis Distinction:**
  - Flattened synthesis collapses the architecture to 48 standard cells (majority-3 / xnor2 gates) via ABC optimization, eliminating explicit skip multiplexers.
  - Hierarchical synthesis preserves the 4 4-bit blocks with 4 FA, 1 AND4, and 1 2:1 MUX (56 cells total, 760.73 µm² area).
  - Both flattened and hierarchical netlists must be clearly documented.
- **Timing Terminology:** The hierarchical delay of 2.471 ns is an **"Analytical hierarchical-netlist critical-path delay estimate"** derived from Liberty cell lookup tables and analytical topological equations. Never call it measured post-route timing without SPEF back-annotation.
- **Physical Design Reality:** `cska_sky130.gds` is an academic standard-cell placement stream. Detailed routing, clock tree synthesis (CTS), and signoff DRC/LVS were NOT completed. Layouts must be accurately described as placement-only.

## 3. Engineering Quality Lifecycle
Follow the standard 5-step engineering lifecycle for all coding tasks:
`Plan` -> `Implement` -> `Test` -> `Review` -> `Report`

## 4. Preservation & Safety
Explicit user consent is mandatory for:
- Destructive Git operations (`git reset --hard`, `git push -f`).
- Deleting core RTL, synthesis outputs, DEF/GDSII files, or verification logs.
- Modifying host system security or modifying files outside `D:\mini project`.
