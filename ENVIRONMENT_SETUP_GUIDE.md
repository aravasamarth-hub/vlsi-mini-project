# COMPLETE ENVIRONMENT SETUP & REPRODUCIBILITY GUIDE

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Target Platform:** Windows 11 (64-bit)  
**Workspace:** `D:\mini project`  

---

## 1. INSTANT 1-CLICK LAUNCH INSTRUCTIONS

To launch the entire CYBERCORE 3D engineering lab locally:

### Step 1: Open Terminal in Workspace
```powershell
cd "D:\mini project"
```

### Step 2: Start the FastAPI Telemetry Backend
```powershell
& ".\.venv\Scripts\python.exe" -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```
- Local URL: `http://127.0.0.1:8000`
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

### Step 3: Start the CyberCore 3D Web Frontend
In a second terminal window:
```powershell
cd "D:\mini project\frontend"
npm run preview -- --port 3000 --host
```
- Application Studio URL: `http://localhost:3000`

### Step 4: Start the Streamlit Analytics Dashboard (Optional)
In a third terminal window:
```powershell
cd "D:\mini project"
& ".\.venv\Scripts\streamlit.exe" run dashboard/app.py --server.port 8501
```
- Dashboard URL: `http://localhost:8501`

---

## 2. COMPILING & SIMULATING VERILOG TESTBENCHES

To compile and simulate the complete 60,038-vector verification suite:

```powershell
# Map space-safe drive alias
subst X: "D:\mini project"
& "X:\tools\oss-cad-suite\environment.ps1"
cd X:\

# Compile and run CSKA testbench (10,014 vectors)
iverilog -o simulation/tb_cska.vvp -I rtl verification/testbench_cska.v verification/common_reference_model.v rtl/carry_skip_adder.v rtl/carry_skip_block_4bit.v rtl/full_adder.v rtl/half_adder.v
vvp simulation/tb_cska.vvp

# Compile and run master 5-adder lockstep testbench (10,000 vectors)
iverilog -o simulation/tb_all.vvp -I rtl verification/testbench_all.v verification/common_reference_model.v rtl/ripple_carry_adder.v rtl/carry_skip_adder.v rtl/carry_skip_block_4bit.v rtl/carry_lookahead_adder.v rtl/cla_block_4bit.v rtl/carry_select_adder.v rtl/csla_block_4bit.v rtl/brent_kung_adder.v rtl/full_adder.v rtl/half_adder.v
vvp simulation/tb_all.vvp
```

---

## 3. OPENING VCD WAVEFORMS IN GTKWAVE

```powershell
& "X:\tools\oss-cad-suite\bin\gtkwave.exe" "X:\simulation\waveforms\carry_skip_adder.vcd"
```

---

## 4. VIEWING PHYSICAL GDSII LAYOUT IN KLAYOUT

```powershell
& "C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe" "D:\mini project\physical_design\gds\cska_sky130.gds" -l "D:\mini project\synthesis\sky130_pdk\sky130hd.lyp"
```

---

## 5. RUNNING YOSYS SYNTHESIS FLOW

```powershell
subst X: "D:\mini project"
& "X:\tools\oss-cad-suite\environment.ps1"
cd X:\

# Run hierarchical CSKA synthesis (preserves 4 bypass multiplexers)
yosys -s synthesis/yosys_scripts/synth_cska_hier.ys

# Run flattened CSKA synthesis (ABC Boolean logic optimization)
yosys -s synthesis/yosys_scripts/synth_cska.ys
```

