# COMPLETE PROJECT WORKFLOW & ENGINEERING LIFECYCLE

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Methodology:** 7-Stage Digital VLSI & ASIC Design Flow  
**Workspace:** `D:\mini project`  

---

## 1. ENGINEERING LIFECYCLE FLOWCHART

```
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: ARCHITECTURAL SPECIFICATION & EXPLORATION                    │
│ • Defined 16-bit operand width, 4x4 uniform block partitioning        │
│ • Formulated carry skip bypass criteria: P_grp = P3 · P2 · P1 · P0     │
│ • Benchmarked theoretical trade-offs: O(√N) delay vs O(N) RCA          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: VERILOG RTL DESIGN & IMPLEMENTATION                          │
│ • Created modular synthesizable modules (11 RTL files in rtl/)         │
│ • Implemented full_adder, carry_skip_block_4bit, carry_skip_adder     │
│ • Built comparative models: RCA, CLA, CSLA, and Brent-Kung            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: FUNCTIONAL VERIFICATION & TESTBENCH HARNESS                   │
│ • Designed 17-bit self-checking golden reference model                 │
│ • Executed 6 rigorous testbenches with Icarus Verilog v14.0            │
│ • Verified 60,038 total test vectors with 0 mismatches (100% pass)     │
│ • Dumped VCD waveforms for transition and carry chain debugging        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: LOGIC SYNTHESIS & TECHNOLOGY MAPPING                          │
│ • Targeted Google/SkyWater 130nm High-Density library (sky130_fd_sc_hd)│
│ • Ran Yosys 0.70 with Berkeley ABC technology mapper                   │
│ • Generated 7 gate-level netlists (flattened and hierarchical)         │
│ • Extracted exact cell counts, gate distributions, and cell areas      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 5: ASIC PHYSICAL DESIGN & GDSII STREAMING                       │
│ • Defined 45.0 µm x 35.0 µm die, 35.0 µm x 24.5 µm core cavity        │
│ • Created 9 alternating standard-cell rows (N / FS orientation)        │
│ • Generated standard-cell placement DEF (cska_sky130.def, 51.4% util)  │
│ • Streamed 4.18 MB binary GDSII via KLayout 0.30.12 Pya engine         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 6: POST-SYNTHESIS ANALYSIS & COMPARATIVE BENCHMARKING            │
│ • Calculated cell delays, dynamic switching power, and leakage         │
│ • Evaluated Area-Delay Product (ADP) across all 5 adder architectures   │
│ • Ran block size scalability study (2, 4, 8-bit blocks, up to 128-bit) │
│ • Generated 6 high-resolution publication charts with Matplotlib       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 7: 3D CYBERCORE PLATFORM & ACADEMIC DOCUMENTATION               │
│ • Built hardware-accelerated 3D semiconductor studio (Three.js/React)  │
│ • Implemented live Verilog simulation REST API (FastAPI / Uvicorn)     │
│ • Authored 8 comprehensive academic and verification markdown reports  │
│ • Packaged reproducible submission bundle with zero fabricated data    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DETAILED STAGE BREAKDOWNS

### Stage 1: Architectural Specification & Exploration
- **Objective:** Establish the mathematical and structural framework for a 16-bit Carry Skip Adder (CSKA).
- **Core Principle:** In standard Ripple Carry Adders (RCA), carry ripples through $N$ full adders sequentially, causing worst-case latency $T \propto N$. CSKA divides the $N$ bits into $M$ blocks of $k$ bits each ($16 = 4 \times 4$).
- **Bypass Condition:** If every full adder in a block produces a propagate signal ($P_i = A_i \oplus B_i = 1$), the group propagate $P_{grp} = P_3 \cdot P_2 \cdot P_1 \cdot P_0 = 1$. The block carry-in $C_{in,k}$ bypasses the 4-bit ripple chain entirely through a 2:1 multiplexer directly to $C_{out,k}$ in a single multiplexer delay.
- **Deliverables:** Architectural specifications and sizing equations.

### Stage 2: Verilog RTL Design & Implementation
- **Objective:** Code synthesizable, modular Verilog HDL architectures.
- **Key Modules Authored:**
  1. `rtl/half_adder.v` and `rtl/full_adder.v`: Gate-level primitives.
  2. `rtl/carry_skip_block_4bit.v`: 4 full adders, 4-input AND gate, 2:1 multiplexer.
  3. `rtl/carry_skip_adder.v`: Top-level 16-bit adder connecting 4 blocks in series.
  4. `rtl/parameterized_cska.v`: Parameterized Verilog for arbitrary bitwidths.
  5. `rtl/ripple_carry_adder.v`: Direct 16-bit RCA for baseline comparison.
  6. `rtl/carry_lookahead_adder.v`, `rtl/carry_select_adder.v`, `rtl/brent_kung_adder.v`: High-performance comparison baselines.

### Stage 3: Functional Verification & Testbench Harness
- **Objective:** 100% functional validation across all input scenarios.
- **Harness Architecture:** Every testbench instantiates the Device Under Test (DUT) alongside a 17-bit golden reference model ($C_{out}, Sum = A + B + C_{in}$).
- **Vector Space:**
  - Worst-Case Propagation: $A = \text{0xFFFF}, B = \text{0x0000}, C_{in} = 1$ (carries propagate through all 16 bits).
  - Alternating Patterns: $A = \text{0xAAAA}, B = \text{0x5555}, C_{in} = 1$ (all bit propagates active, exercises all 4 bypass multiplexers).
  - Zero/Overflow Vectors: $A = \text{0x0000}, B = \text{0x0000}$, $A = \text{0xFFFF}, B = \text{0xFFFF}$.
  - Randomized Exhaustive Batches: 10,000 pseudo-random vectors per testbench.
- **Empirical Pass Count:** Exactly **60,038 vectors** executed with **0 mismatches**.

### Stage 4: Logic Synthesis & Technology Mapping
- **Objective:** Translate RTL boolean abstractions into standard cell gates from the SkyWater 130nm High-Density library.
- **EDA Suite:** Yosys Open SYnthesis Suite with Berkeley ABC optimization engine.
- **Target PDK:** `sky130_fd_sc_hd__tt_025C_1v80.lib` (Nominal corner: Typical NMOS/Typical PMOS, 25°C, 1.80V VDD).
- **Dual Synthesis Evaluation:**
  - *Flattened Synthesis:* ABC flattens module hierarchy, performing global boolean Boolean optimization, resulting in 48 standard cells (440.42 µm² area).
  - *Hierarchical Synthesis:* Preserves the 4 4-bit block boundaries with dedicated multiplexers, resulting in 56 standard cells (760.73 µm² area).

### Stage 5: ASIC Physical Design & GDSII Streaming
- **Objective:** Floorplan, place standard cells, and stream binary GDSII layout.
- **Die Floorplanning:** Die dimensions set to 45.0 µm x 35.0 µm; active core set to 35.0 µm x 24.5 µm.
- **Row Construction:** 9 alternating rows (`N` and `FS` orientations) with 2.72 µm pitch.
- **Placement & Site Snapping:** Python placement engine assigns cells into rows with 0.46 µm site snapping, yielding 51.36% core utilization and 0 overlaps.
- **GDSII Streamout:** KLayout Pya scripting engine links `cska_sky130.def` with `sky130_fd_sc_hd.gds` to stream a 4.18 MB binary GDSII.

### Stage 6: Post-Synthesis Performance Analysis & Comparative Benchmarking
- **Objective:** Empirically quantify Area, Delay, Power, and Area-Delay Product (ADP).
- **Timing Modeling:** Critical paths modeled using Liberty non-linear cell delay parameters and load capacitances.
- **Power Modeling:** Dynamic switching power $P_{dyn} = \alpha C_{load} V^2 f$ at 100 MHz and static leakage power summation.
- **Architectural Trade-offs:** CSKA offers a balanced intermediate trade-off between the minimal area of RCA and the high speed of CLA/Brent-Kung.

### Stage 7: CyberCore 3D Platform & Academic Documentation
- **Objective:** Create an interactive, transparent, educational semiconductor lab.
- **Frontend:** Hardware-accelerated 3D semiconductor chip with realistic package, QFP gull-wing pins, multi-layer explosion, and live adder simulator.
- **Backend:** FastAPI REST API connecting browser inputs to local Verilog simulation engine.
- **Documentation:** 8 academic reports detailing software inventories, script catalogs, layout explanations, and examiner viva preparation.

