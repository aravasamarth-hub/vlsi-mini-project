# CYBERCORE 3D — FACULTY & EXAMINER DEMONSTRATION GUIDE
## 10-to-15 Minute Step-by-Step Live Examination Walkthrough
**Platform:** CYBERCORE 3D VLSI Engineering Lab  
**Live URL:** `http://localhost:3000`  
**Backend API:** `http://127.0.0.1:8000`  
**Streamlit Dashboard:** `http://localhost:8501`  
**Quick Launch Script:** Double-click `D:\mini project\START_CYBERCORE.bat`  

---

## Part 1: System Startup & Project Overview (Minutes 0:00 – 2:00)

1. **Launch the System:**
   - Double-click `START_CYBERCORE.bat` in `D:\mini project`.
   - The launcher maps virtual drive `X:`, verifies Python and Node environments, starts the FastAPI daemon, starts Vite preview on port 3000, and opens your default browser at `http://localhost:3000`.
2. **Introduction to Faculty:**
   - *"Good morning, professors. Today I am demonstrating CYBERCORE 3D, a digital VLSI engineering laboratory for a 16-bit Carry Skip Adder designed with the SkyWater 130nm process design kit."*
   - Point out the status badges in the top navigation header:
     - Technology: `SKY130HD 130nm`
     - Verification: `VERIFIED: 60,038 VECTORS`
     - Physical Layout: `GDSII: 4.18 MB PLACED`
   - Demonstrate the global **`[ SIMPLE | ENGINEERING ]`** toggle on the header to show how educational explanations adapt between beginner concepts and senior VLSI terminology.

---

## Part 2: 3D Semiconductor Lab & Working Principle (Minutes 2:00 – 4:30)

1. **Navigate to "3D Chip Studio" View:**
   - Rotate the 3D model using the left mouse button, pan with right mouse button, and zoom with scroll wheel.
   - Point out the **gold QFP gull-wing leads (40 pins)** and the concentric glowing PCB traces on the carbon base.
2. **Demonstrate Exploded View:**
   - Drag the **Explosion Percentage Slider** from 0% to 100%.
   - Walk through the 7 distinct layers from top to bottom:
     - **L1:** Passivation Lid & Titanium Heat Spreader with laser markings.
     - **L2:** Metal-3 Power Grid stripes.
     - **L3:** Metal-2 Interconnect showing the orange **Carry Skip Bypass Highway**.
     - **L4:** Metal-1 Local Standard Cell pin routing.
     - **L5:** Active & Poly Transistor layer featuring 4 distinct 4-bit CSKA blocks with Full Adders, AND4 gates, and 2:1 multiplexers.
     - **L6:** STI isolation trenches.
     - **L7:** Bulk p-type silicon wafer substrate.
3. **Show Block Inspector (Right Panel):**
   - Click on **BLK 0, BLK 1, BLK 2, BLK 3** buttons in the right panel to show bit ranges, operand inputs, bit propagates ($P_i$), and bypass status.

---

## Part 3: Live Adder Simulation & Carry Animation (Minutes 4:30 – 7:00)

1. **Navigate to "Adder Simulator" View:**
   - Enter Sample Value 1: **Full Skip Bypass Condition**
     - Operands: `A = 0xAAAA`, `B = 0x5555`, `Cin = 1`
     - Click **"RUN SIMULATION"**
     - Result: `SUM = 0x0000`, `Cout = 1`
     - Explain: All 16 bit-propagate bits are 1 ($A_i \neq B_i$). All four 4-bit blocks evaluate $P_{group} = 1$. The carry skips all 4 blocks in $O(1)$ multiplexer delay directly to $C_{out}$.
   - Enter Sample Value 2: **Mixed Ripple & Skip Condition**
     - Operands: `A = 0xFFFF`, `B = 0x0001`, `Cin = 0`
     - Result: `SUM = 0x0000`, `Cout = 1`
     - Explain: Block 0 ripples internally to generate carry $C_4 = 1$; Blocks 1, 2, and 3 skip.
