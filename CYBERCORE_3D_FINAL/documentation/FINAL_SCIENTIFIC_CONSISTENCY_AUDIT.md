# FINAL SCIENTIFIC CONSISTENCY AUDIT
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Implementation  
**Technology:** Google / SkyWater 130nm CMOS (`sky130hd` and `sky130hs`)  
**Workspace:** `D:\mini project`  
**Parent Audits:**
- [`FINAL_TIMING_EVIDENCE_CORRECTION.md`](file:///d:/mini%20project/openroad_experiment/documentation/FINAL_TIMING_EVIDENCE_CORRECTION.md)
- [`FORMAL_CSKA_TIMING_VALIDATION.md`](file:///d:/mini%20project/openroad_experiment/documentation/FORMAL_CSKA_TIMING_VALIDATION.md)
- [`FINAL_PROJECT_REPORT.md`](file:///d:/mini%20project/documentation/FINAL_PROJECT_REPORT.md)  
**Date:** November 2026  
**Status:** **RIGOROUS SCIENTIFIC RECONCILIATION & UNIT CALIBRATION COMPLETE**

---

## 1. PATH SENSITIZATION AUDIT & BLOCK 3 / MUX 3 RESOLUTION

### 1.1 Discovery & Verification of the Block 3 MUX 3 Contradiction
A critical audit of the path to `Cout` that traversed:
$$\text{Block 0 (ripple)} \rightarrow \text{MUX 0 (A0)} \rightarrow \text{MUX 1 (A1 skip)} \rightarrow \text{MUX 2 (A1 skip)} \rightarrow \text{Block 3 (4 FAs ripple)} \rightarrow \mathbf{\text{MUX 3 (A0 ripple)}} \rightarrow Cout$$
reveals that **this path segment is mathematically unsensitizable in Block 3**, exactly like Blocks 1 and 2:

1. **Ripple propagation through Block 3:**  
   For a carry arriving at $c_{12}$ to ripple through all 4 full adders in Block 3 to $C\_ripple_3$, all 4 bits must propagate:
   $$P[12]=1 \land P[13]=1 \land P[14]=1 \land P[15]=1 \implies P\_group_3 = 1$$
2. **Multiplexer Selection in Block 3:**  
   The multiplexer selects pin `A0` ($C\_ripple_3$) **if and only if** $P\_group_3 = 0$.
3. **The Contradiction:**  
   $$\Phi_3 = (P\_group_3 = 1) \land (P\_group_3 = 0) \equiv \mathbf{FALSE}$$
   Therefore, a carry that originates at bit 0 and reaches $c_{12}$ **CANNOT** exit through MUX 3 pin `A0`.

### 1.2 The True Physically Sensitized Paths to `Cout`
There are only two valid, physically sensitizable paths to `Cout`:

* **Case 1: Carry from Bit 0 to Cout (Full Skip through Block 3):**  
  When $P\_group_3 = 1$, MUX 3 selects pin **`A1` (the skip input)**. The carry bypasses Block 3's adders directly to `Cout`!  
  - **Tool-Queried Delay (OpenSTA with post-route extracted RC parasitics from SPEF):** **1.8223 ns** (HS).  
  - **Stages:** 1 buf + 4 FAs (Block 0) + 1 MUX (Block 0 pin A0) + 3 skip MUXes (Blocks 1, 2, 3 pin A1) + 1 buf = **10 cell stages**.
* **Case 2: Carry Generated Within Block 3 to Cout:**  
  A carry generated at bit 12 ($A[12]=1, B[12]=1 \implies P[12]=0 \implies P\_group_3 = 0$) ripples through bits 13, 14, 15 to MUX 3 pin `A0`.  
  - **Tool-Queried Delay (OpenSTA with post-route extracted RC parasitics from SPEF):** **1.2523 ns** (HS).

### 1.3 The True Worst-Case Critical Path of the Entire CSKA: `SUM[15]`
Why is the path to **`SUM[15]`** completely exempt from this contradiction?
* The primary output **`SUM[15]`** is driven directly by the sum output of the 16th full adder:
  $$SUM[15] = A[15] \oplus B[15] \oplus c_{15}$$
* `SUM[15]` **does NOT traverse MUX 3**. It does not require $P\_group_3 = 0$ or $P\_group_3 = 1$.
* The carry generated at bit 0 ripples through Block 0, skips Block 1 ($A1$), skips Block 2 ($A1$), enters Block 3 at $c_{12}$, ripples through FA 12 ($CIN \rightarrow COUT$), FA 13 ($CIN \rightarrow COUT$), FA 14 ($CIN \rightarrow COUT$), and into FA 15 ($CIN \rightarrow SUM$).
* **Sensitization Conditions:**
  - Block 0: $A[0]=1, B[0]=1$ (generate), $P[3:1]=111 \implies P\_group_0 = 0$ (selects `A0`).
  - Block 1: $P[7:4]=1111 \implies P\_group_1 = 1$ (selects `A1` skip).
  - Block 2: $P[11:8]=1111 \implies P\_group_2 = 1$ (selects `A1` skip).
  - Block 3: $P[14:12]=111$ (propagate to bit 15), $P[15] \in \{0, 1\}$.
* **Satisfiability:** **100% SATISFIABLE & FUNCTIONALLY SENSITIZABLE** by Boolean derivation.
* **Post-Route Arrival Time (OpenSTA with post-route extracted RC parasitics from SPEF):**
  - **SKY130HS:** **2.6154 ns**
  - **SKY130HD:** **4.4489 ns**
* **Finding:** **`SUM[15]` is the true, undisputed critical timing path of the 16-bit Carry Skip Adder.**

---

## 2. RECONCILIATION OF FALSE-PATH & STA METHODOLOGY TERMINOLOGY

To ensure academic and professional precision:

1. **Topological Paths:** Traversed by unconstrained STA based purely on netlist graph connectivity, ignoring data-dependent gate sensitization ($4.38\text{ ns}$ HS / $7.67\text{ ns}$ HD).
2. **Boolean-Unsensitizable Segments:** Paths where the sensitization criteria of upstream gates contradict downstream multiplexer select criteria ($P \land \neg P \equiv 0$). In CSKA, this applies specifically to:
   - Entering any block's $Cin$, rippling through all 4 full adders, and exiting through that same block's MUX pin `A0`.
3. **Boolean-Sensitizable Paths:** Paths for which at least one input vector $(A, B, Cin)$ simultaneously satisfies all on-path arc sensitization conditions. The critical sensitizable path is $B[0] \rightarrow SUM[15]$ (**2.6154 ns** in HS).
4. **Constrained OpenSTA Reports:** OpenSTA runs using explicit topological through-point constraints (`-through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1]`) to evaluate the timing along the analytically derived sensitizable bypass arcs.  
   *Note: A constrained `-through` query alone evaluates delay along a specified topological route in the graph; it does not constitute an automated formal SAT/SMT path-sensitization proof.*
5. **Parasitic Extraction Terminology:** All post-route parasitic delays are derived from **`post-route extracted RC parasitics from SPEF`** (generated via OpenRCX rule-based extraction), not a 3D numerical Maxwell field-solver.

---

## 3. ENERGY & ENERGY-DELAY PRODUCT (EDP) RECALCULATION & UNIT CALIBRATION

### 3.1 Terminology & Physical Reality
- **Power Quantity:** The power values ($P$) are **vectorless average power estimates** from OpenSTA assuming default static switching probability ($\alpha = 0.5$ at $100\text{ MHz}$, $TT, 25^\circ\text{C}, 1.80\text{V}$).
- **Energy Metric:** $P \times T$ represents the **`Estimated energy consumed during one critical-path delay interval`**. It is NOT a measured dynamic energy-per-operation because vectorless average power and single-cycle critical-path propagation delay are different physical quantities.
- **EDP Metric:** Energy-Delay Product is defined as $EDP = P \times T^2 = (P \times T) \times T$.

### 3.2 Unit Calibration
Using $P$ in $\text{µW}$ ($10^{-6}\text{ W}$) and $T$ in $\text{ns}$ ($10^{-9}\text{ s}$):
$$P \times T = (10^{-6}\text{ W}) \times (10^{-9}\text{ s}) = 10^{-15}\text{ J} = 1\text{ fJ} = 0.001\text{ pJ}$$
$$EDP = P \times T^2 = (10^{-15}\text{ J}) \times (10^{-9}\text{ s}) = 10^{-24}\text{ J}\cdot\text{s} = 1\text{ fJ}\cdot\text{ns} = 0.001\text{ pJ}\cdot\text{ns}$$

Therefore, numerical values of $0.5547$, $0.9171$, $0.8966$, and $1.5755$ are expressed in **`pJ·ns`** (or equivalently as $554.7$, $917.1$, $896.6$, and $1575.5\text{ fJ}\cdot\text{ns}$).

### 3.3 Recalculated Master Table (Endpoint `SUM[15]`)

| Metric | CSKA (`sky130hs`) | RCA (`sky130hs`) | CSKA (`sky130hd`) | RCA (`sky130hd`) | Unit |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Critical Delay ($T$)** | **2.6154** | **3.8123** | **4.4489** | **6.7188** | $\text{ns}$ |
| **Total Power ($P$)** | **81.1** | **63.1** | **45.3** | **34.9** | $\text{µW}$ |
| **Estimated Energy per Interval ($P \times T$)** | **0.2121** (212.1) | **0.2406** (240.6) | **0.2015** (201.5) | **0.2345** (234.5) | $\text{pJ}$ ($\text{fJ}$) |
| **Interval Energy Comparison vs RCA** | **-11.85%** (Lower) | Baseline | **-14.07%** (Lower) | Baseline | Estimate from vectorless STA |
| **Energy-Delay Product ($P \times T^2$)** | **0.5547** (554.7) | **0.9171** (917.1) | **0.8966** (896.6) | **1.5755** (1575.5) | **`pJ·ns`** (`fJ·ns`) |
| **EDP Comparison vs RCA** | **-39.52%** (Superior) | Baseline | **-43.09%** (Superior) | Baseline | Lower is superior |
| **EDP in SI Units** | **$5.5475 \times 10^{-22}$** | $9.1707 \times 10^{-22}$ | **$8.9661 \times 10^{-22}$** | $1.5755 \times 10^{-21}$ | $\text{J}\cdot\text{s}$ |

---

## 4. POWER PROVENANCE REGISTER

The power figures are confirmed to have been extracted directly from **OpenSTA vectorless power reports** run on the finalized post-route DEF/SPEF:

| Parameter | CSKA (`sky130hs`) | RCA (`sky130hs`) | CSKA (`sky130hd`) | RCA (`sky130hd`) |
| :--- | :---: | :---: | :---: | :---: |
| **Internal Power** | $48.7\text{ µW}$ ($60.1\%$) | $38.2\text{ µW}$ ($60.5\%$) | $27.8\text{ µW}$ ($61.4\%$) | $21.6\text{ µW}$ ($61.9\%$) |
| **Switching Power** | $32.4\text{ µW}$ ($39.9\%$) | $24.9\text{ µW}$ ($39.5\%$) | $17.5\text{ µW}$ ($38.6\%$) | $13.3\text{ µW}$ ($38.1\%$) |
| **Leakage Power** | $13.6\text{ nW}$ ($0.0\%$) | $10.4\text{ nW}$ ($0.0\%$) | $8.2\text{ nW}$ ($0.0\%$) | $6.1\text{ nW}$ ($0.0\%$) |
| **Total Power** | **81.1 µW** | **63.1 µW** | **45.3 µW** | **34.9 µW** |
| **Activity Assumptions** | Default static probability ($\alpha = 0.5$ at $100\text{ MHz}$) | Same | Same | Same |
| **Operating PVT** | $TT, 25^\circ\text{C}, 1.80\text{V}$ | $TT, 25^\circ\text{C}, 1.80\text{V}$ | $TT, 25^\circ\text{C}, 1.80\text{V}$ | $TT, 25^\circ\text{C}, 1.80\text{V}$ |
| **Parasitics Source** | `6_final.spef` (post-route extracted RC) | `6_final.spef` | `6_final.spef` | `6_final.spef` |

---

## 5. CLAIMS SUITABLE FOR FINAL ACADEMIC PRESENTATION

1. **Critical Path Endpoint:**  
   *"The critical path of the 16-bit Carry Skip Adder terminates at **`SUM[15]`** with a post-route delay of **2.62 ns in SKY130HS** and **4.45 ns in SKY130HD**."*
2. **Speedup:**  
   *"Comparing the true critical `SUM[15]` endpoint under identical SDC constraints and post-route extracted RC parasitics, the Carry Skip Adder delivers a **31.4% speedup in SKY130HS** ($2.62\text{ ns}$ vs $3.81\text{ ns}$) and a **33.8% speedup in SKY130HD** ($4.45\text{ ns}$ vs $6.72\text{ ns}$) over the Ripple Carry Adder."*
3. **Energy Efficiency & EDP:**  
   *"While CSKA increases static area and switching power by ~28% due to bypass multiplexers, its ~32% speedup achieves an **11.8% to 14.1% reduction in estimated energy consumed during one critical-path interval** and a **39.5% to 43.1% superior Energy-Delay Product ($0.555\text{ pJ}\cdot\text{ns}$ vs $0.917\text{ pJ}\cdot\text{ns}$ in HS)**."*
4. **Physical Design Sign-off:**  
   *"The physical layout was streamed to GDSII with zero routing DRC violations and zero antenna violations in both high-speed and high-density 130nm standard cell libraries."*
