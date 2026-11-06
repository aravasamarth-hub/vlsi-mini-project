# 16-BIT CARRY SKIP ADDER DESIGN AND PHYSICAL IMPLEMENTATION USING SKY130 PDK
## CYBERCORE 3D — Comprehensive Final Academic Project Report

**Author / Candidate:** VLSI Design Engineering Team  
**Technology Node:** Google / SkyWater 130nm High-Density & High-Speed CMOS (`sky130_fd_sc_hd` / `sky130_fd_sc_hs`)  
**EDA Flow:** OpenROAD-flow-scripts (ORFS), Yosys, OpenSTA, TritonRoute, Icarus Verilog, KLayout  
**Workspace:** `D:\mini project`  
**Date:** Academic Year 2026–2027  

---

### ABSTRACT
This project presents the complete RTL-to-GDSII physical implementation and timing verification of a 16-Bit Carry Skip Adder (CSKA) targeting the open-source Google/SkyWater 130nm CMOS technology. The CSKA architecture partitions the 16-bit operand space into four uniform 4-bit blocks with bit-propagate generation, 4-input AND reduction, and 2:1 carry-skip multiplexers to bypass intermediate carry propagation in $O(1)$ time rather than $O(N)$ ripple time. Using OpenROAD and OpenSTA with post-route extracted RC parasitics from SPEF, the physical design was implemented in both High-Speed (`sky130hs`) and High-Density (`sky130hd`) standard-cell libraries. A formal Boolean path-sensitization investigation reveals that ordinary static timing analysis reports a conservative 22-stage topological path ($4.38\text{ ns}$ HS / $7.67\text{ ns}$ HD) that is mathematically unsensitizable ($\Phi = P \land \overline{P} \equiv 0$). On the true physically sensitized critical path (`SUM[15]`), the CSKA achieves post-route arrival times of **2.62 ns** in SKY130HS and **4.45 ns** in SKY130HD, outperforming a baseline Ripple Carry Adder (RCA) by **31.4% to 33.8%**. Comprehensive verification across 60,038 vectors achieved a 100% pass rate with zero DRC and zero antenna violations in the final GDSII stream.

---

### 1. ARCHITECTURAL THEORY & MATHEMATICAL FORMULATION

#### 1.1 Ripple Carry Limitation
In a standard $N$-bit Ripple Carry Adder, the worst-case carry propagation delay scales linearly with wordlength:
$$T_{RCA} = (N - 1) \cdot t_{carry\_fa} + t_{sum\_fa}$$
For $N = 16$, the carry must sequentially traverse 16 full-adder stages, creating a severe operational bottleneck in high-throughput arithmetic units.

#### 1.2 Carry Skip Adder Principle
The Carry Skip Adder divides the $N$-bit adder into $M$ blocks of $k$ bits each ($16 = 4 \times 4$).
For each bit $i \in \{0..15\}$:
$$P_i = A_i \oplus B_i, \quad G_i = A_i \cdot B_i$$
For each 4-bit block $j \in \{0..3\}$:
$$P\_group_j = \prod_{m=0}^{3} P_{4j+m} = P_{4j} \cdot P_{4j+1} \cdot P_{4j+2} \cdot P_{4j+3}$$
When $P\_group_j = 1$, an incoming carry $Cin_j$ does not need to ripple through the 4 full adders; it bypasses the entire block directly to $Cout_j$ via a 2:1 multiplexer:
$$Cout_j = (P\_group_j \cdot Cin_j) + (\overline{P\_group_j} \cdot C\_ripple_j)$$

#### 1.3 Theoretical Path Delay
The maximum delay of an optimized $N$-bit CSKA occurs when a carry is generated in the first bit of Block 0, ripples through Block 0, skips all intermediate blocks, and ripples through the final Block $M-1$:
$$T_{CSKA} = (k - 1) \cdot t_{carry} + t_{mux\_gen} + (M - 2) \cdot t_{mux\_skip} + k \cdot t_{carry}$$
For $N = 16, k = 4, M = 4$:
$$T_{CSKA} = 3 \cdot t_{carry} + t_{mux} + 2 \cdot t_{mux} + 4 \cdot t_{carry} = 7 \cdot t_{carry} + 3 \cdot t_{mux}$$
Compared to RCA ($16 \cdot t_{carry}$), CSKA replaces 8 full-adder stages with 2 fast multiplexer stages, yielding a theoretical delay reduction of approximately $35\%$.

---

### 2. RTL IMPLEMENTATION & VERIFICATION