2. **Navigate to "Carry Propagation Visualizer" View:**
   - Click **"Play"** or use the **"Step Forward"** button.
   - Watch the animated cyan ripple token enter Block 0, evaluate group propagate, and ignite the glowing orange skip bypass highway over Blocks 1 and 2.

---

## Part 4: Functional Verification & Waveform Inspection (Minutes 7:00 – 9:00)

1. **Explain the 60,038 Vector Verification Standard:**
   - Navigate to **"Verification & Analysis"** tab.
   - Show the scoreboard: 6 testbenches, 60,038 vectors, 0 mismatches against `common_reference_model.v` ($A + B + Cin$).
2. **Demonstrate Live Verification in Terminal (Optional live proof):**
   ```powershell
   subst X: "D:\mini project"
   & "X:\tools\oss-cad-suite\environment.ps1"
   vvp X:\verification\tb_cska.vvp
   ```
   - Point out output: `Total Vectors Executed: 10014 | Passed Vectors: 10014 | Failed Vectors: 0`.
3. **Show Waveform in GTKWave (If requested by examiner):**
   ```powershell
   gtkwave X:\simulation\waveforms\carry_skip_adder.vcd
   ```

---

## Part 5: Logic Synthesis & Academic Discovery (Minutes 9:00 – 11:30)

1. **Explain Flattened vs. Hierarchical Synthesis:**
   - Show `synthesis/reports/cska_hier_synth.log` vs `cska_synth.log`.
   - **Crucial Discussion Point:**
     - In flattened synthesis, ABC optimization minimizes $(P_{grp} \cdot C_{in}) + (\overline{P_{grp}} \cdot C_{ripple})$ into 16 `maj3_1` and 32 `xnor2_1` cells (48 cells), erasing the multiplexers.
     - In **hierarchical synthesis**, preserving module boundaries retains all 4 `mux2_1` multiplexers and 4 `and4_1` gates (56 cells, 760.73 µm²).
2. **Explain Critical Path Delay (2.471 ns):**
   - Emphasize academic honesty: 2.471 ns is an **analytical Liberty lookup table estimate**, achieving a **41.7% speedup over RCA** (4.240 ns).

---

## Part 6: Physical Design & GDSII Stream (Minutes 11:30 – 13:00)

1. **Navigate to "Physical Layout (GDS)" View:**
   - Show the 45.0 µm × 35.0 µm die boundary with 9 standard-cell rows at 2.72 µm pitch.
   - Explain the core utilization of 51.36%.
2. **Show Real GDSII File:**
   - Point out `physical_design/gds/cska_sky130.gds` (4.18 MB, 433 instances).
   - State clearly: The GDSII represents **standard-cell placement**; detailed metal routing and signoff DRC/LVS were not completed due to native Windows OpenROAD constraints.

---

## Part 7: Seminar Mode & Conclusion (Minutes 13:00 – 15:00)

1. **Open Seminar Presentation Mode:**
   - Click the orange **"SEMINAR MODE"** button in the top right.
   - Navigate through the 21 slides with the arrow keys.
   - Point out speaker notes and examiner viva questions.
   - Press **`ESC`** to exit presentation mode.
2. **Concluding Statement:**
   - *"In conclusion, this project provides a complete, verified, end-to-end digital VLSI design flow from RTL Verilog to GDSII layout stream, verified with over 60,000 vectors and transparent physical characterization. Thank you."*

---

## Troubleshooting & Emergency Recovery Steps

1. **If Web Browser doesn't open:**
   - Manually open Chrome or Edge and browse to `http://localhost:3000`.
2. **If Backend is offline:**
   - Run: `& "D:\mini project\.venv\Scripts\python.exe" -m uvicorn backend.app:app --host 127.0.0.1 --port 8000`
3. **If Virtual Drive X: is missing:**
   - Run: `subst X: "D:\mini project"`
4. **To cleanly stop all background processes:**
   - Double-click `D:\mini project\STOP_CYBERCORE.bat`.
