# CYBERCORE 3D — COMPREHENSIVE VIVA QUESTION BANK & EXAMINER DEFENSE GUIDE
## Complete Questions, Detailed Answers, Equations & Defense Strategy
**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Target:** Engineering College Final Evaluation & External Examiner Viva Voce  
**Date:** November 2026  

---

## Category 1: Basic Digital Electronics & Arithmetic Concepts

### Q1: What is a Binary Adder, and why is it considered the foundation of digital computation?
- **Short Answer:** A digital circuit that calculates the arithmetic sum of binary numbers.
- **Detailed Answer:** Binary adders are the core operational units inside the Arithmetic Logic Unit (ALU) of modern microprocessors. Beyond simple addition, they perform subtraction (via 2's complement), multiplication (repeated add-and-shift or partial product accumulation), memory address calculation (program counter increments, pointer offsets), and branch condition evaluations.
- **Key Equation:** $\text{Sum} = A \oplus B \oplus Cin$; $C_{out} = (A \cdot B) + (B \cdot Cin) + (A \cdot Cin)$.

### Q2: What is the fundamental difference between a Half Adder and a Full Adder?
- **Answer:**
  - A **Half Adder** adds two 1-bit binary inputs ($A$ and $B$) and generates a Sum ($A \oplus B$) and Carry ($A \cdot B$). It has NO carry-in input and therefore cannot be cascaded into multi-bit addition.
  - A **Full Adder** adds three 1-bit inputs ($A$, $B$, and $Cin$). It accommodates an incoming carry from a lower bit position, allowing full adders to be cascaded to construct $N$-bit adders.

### Q3: What is "Carry Propagation" versus "Carry Generation"?
- **Bit Propagate ($P_i$):** $P_i = A_i \oplus B_i$. If $P_i = 1$, one input is 1 and the other is 0. An incoming carry $C_i$ will propagate through this stage to become $C_{i+1}$.
- **Bit Generate ($G_i$):** $G_i = A_i \cdot B_i$. If $G_i = 1$, both inputs are 1. This bit stage produces a carry-out independently of whether there was a carry-in ($C_{i+1} = 1$).
- **Carry Kill ($K_i$):** $K_i = \overline{A_i} \cdot \overline{B_i}$. Both inputs are 0. Any incoming carry is absorbed, producing $C_{i+1} = 0$.

---

## Category 2: Adder Architectures & Comparative Trade-offs

### Q4: Explain the Ripple Carry Adder (RCA) and its primary bottleneck.
- **Answer:** In an RCA, $N$ full adders are connected in series. The carry output of bit $i$ is wired directly to the carry input of bit $i+1$.
- **Bottleneck:** The worst-case delay scales linearly with bit width: $T_{RCA} = (N - 1) \cdot \tau_{carry} + \tau_{sum} = O(N)$. For 16 bits, the carry must traverse 15 intermediate full adders before the MSB sum can stabilize.

### Q5: How does the Carry Skip Adder (CSKA) achieve higher performance than RCA?
- **Answer:** CSKA partitions the $N$ bits into $M$ blocks of size $k$ (here $M=4, k=4$). For each 4-bit block, a 4-input AND gate evaluates the **group propagate** signal:
  $$P_{grp} = P_0 \cdot P_1 \cdot P_2 \cdot P_3$$
  If $P_{grp} = 1$, any carry entering the block is guaranteed to pass straight through. Instead of rippling through 4 full adders sequentially, the carry skips over the entire block through a 2:1 multiplexer in $O(1)$ multiplexer delay ($\approx 0.156\text{ ns}$). This bounds worst-case delay to $O(\sqrt{N})$.

### Q6: Compare CSKA with CLA (Carry Look-Ahead) and Brent-Kung.
- **RCA:** Smallest area, simplest wiring, slowest delay ($O(N)$).
- **CSKA:** Moderate area, simple linear wiring, intermediate delay ($O(\sqrt{N})$), lowest Area-Delay Product for small/medium widths.
- **CLA:** Fast delay ($O(\log N)$), but suffers from high fan-in/fan-out on higher-order generate/propagate logic, causing routing congestion and irregular silicon layout.
- **Brent-Kung:** Highly regular parallel prefix tree, very fast, but incurs higher standard-cell area and dynamic power overhead.

---

## Category 3: RTL Design & Functional Verification

### Q7: What is the purpose of an unconstrained Golden Behavioral Reference Model?
- **Answer:** In hardware verification, the circuit under test (DUT) is implemented with specific structural primitives (multiplexers, ripple chains). To guarantee that optimization bugs or netlist errors are caught, testbench outputs are compared against a golden mathematical model:
  $$\{C_{out}, SUM\} = A + B + Cin$$
  Because the reference model uses high-level arithmetic addition, it has zero structural dependencies on the DUT, ensuring unbiased defect detection.

### Q8: How many test vectors were executed, and what did they cover?
- **Answer:** Exactly **60,038 vectors** were simulated across 6 testbenches with **0 mismatches (100.0% pass rate)**:
  1. **14 Directed Corner Cases:** Zero addition, max overflow (`0xFFFF + 1`), maximum operands (`0xFFFF + 0xFFFF`), bit-boundary transitions.
  2. **Exhaustive Skip Bypass Vectors:** Forcing $P_{grp} = 1$ across multiple blocks to exercise multiplexer bypass paths (2,326 skip cycles activated).
  3. **10,000 Constrained Random Vectors:** Uniform pseudo-random distribution over 16-bit operands.

---

## Category 4: Logic Synthesis & Technology Mapping

### Q9: Why did flattened synthesis remove the 2:1 skip multiplexers?
- **CRITICAL EXAMINER TRAP:** Examiners love this question!
- **Answer:** When Yosys runs unconstrained synthesis (`flatten` pass) followed by Berkeley ABC technology mapping, ABC optimizes Boolean logic equations globally. The Carry Skip Adder's multiplexer equation:
  $$C_{out} = (P_{grp} \cdot C_{in}) + (\overline{P_{grp}} \cdot C_{ripple})$$
  has the exact same truth table as standard ripple addition. ABC minimizes the Boolean network into canonical **Majority-3 (`maj3_1`)** and **XNOR2 (`xnor2_1`)** cells, collapsing the multiplexers.
- **How We Solved It:** We performed **hierarchical synthesis** (`synth_cska_hier.ys` without flattening). This preserved the `carry_skip_block_4bit` sub-module boundaries, retaining all 4 `mux2_1` multiplexers and 4 `and4_1` gates (56 cells, 760.73 µm²).

### Q10: What is a Liberty (.lib) file?
- **Answer:** An industry-standard ASCII format (Synopsys Liberty) containing electrical and physical characterization data for every cell in a standard-cell library:
  - Input pin capacitance.
  - Non-linear delay lookup tables (NLDM) indexed by input transition slew and output load capacitance.
  - Dynamic internal switching power tables and static leakage power values.
  - Logical Boolean functions.
  We used `sky130_fd_sc_hd__tt_025C_1v80.lib` (Typical-Typical corner, 25°C, 1.80V).

---

## Category 5: Static Timing Analysis & Physical Design

### Q11: Is your 2.471 ns delay a measured post-route timing value?
- **EXAMINER DEFENSE (ACADEMIC HONESTY):**
- **Correct Answer:** "No, sir/ma'am. We strictly designate 2.471 ns as an **'Analytical hierarchical-netlist critical-path delay estimate'**. It is derived analytically by summing cell propagation delays from the SkyWater 130nm Liberty timing tables along the worst-case topological path. True post-route STA requires parasitic extraction (SPEF) after detailed metal routing, which was not executed due to native Windows OpenROAD tool constraints."

### Q12: Explain your physical design deliverables (DEF and GDSII).
- **Answer:**
  - **DEF (`cska_sky130.def`):** Defines a $45.0\text{ µm} \times 35.0\text{ µm}$ die ($1,575\text{ µm}^2$) with 9 standard-cell rows at a $2.72\text{ µm}$ pitch. All 48 standard cells from the synthesized netlist are placed at legal grid coordinates with 51.36% core utilization.
  - **GDSII (`cska_sky130.gds`):** A **4.18 MB** binary stream generated via KLayout's Pya engine containing 433 geometry instances on SkyWater 130nm reticle layers (diffusion, poly, local interconnect, Metal 1–3).
  - **Scope Limitation:** It is an authentic standard-cell placement stream; detailed signal routing and signoff DRC/LVS were not completed.

---

## Category 6: Project Design Decisions

### Q13: Why did you partition the 16-bit CSKA into 4-4-4-4 uniform blocks rather than variable block sizes?
- **Answer:** Uniform 4-bit blocks provide modular symmetry, identical sub-module layout, and ease of verification for an academic mini-project. However, in advanced commercial CSKAs, **variable block sizes** (e.g., 3-4-5-4 bits) are preferred. Because the carry ripples through Block 0 while earlier propagate signals are already being computed, widening the middle blocks equalizes the arrival times of ripple and skip signals, minimizing overall critical path latency. This is identified as our primary future improvement.