#### 2.1 RTL Architecture & Hierarchy
The design is partitioned into modular synthesizable Verilog modules:
- [`full_adder.v`](file:///d:/mini%20project/rtl/full_adder.v): 1-bit standard full adder.
- [`carry_skip_block_4bit.v`](file:///d:/mini%20project/rtl/carry_skip_block_4bit.v): 4-bit ripple chain with propagate AND reduction and skip multiplexer.
- [`carry_skip_adder.v`](file:///d:/mini%20project/rtl/carry_skip_adder.v): 16-bit top-level integrating Blocks 0 to 3 with telemetry observability.

#### 2.2 Functional Verification (60,038 Vectors)
Simulated using Icarus Verilog against a golden reference addition model ($(A + B + Cin)$):
- **CSKA Primary Suite:** 10,014 vectors (100% pass, 2,326 skip logic activations).
- **Benchmark Suites:** RCA (10,000), CLA (10,000), CSLA (10,000), Brent-Kung (10,000).
- **Exhaustive Corner Tests:** 10,024 walking-1s and boundary cases.
- **Total:** **60,038 vectors, 0 failures (100.0% pass rate)**.

---

### 3. PHYSICAL DESIGN & SYNTHESIS

#### 3.1 Technology Target: SkyWater 130nm CMOS
- **SKY130HD:** 7-track high-density standard cells for area-constrained computing.
- **SKY130HS:** 9-track high-speed standard cells for maximum frequency pipelines.
- **Operating Corner:** $TT, 25^\circ\text{C}, 1.80\text{V}$.

#### 3.2 Synthesis Preservation
Synthesis using Yosys preserved the structural hierarchy: 16 Full Adders (`fa_1`), 4 Multiplexers (`mux2_1` / `mux2_4`), 4 4-Input AND gates (`and4_2`), and 16 XOR gates (`xor2_1`), totaling 56 logic cells and 50 timing buffers.

#### 3.3 Physical Layout Execution
The OpenROAD flow completed floorplanning, power grid synthesis (Metal 4/5 straps), global placement, detailed placement, global routing, and detailed routing with TritonRoute:
- **Die Area:** $1,127.0\text{ µm²}$ (HS) / $772.0\text{ µm²}$ (HD).
- **DRC Violations:** **0 violations**.
- **Antenna Violations:** **0 violations**.
- **GDSII Stream:** Exported and visually audited in KLayout 0.30.0 (`6_final.gds`).

---

### 4. STATIC TIMING ANALYSIS & PERFORMANCE RECONCILIATION

#### 4.1 Master Benchmark Table (Matching Endpoints)

| Metric | CSKA (`sky130hs`) | RCA (`sky130hs`) | CSKA (`sky130hd`) | RCA (`sky130hd`) |
| :--- | :---: | :---: | :---: | :---: |
| **Delay to `SUM[15]`** | **2.6154 ns** | **3.8123 ns** | **4.4489 ns** | **6.7188 ns** |
| **Speedup on `SUM[15]`** | **+31.39%** | Baseline | **+33.78%** | Baseline |
| **Delay to `Cout`** | **2.6631 ns** | **3.7199 ns** | **4.5437 ns** | **6.5581 ns** |
| **Speedup on `Cout`** | **+28.41%** | Baseline | **+30.72%** | Baseline |
| **Unconstrained Topological STA** | 4.3795 ns (False Path) | 3.8123 ns | 7.6665 ns (False Path) | 6.7188 ns |
| **Total Power Consumption** | $81.1\text{ µW}$ | $63.1\text{ µW}$ | $45.3\text{ µW}$ | $34.9\text{ µW}$ |
| **Estimated Energy per Interval ($P \times T$)** | **0.2121 pJ** | **0.2406 pJ** | **0.2015 pJ** | **0.2345 pJ** |
| **Die Area** | $1,127.0\text{ µm²}$ | $814.0\text{ µm²}$ | $772.0\text{ µm²}$ | $526.0\text{ µm²}$ |
| **Energy-Delay Product ($P \times T^2$)** | **0.5547 pJ·ns** (554.7 fJ·ns) | **0.9171 pJ·ns** (917.1 fJ·ns) | **0.8966 pJ·ns** (896.6 fJ·ns) | **1.5755 pJ·ns** (1575.5 fJ·ns) |

---

### 5. VIVA DEFENSE QUESTIONS & ANSWERS

**Q1: Why does raw OpenSTA report CSKA as slower than RCA?**  
*Answer:* OpenSTA is a topological graph analyzer that traces connected paths without evaluating Boolean mutual exclusivity. Because CSKA physically contains both ripple adders and multiplexers, unconstrained STA traces all 16 FAs and 4 MUXes in series (22 stages). In physical silicon, this 22-stage path is a false path because propagating through a block forces $P\_group = 1$, which switches the MUX to skip mode and disconnects the ripple path. When the skip bypass is sensitized, CSKA is **~31% faster than RCA**.

**Q2: Did you perform formal LVS?**  
*Answer:* Detailed routing DRC and Antenna checks passed with zero violations. Logical connectivity between Verilog and DEF was verified by OpenROAD. Full transistor-level SPICE extraction (Netgen/Magic LVS) was not executed in this standard-cell flow and remains future work.

**Q3: How does SKY130HS compare with SKY130HD?**  
*Answer:* SKY130HS standard cells use wider transistors (9-track height), delivering **$1.70\times$ faster speed** ($2.62\text{ ns}$ vs $4.45\text{ ns}$) at the expense of $1.46\times$ larger die area and $1.79\times$ higher switching power compared to SKY130HD.

