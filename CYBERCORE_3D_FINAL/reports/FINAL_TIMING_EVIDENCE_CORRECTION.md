# FINAL TIMING EVIDENCE CORRECTION & RECONCILIATION AUDIT
**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Design  
**Technology:** SkyWater 130nm CMOS (`sky130hd` and `sky130hs`)  
**Workspace:** `D:\mini project`  
**Parent Audits:**
- [`INDEPENDENT_OPENROAD_EVIDENCE_AUDIT.md`](file:///d:/mini%20project/openroad_experiment/documentation/INDEPENDENT_OPENROAD_EVIDENCE_AUDIT.md)
- [`CSKA_CRITICAL_PATH_SENSITIZATION_AUDIT.md`](file:///d:/mini%20project/openroad_experiment/documentation/CSKA_CRITICAL_PATH_SENSITIZATION_AUDIT.md)
- [`FORMAL_CSKA_TIMING_VALIDATION.md`](file:///d:/mini%20project/openroad_experiment/documentation/FORMAL_CSKA_TIMING_VALIDATION.md)  
**Date:** November 2026  
**Status:** **AUDITED, RECONCILED & EMPIRICALLY GROUNDED**

---

## 1. TIMING CALCULATION METHODOLOGY & TOOL PROVENANCE

### 1.1 Origin of the Sensitized Timing Values
The values reported in earlier audit updates:
- **SKY130HS CSKA:** $2.6631\text{ ns}$ (to `Cout`) and $2.6154\text{ ns}$ (to `SUM[15]`)
- **SKY130HD CSKA:** $4.5437\text{ ns}$ (to `Cout`) and $4.4489\text{ ns}$ (to `SUM[15]`)

**Tool & Engine Provenance:**
These values were generated directly by **OpenSTA (OpenROAD v2.0)** running on the finalized post-route database (`6_final.odb`) with post-route extracted RC parasitics from SPEF (`6_final.spef`) under standard PVT ($TT, 25^\circ\text{C}, 1.80\text{V}$, $slew = 40\text{ ps}$, $C_{load} = 17.7\text{ fF}$).

### 1.2 Exact OpenSTA Tcl Commands Used
The exact commands executed in `scripts/query_sensitized_timing.tcl` and `scripts/query_sensitized_timing_hd.tcl` are:

```tcl
# OpenSTA Post-Route Timing Arc Query with Topological Skip Constraining
read_liberty /OpenROAD-flow-scripts/flow/platforms/sky130hs/lib/sky130_fd_sc_hs__tt_025C_1v80.lib
read_db /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.spef

# Query to SUM[15] traversing Block 1 & 2 Skip Multiplexer pin A1:
report_checks -from [get_ports B[0]] -to [get_ports SUM[15]] \
    -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] \
    -fields {capacitance slew input_pins} -digits 4

# Query to Cout traversing Block 1 & 2 Skip Multiplexer pin A1:
report_checks -from [get_ports B[0]] -to [get_ports Cout] \
    -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] \
    -fields {capacitance slew input_pins} -digits 4
```

### 1.3 Formal Engine Status & Correction of Terms
- **Correction:** This method is a **constrained topological path search** in OpenSTA specifying through-points (`-through [get_pins block1/_5_/A1]`), NOT an automated SAT/SMT-based formal timing verifier.
- **Formal Status:** An automated formal SAT/SMT solver (e.g., Z3 / Equivalence Checker) was **NOT executed** for timing.
- **Mathematical Status:** The condition under which the unconstrained path is unsensitizable was derived via **symbolic Boolean difference algebra** ($(P\_group_k = 1) \land (P\_group_k = 0) \equiv \mathbf{FALSE}$).
- Any previous statement implying that OpenSTA executed an automated formal SAT/SMT engine is hereby **withdrawn and clarified**.
- All parasitic timing back-annotation uses **`post-route extracted RC parasitics from SPEF`** (generated via OpenRCX rule-based extraction), not a 3D field-solver.

---

## 2. VERIFIED ENDPOINT COMPARISONS (MATCHING ENDPOINTS)

To maintain scientific integrity, adder timing comparisons must compare **identical endpoints** under equivalent SDC constraints ($vclk = 10.0\text{ ns}$, input slew = $40\text{ ps}$, output load = $17.7\text{ fF}$, $TT, 25^\circ\text{C}, 1.80\text{V}$):

### Comparison A: Matching Endpoint `SUM[15]`

| Architecture & Tech Library | Startpoint | Endpoint | Total Arrival Time | Logic Stages | Cell Stages (with buffers) | Post-Route Slack | Source Log |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **RCA (`sky130hs`)** | `B[0]` | `SUM[15]` | **3.8123 ns** | 16 stages | 18 stages | +6.1877 ns | `query_rca_endpoints.tcl` |
| **CSKA (`sky130hs`)** | `B[0]` | `SUM[15]` | **2.6154 ns** | 11 stages | 13 stages | +7.3846 ns | `query_sensitized_timing.tcl` |
| **Speedup on `SUM[15]` (HS)** | - | - | **+31.39%** | - | - | - | $\frac{3.8123 - 2.6154}{3.8123} \times 100\%$ |
| **RCA (`sky130hd`)** | `A[0]` | `SUM[15]` | **6.7188 ns** | 16 stages | 18 stages | +3.2812 ns | `query_rca_hd_endpoints.tcl` |
| **CSKA (`sky130hd`)** | `A[0]` | `SUM[15]` | **4.4489 ns** | 11 stages | 13 stages | +5.5511 ns | `query_sensitized_timing_hd.tcl` |
| **Speedup on `SUM[15]` (HD)** | - | - | **+33.78%** | - | - | - | $\frac{6.7188 - 4.4489}{6.7188} \times 100\%$ |

---

### Comparison B: Matching Endpoint `Cout`

| Architecture & Tech Library | Startpoint | Endpoint | Total Arrival Time | Logic Stages | Cell Stages (with buffers) | Post-Route Slack | Source Log |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **RCA (`sky130hs`)** | `B[0]` | `Cout` | **3.7199 ns** | 16 stages | 18 stages | +6.2801 ns | `query_rca_endpoints.tcl` |
| **CSKA (`sky130hs`)** | `B[0]` | `Cout` | **2.6631 ns** | 12 stages | 14 stages | +7.3369 ns | `query_sensitized_timing.tcl` |
| **Speedup on `Cout` (HS)** | - | - | **+28.41%** | - | - | - | $\frac{3.7199 - 2.6631}{3.7199} \times 100\%$ |
| **RCA (`sky130hd`)** | `A[0]` | `Cout` | **6.5581 ns** | 16 stages | 18 stages | +3.4419 ns | `query_rca_hd_endpoints.tcl` |
| **CSKA (`sky130hd`)** | `A[0]` | `Cout` | **4.5437 ns** | 12 stages | 14 stages | +5.4563 ns | `query_sensitized_timing_hd.tcl` |
| **Speedup on `Cout` (HD)** | - | - | **+30.72%** | - | - | - | $\frac{6.5581 - 4.5437}{6.5581} \times 100\%$ |

---

## 3. CELL-BY-CELL STAGE COUNT RECONCILIATION

The distinction between **pure combinational logic cells** and **total cell instances (including I/O buffers)**:

### 3.1 CSKA Path to `SUM[15]` (13 Total Cell Instances / 11 Logic Cells)
1. `input17` (`sky130_fd_sc_hs__buf_1`): input buffer
2. `block0/gen_fa[0].fa_inst/_0_` (`fa_1`): bit 0 carry generate
3. `block0/gen_fa[1].fa_inst/_0_` (`fa_1`): bit 1 carry propagate
4. `block0/gen_fa[2].fa_inst/_0_` (`fa_1`): bit 2 carry propagate
5. `block0/gen_fa[3].fa_inst/_0_` (`fa_1`): bit 3 ripple carry out
6. `block0/_5_` (`mux2_1` pin `A0` $\rightarrow$ `X`): Block 0 MUX (ripple select)
7. `block1/_5_` (`mux2_1` pin `A1` $\rightarrow$ `X`): **Block 1 MUX (SKIP)**
8. `block2/_5_` (`mux2_1` pin `A1` $\rightarrow$ `X`): **Block 2 MUX (SKIP)**
9. `block3/gen_fa[0].fa_inst/_0_` (`fa_1`): bit 12 carry propagate
10. `block3/gen_fa[1].fa_inst/_0_` (`fa_1`): bit 13 carry propagate
11. `block3/gen_fa[2].fa_inst/_0_` (`fa_1`): bit 14 carry propagate
12. `block3/gen_fa[3].fa_inst/_0_` (`fa_1` pin `CIN` $\rightarrow$ `SUM`): bit 15 sum generation
13. `output41` (`sky130_fd_sc_hs__buf_1`): output buffer
- **Logic Cells:** 4 FAs (Block 0) + 1 MUX (Block 0) + 2 MUXes (Blocks 1 & 2 Skip) + 4 FAs (Block 3) = **11 logic stages**.
- **Total Cells:** 11 logic cells + 2 buffers = **13 cell stages**.

### 3.2 CSKA Path to `Cout` (14 Total Cell Instances / 12 Logic Cells)
Stages 1 through 11 match above, followed by:
12. `block3/gen_fa[3].fa_inst/_0_` (`fa_1` pin `CIN` $\rightarrow$ `COUT`): bit 15 ripple carry out
13. `block3/_5_` (`mux2_1` pin `A0` $\rightarrow$ `X`): Block 3 MUX (ripple select)
14. `output34` (`sky130_fd_sc_hs__buf_1`): output buffer
- **Logic Cells:** 4 FAs (Block 0) + 1 MUX (Block 0) + 2 MUXes (Blocks 1 & 2 Skip) + 4 FAs (Block 3) + 1 MUX (Block 3) = **12 logic stages**.
- **Total Cells:** 12 logic cells + 2 buffers = **14 cell stages**.

---

## 4. FORMAL CATEGORIZATION OF TIMING METRICS

| Category | SKY130HS CSKA | SKY130HD CSKA | RCA SKY130HS | RCA SKY130HD | Methodology |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Unconstrained OpenSTA Topological Delay** | $4.3795\text{ ns}$ | $7.6665\text{ ns}$ | $3.8123\text{ ns}$ | $6.7188\text{ ns}$ | Tool-generated topological graph search on extracted SPEF |
| **2. Analytically Derived Pre-Layout Estimates** | $2.471\text{ ns}$ / $2.58\text{ ns}$ | $4.15\text{ ns}$ | $4.240\text{ ns}$ | $6.20\text{ ns}$ | Hand calculation from cell Liberty tables (zero wire RC) |
| **3. Constrained Post-Route OpenSTA Delay (`SUM[15]`)** | **2.6154 ns** | **4.4489 ns** | **3.8123 ns** | **6.7188 ns** | OpenSTA query with `-through` skip MUX pin A1 on extracted SPEF |
| **4. Constrained Post-Route OpenSTA Delay (`Cout`)** | **2.6631 ns** | **4.5437 ns** | **3.7199 ns** | **6.5581 ns** | OpenSTA query with `-through` skip MUX pin A1 on extracted SPEF |
| **5. Formally Verified Sensitized Delay (SAT/SMT)** | **NOT RUN** | **NOT RUN** | **N/A** | **N/A** | Requires commercial/formal tool (e.g. Synopsys TetraMAX / PrimeTime PBA) |

---

## 5. CLAIMS SUITABLE FOR ACADEMIC DEFENSE & VIVA

1. *"Unconstrained post-route static timing analysis in OpenSTA reports RCA as faster (3.81 ns vs 4.38 ns in SKY130HS) because OpenSTA traces an unconstrained topological path traversing all 16 full adders and all 4 multiplexers in series."*
2. *"Symbolic Boolean difference analysis demonstrates that the 20-cell topological path is a false path in physical hardware: propagating carry through Block 1 requires $P\_group_1 = 1$, which forces the multiplexer to select the skip pin A1 and disconnect the ripple pin A0."*
3. *"When the skip multiplexer bypass is constrained in OpenSTA with post-route extracted RC parasitics, the physical critical path delay is **2.62 ns (SUM[15])** in SKY130HS, and **4.45 ns (SUM[15])** in SKY130HD."*
4. *"Comparing matched endpoints under identical SDC constraints, Carry Skip Adder achieves a **genuine 31.4% speedup in SKY130HS** and a **33.8% speedup in SKY130HD** over Ripple Carry Adder on `SUM[15]`."*
5. *"Earlier preliminary estimates of 32.3% and 38.2% are refined by this post-route audit to account for actual output buffer drive and routing parasitics."*
