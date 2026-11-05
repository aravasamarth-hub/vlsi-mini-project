# CYBERCORE 3D — COLLEGE SEMINAR PRESENTATION CONTENT
## 21-Slide Complete Academic Seminar Slide Deck & Speaker Notes
**Project:** 16-Bit Carry Skip Adder (CSKA) Using SkyWater 130nm PDK  
**Target Audience:** Engineering Faculty, External Viva Examiners, VLSI Researchers  
**Date:** November 2026  

---

### Slide 1: Title & Identity
- **Title:** 16-BIT CARRY SKIP ADDER DESIGN USING SKYWATER 130NM PDK
- **Subtitle:** Design, RTL Verification, Logic Synthesis, and Physical Implementation
- **Presenter:** Digital VLSI Engineering Mini-Project
- **Speaker Notes:** "Good morning, respected members of the evaluation committee. Today, I am presenting our work on designing, verifying, synthesizing, and physically implementing an industrially sound 16-bit Carry Skip Adder using the open-source Google/SkyWater 130nm CMOS high-density library."

### Slide 2: Introduction & Motivation
- **Key Points:**
  - Addition is the fundamental arithmetic building block in modern processor ALUs, DSPs, and GPU compute units.
  - In a standard Ripple Carry Adder, the worst-case carry propagation scales linearly $O(N)$ with word length.
  - At 16 bits, waiting for 15 cascaded full adders creates a critical-path timing bottleneck.
- **Speaker Notes:** "Arithmetic units form the heartbeat of CPU execution engines. However, the cascading ripple carry chain severely restricts maximum operating clock frequencies."

### Slide 3: Problem Statement
- **Key Points:**
  - Ripple Carry Adder (RCA): Minimal silicon area, but slowest propagation delay ($O(N)$).
  - Carry Look-Ahead Adder (CLA): Fast ($O(\log N)$), but suffers from severe fan-in/fan-out routing congestion and quadratic gate area growth.
  - Need: A balanced architecture providing significant delay reduction without excessive area or wiring complexity.
- **Speaker Notes:** "The engineering challenge is finding the optimal Area-Delay Product. Classical CLAs become wiring nightmares, while RCAs are too sluggish."

### Slide 4: Proposed Solution — 16-Bit Carry Skip Adder
- **Key Points:**
  - Partitions the 16-bit operand into four 4-bit uniform blocks (4-4-4-4).
  - Bypasses intermediate ripple chains in $O(1)$ multiplexer delay whenever all bits in a block propagate a carry.
  - Achieves $O(\sqrt{N})$ delay complexity.
- **Speaker Notes:** "The Carry Skip Adder introduces express bypass lanes. When all bits in a block propagate, incoming carry skips the entire 4-bit block in a single 2:1 multiplexer delay."

### Slide 5: Mathematical & Boolean Formulations
- **Key Equations:**
  - Bit Propagate: $P_i = A_i \oplus B_i$
  - Bit Generate: $G_i = A_i \cdot B_i$
  - Group Propagate: $P_{group,j} = P_{4j+3} \cdot P_{4j+2} \cdot P_{4j+1} \cdot P_{4j}$
  - Carry Skip Selection: $C_{out,j} = P_{group,j} ? C_{in,j} : C_{ripple,j}$
- **Speaker Notes:** "The group propagate signal is evaluated by a simple 4-input AND gate. If $P_{group}$ is high, the 2:1 multiplexer routes the input carry directly to the block output."

### Slide 6: Block Diagram & Architecture
- **Structure:**
  - Block 0: Bits $[3:0]$
  - Block 1: Bits $[7:4]$
  - Block 2: Bits $[11:8]$
  - Block 3: Bits $[15:12]$
- **Speaker Notes:** "Here is the top-level block diagram. Each block consists of 4 Full Adders, an AND4 gate, and a 2:1 multiplexer."

