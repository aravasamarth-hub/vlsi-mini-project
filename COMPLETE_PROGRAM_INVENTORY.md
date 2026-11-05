# COMPLETE PROGRAM & SCRIPT INVENTORY

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Audit Date:** November 06, 2026  
**Workspace:** `D:\mini project`  

---

## 1. COMPREHENSIVE SCRIPT-BY-SCRIPT BREAKDOWN

Every important source file across Verilog, Python, TypeScript, JSON, and PowerShell is detailed below:

### A. RTL Hardware Modules (`rtl/`)
1. **`rtl/carry_skip_adder.v`**
   - **Language:** Verilog HDL (IEEE 1364-2005)
   - **Location:** `D:\mini project\rtl\carry_skip_adder.v`
   - **Purpose:** Top-level 16-bit Carry Skip Adder module chaining four 4-bit blocks in series.
   - **Inputs:** `A[15:0]`, `B[15:0]`, `Cin`
   - **Outputs:** `SUM[15:0]`, `Cout`
   - **Processing:** Chains `carry_skip_block_4bit` instances `b0`, `b1`, `b2`, `b3` with intermediate carries `c4`, `c8`, `c12`.
   - **Dependencies:** `rtl/carry_skip_block_4bit.v`, `rtl/full_adder.v`
   - **Execution / Compilation:** `iverilog -o sim.vvp -I rtl verification/testbench_cska.v verification/common_reference_model.v rtl/*.v`
   - **Project Stage:** Stage 2 (RTL Design) & Stage 4 (Synthesis top module)

2. **`rtl/carry_skip_block_4bit.v`**
   - **Language:** Verilog HDL
   - **Location:** `D:\mini project\rtl\carry_skip_block_4bit.v`
   - **Purpose:** 4-bit CSKA building block with ripple carry chain, group propagate evaluation, and 2:1 bypass multiplexer.
   - **Inputs:** `A[3:0]`, `B[3:0]`, `Cin`
   - **Outputs:** `SUM[3:0]`, `Cout`, telemetry signals `P_bits[3:0]`, `P_group`, `C_ripple`, `Skip_active`
   - **Processing:** Evaluates $P_i = A_i \oplus B_i$, $P_{group} = P_0 \cdot P_1 \cdot P_2 \cdot P_3$, and $C_{out} = P_{group} ? C_{in} : C_{ripple}$.
   - **Dependencies:** `rtl/full_adder.v`
   - **Project Stage:** Stage 2 (RTL Design) & Stage 4 (Hierarchical synthesis building block)

3. **`rtl/ripple_carry_adder.v`**
   - **Language:** Verilog HDL
   - **Location:** `D:\mini project\rtl\ripple_carry_adder.v`
   - **Purpose:** Baseline 16-bit Ripple Carry Adder.
   - **Inputs:** `A[15:0]`, `B[15:0]`, `Cin`
   - **Outputs:** `SUM[15:0]`, `Cout`
   - **Processing:** Cascades 16 1-bit full adders in linear sequence via Verilog `generate`.
   - **Project Stage:** Baseline Comparison

4. **`rtl/full_adder.v`** & **`rtl/half_adder.v`**
   - **Language:** Verilog HDL
   - **Location:** `rtl/full_adder.v`, `rtl/half_adder.v`
   - **Purpose:** 1-bit primitive arithmetic building blocks.
   - **Processing:** Gate-level boolean expressions for sum and carry generation.

5. **`rtl/carry_lookahead_adder.v`** & **`rtl/cla_block_4bit.v`**
   - **Language:** Verilog HDL
   - **Purpose:** 16-bit Carry Lookahead Adder using internal carry lookahead logic.
   - **Project Stage:** High-speed comparative benchmark.

6. **`rtl/carry_select_adder.v`** & **`rtl/csla_block_4bit.v`**
   - **Language:** Verilog HDL
   - **Purpose:** 16-bit Carry Select Adder using dual speculative ripple chains for $C_{in}=0$ and $C_{in}=1$.
   - **Project Stage:** Comparative benchmark.

7. **`rtl/brent_kung_adder.v`**
   - **Language:** Verilog HDL
   - **Purpose:** 16-bit parallel prefix Brent-Kung adder with logarithmic carry tree.
   - **Project Stage:** Parallel prefix benchmark.

---

### B. Verification & Testbenches (`verification/`)
1. **`verification/common_reference_model.v`**
   - **Purpose:** Unconstrained 17-bit self-checking golden adder model `{Cout, Sum} = A + B + Cin`.
2. **`verification/testbench_cska.v`**
   - **Purpose:** 10,014-vector comprehensive testbench executing directed corner cases and 10,000 random vectors with VCD dumping.
3. **`verification/testbench_all.v`**
   - **Purpose:** 10,000-cycle lockstep testbench comparing all 5 adders simultaneously against the golden model.

---

### C. Logic Synthesis Scripts (`synthesis/`)
1. **`synthesis/yosys_scripts/synth_cska_hier.ys`**
   - **Language:** Yosys Tcl script
   - **Purpose:** Synthesizes CSKA with hierarchy preservation (`synth -noflatten`), retaining all 4 bypass MUXes and 4 AND4 gates (56 cells, 760.73 µm²).
2. **`synthesis/yosys_scripts/synth_cska.ys`**
   - **Purpose:** Synthesizes CSKA with unconstrained flattening (`synth -flatten`), producing ABC-optimized majority-3 carry chains (48 cells, 440.42 µm²).
3. **`synthesis/run_synthesis.py`**
   - **Language:** Python
   - **Purpose:** Master automated synthesis runner parsing stats and generating `synthesis_summary.json` and `.csv`.

---

### D. Physical Design & Layout Scripts (`physical_design/`)
1. **`physical_design/generate_physical_layout.py`**
   - **Language:** Python
   - **Purpose:** Generates 45x35 µm die, 9 alternating standard cell rows, snaps cells to 0.46 µm site grid, and outputs `cska_sky130.def`.
2. **`physical_design/export_gds.py`**
   - **Language:** Python (KLayout Pya API)
   - **Purpose:** Reads `cska_sky130.def`, instantiates cell layouts from `sky130_fd_sc_hd.gds`, and streams binary `cska_sky130.gds` (4.18 MB).
3. **`physical_design/plot_layout.py`**
   - **Language:** Python (Matplotlib)
   - **Purpose:** Renders 2D floorplan visualization `cska_placement_layout.png`.

---

### E. Analysis & Packaging Scripts (`analysis/` & `scripts/`)
1. **`analysis/performance_analysis.py`**
   - **Purpose:** Extracts Liberty cell timing arcs, models analytical critical-path delay, and computes dynamic power at 100 MHz.
2. **`analysis/block_size_experiment.py`**
   - **Purpose:** Simulates CSKA latency across 2, 4, and 8-bit block partitions.
3. **`scripts/package_submission.py`**
   - **Purpose:** Generates clean distributable ZIP archive `16bit_carry_skip_adder_sky130_submission.zip` (21.02 MB) with 162 packaged files.
