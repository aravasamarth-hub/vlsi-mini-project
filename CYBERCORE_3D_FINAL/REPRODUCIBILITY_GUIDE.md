# CYBERCORE 3D — INDEPENDENT REPRODUCIBILITY GUIDE
**Project:** 16-Bit Carry Skip Adder Physical Implementation  
**Technology:** Google / SkyWater 130nm CMOS (`sky130hd` and `sky130hs`)  
**Workspace:** `D:\mini project`  
**Target Audience:** VLSI Engineering Students, Evaluators & Researchers

---

## 1. Prerequisites & Environment Setup

### 1.1 Host Environment
- **Operating System:** Windows 11 (64-bit) with WSL2 (Ubuntu 24.04 LTS).
- **Docker Engine:** Docker Desktop or WSL2 Native Docker CE.
- **Python:** Python 3.11+ (Windows `.venv` or Ubuntu system python).
- **KLayout:** KLayout 0.28+ on Windows or Linux for GDSII layout viewing.

### 1.2 OpenROAD Flow Image
Pull the official pre-built Docker image:
```bash
docker pull openroad/orfs:latest
```

---

## 2. Step-by-Step Reproduction Instructions

### Step 1: RTL Functional Regression (60,038 Vectors)
Run the complete regression suite in WSL2 Ubuntu or Windows:
```bash
# In WSL2 Ubuntu terminal:
cd /mnt/d/mini\ project
iverilog -g2005-sv -I rtl -o /tmp/cska.vvp rtl/full_adder.v rtl/carry_skip_block_4bit.v rtl/carry_skip_adder.v verification/common_reference_model.v verification/testbench_cska.v
vvp /tmp/cska.vvp
```
*Expected Output:* `VERIFICATION RESULT : [100% PASSED - ZERO DEFECTS]` (10,014 vectors).

---

### Step 2: OpenSTA Post-Route Timing Arc Execution
To reproduce the post-route timing results with 3D SPEF parasitics:
```bash
# In WSL2 Ubuntu terminal:
docker run --rm \
  -v /home/arava/cybercore3d:/cybercore3d \
  -v /mnt/d/mini\ project/scripts:/scripts \
  openroad/orfs:latest \
  /OpenROAD-flow-scripts/tools/install/OpenROAD/bin/openroad -exit -no_init -threads 2 /scripts/query_sensitized_timing.tcl
```
*Expected Output:*
- Path to `SUM[15]`: **2.6154 ns** (Slack: +7.3846 ns)
- Path to `Cout`: **2.6631 ns** (Slack: +7.3369 ns)

---

### Step 3: Silicon Layout Inspection in KLayout
1. Launch KLayout on Windows.
2. Open `D:\mini project\openroad_experiment\artifacts\sky130hs_cska\6_final.gds`.
3. Load the SkyWater 130nm layer properties file if prompted (`sky130.lyp`).
4. Press `Shift + F` to unhide all hierarchy levels.
5. Inspect the 4 carry skip multiplexers (`sky130_fd_sc_hs_mux2_1`), 16 full adders (`sky130_fd_sc_hs_fa_1`), power mesh (Metal 4/5), and signal routing (Metal 1–3).