### Slide 7: Synthesizable Verilog RTL Design
- **Modules:**
  - `full_adder.v`: 1-bit primitive evaluating sum and carry.
  - `carry_skip_block_4bit.v`: 4-bit block with propagate and bypass logic.
  - `carry_skip_adder.v`: Top-level 16-bit cascading module.
  - Strict IEEE 1364-2005 compliance; zero inferred latches.
- **Speaker Notes:** "Our RTL is written in modular, synthesizable Verilog. Every intermediate block carry is explicitly defined and cleanly driven."

### Slide 8: Verification Strategy & Golden Reference Model
- **Reference Model:** `common_reference_model.v` evaluating $\{C_{out}, SUM\} = A + B + C_{in}$.
- **Harness:** Automated comparison checking every bit position at every clock step.
- **Exit Code:** Non-zero exit code triggered on any mismatch.
- **Speaker Notes:** "To ensure absolute correctness, every simulation vector was verified against an unconstrained 17-bit behavioral golden reference model."

### Slide 9: Functional Simulation Results (60,038 Vectors)
- **Results:**
  - `testbench_cska.v`: 10,014 vectors (100% Pass).
  - `testbench_all.v`: 10,000 vectors across 5 adders (100% Pass).
  - Individual adders (RCA, CLA, CSLA, BK): 10,006 vectors each (100% Pass).
  - **Total:** 60,038 vectors executed with 0 mismatches.
- **Speaker Notes:** "Over 60,000 simulation vectors were executed using Icarus Verilog, covering directed corner cases, skip bypass conditions, and random stress testing."

### Slide 10: GTKWave Waveform Analysis
- **Waveform Inspection:**
  - Displays $A$, $B$, $Cin$, $SUM$, $Cout$, $P_{group}[3:0]$, and $Skip\_active[3:0]$.
  - Confirms carry skipping from Block 0 input to Block 3 output in a single step when $P_{grp} = 1111_2$.
- **Speaker Notes:** "This waveform shows $A = 0xAAAA$ and $B = 0x5555$ with $Cin = 1$. All four group propagate signals assert simultaneously, skipping the carry across the entire word."

### Slide 11: Logic Synthesis Methodology (Yosys + ABC)
- **Target PDK:** SkyWater 130nm HD standard cells (`sky130_fd_sc_hd`).
- **Nominal Corner:** TT, 25°C, 1.80V.
- **Tools:** Yosys 0.49 Open SYNThesis Suite with Berkeley ABC technology mapping.
- **Speaker Notes:** "Logic synthesis was performed using Yosys targeting SkyWater 130nm high-density cells using the official foundry Liberty timing models."

### Slide 12: Discovery: Flattened vs. Hierarchical Synthesis
- **Flattened Synthesis:** ABC Boolean logic optimization collapses bypass multiplexers into 16 `maj3_1` and 32 `xnor2_1` cells (48 cells, 440.42 µm²).
- **Hierarchical Synthesis:** Preserving block hierarchy retains all 4 `mux2_1` and 4 `and4_1` gates (56 cells, 760.73 µm²).
- **Speaker Notes:** "An essential finding: without preserving hierarchy, Boolean logic optimization removes the multiplexers because an adder's overall truth table is invariant. Hierarchical synthesis preserves the physical bypass gates."

### Slide 13: Comparative PPA Benchmark
- **Table:**
  - RCA: 540.52 µm² | 4.240 ns | 0.117 mW | ADP: 2291.8 µm²·ns
  - CSKA (Hier): **760.73 µm² | 2.471 ns | 0.122 mW | ADP: 1879.8 µm²·ns (+41.7% speedup)**
  - CLA: 479.21 µm² | 0.880 ns | 0.151 mW | ADP: 421.7 µm²·ns
  - CSLA: 440.42 µm² | 1.540 ns | 0.156 mW | ADP: 678.3 µm²·ns
  - Brent-Kung: 506.74 µm² | 1.180 ns | 0.165 mW | ADP: 598.0 µm²·ns
- **Speaker Notes:** "CSKA provides a 41.7% delay reduction over RCA with minimal power increase, achieving a lower Area-Delay Product than RCA."

### Slide 14: Timing Analysis Reality
- **Critical Path:** 2.471 ns.
- **Classification:** "Analytical hierarchical-netlist critical-path delay estimate" derived from SkyWater Liberty cell lookup tables.
- **Transparency:** Post-route STA with SPEF parasitic extraction was not run.
- **Speaker Notes:** "We uphold scientific honesty: the 2.471 ns figure is derived analytically from Liberty cell characterization tables, not from post-route parasitic extraction."

### Slide 15: Physical Implementation & Floorplanning
- **Die Dimensions:** 45.0 µm × 35.0 µm (1,575 µm² total area).
- **Core Dimensions:** 35.0 µm × 24.5 µm (857.5 µm² core area).
- **Row Architecture:** 9 alternating rows (N and FS orientations) with 2.72 µm standard cell pitch.
- **Utilization:** 51.36% core utilization.
- **Deliverable:** `layout/cska_sky130.def`.
- **Speaker Notes:** "Our floorplan places the 48 standard cells into 9 legal rows with 51.4% core utilization, matching the standard cell grid."

### Slide 16: Mask Generation & GDSII Stream
- **File:** `layout/cska_sky130.gds` (4.18 MB, 433 geometry instances).
- **Engine:** KLayout 0.30.0 Pya engine merging standard-cell macro polygons.
- **Layers:** Active diffusion (65/20), poly gates (66/20), local interconnect (67/20), and Metal 1–3.
- **Scope Boundary:** Academic standard-cell placement stream (unrouted).
- **Speaker Notes:** "Using KLayout's Pya engine, we generated an authentic 4.18 MB GDSII layout containing 433 instances mapped to SkyWater 130nm reticle layers."

### Slide 17: CyberCore 3D Web Visualization Platform
- **Technology:** React 18, TypeScript, Three.js, React Three Fiber, Tailwind CSS.
- **Features:** 40-pin metallic QFP package, 7 exploded semiconductor layers, animated photon carry pulses, smooth orbit controls with damping.
- **Live Demo URL:** `http://localhost:3000`.
- **Speaker Notes:** "To make the project accessible and interactive, we engineered CyberCore 3D—a WebGL platform allowing real-time exploration of the chip architecture."

### Slide 18: FastAPI REST Backend & Live Simulation
- **Daemon:** FastAPI service running on port 8000.
- **Endpoints:** Live HDL simulation trigger (`/api/simulate`), health check, PPA telemetry.
- **Test Automation:** 7/7 automated Pytest test assertions passing.
- **Speaker Notes:** "The web interface communicates with a Python FastAPI backend that can invoke the underlying Verilog simulation engine in real time."

### Slide 19: Limitations & Technical Transparency
- **Documented Boundaries:**
  - Placement-only physical layout (detailed routing and CTS were not completed).
  - Signoff DRC/LVS was not run.
  - Delay is analytical pre-route Liberty estimation.
- **Speaker Notes:** "As rigorous engineers, we clearly document what is completed and what remains future work: detailed signal routing and signoff DRC/LVS require specialized Linux EDA environments."

### Slide 20: Future Scope & Roadmap
- **Next Steps:**
  - Execute full detailed routing and signoff DRC/LVS using OpenROAD on Linux/WSL2.
  - Implement variable block sizes (e.g., 3-4-5-4 bits) for further critical-path delay optimization.
  - Perform SPEF parasitic extraction for post-route static timing analysis.
- **Speaker Notes:** "In the next revision, we plan to implement variable block sizing to equalize ripple and skip arrival times, and complete post-route STA in OpenROAD."

### Slide 21: Conclusion & Project Deliverables
- **Summary:**
  - 5 synthesizable Verilog adders completed.
  - 60,038 verified simulation vectors (100% Pass rate).
  - Yosys synthesis mapping to SkyWater 130nm HD standard cells.
  - 4.18 MB GDSII binary placement layout stream.
  - Full-stack web application + 21 MB release package.
- **Speaker Notes:** "In conclusion, the CYBERCORE 3D project delivers an end-to-end, scientifically verified VLSI design flow. Thank you, and I invite your questions."

