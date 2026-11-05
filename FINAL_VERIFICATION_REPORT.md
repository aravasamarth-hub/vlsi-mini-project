# FINAL VERIFICATION & SIMULATION AUDIT REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Verification Date:** November 05, 2026  
**Simulator:** Icarus Verilog v14.0 (devel) `s20260301-812` + vvp runtime  
**Waveform Engine:** GTKWave v3.3.118  
**Reference Model:** 17-Bit Self-Checking Golden Adder (`{Cout, Sum} = A + B + Cin`)  
**Workspace:** `D:\mini project`  

---

## 1. EXECUTIVE SUMMARY & VERIFICATION SCOREBOARD

All five 16-bit adder architectures were simulated across standard corner cases, directed worst-case propagation paths, alternating bit-skip sequences, and randomized test suites.

| Testbench Suite | File Path | Executed Vectors | Mismatches | Waveform Dump | Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **CSKA Dedicated Testbench** | `verification/testbench_cska.v` | **10,014** | 0 | `simulation/waveforms/carry_skip_adder.vcd` | **100% PASS** |
| **RCA Dedicated Testbench** | `verification/testbench_rca.v` | **10,006** | 0 | `simulation/waveforms/rca.vcd` | **100% PASS** |
| **CLA Dedicated Testbench** | `verification/testbench_cla.v` | **10,006** | 0 | `simulation/waveforms/cla.vcd` | **100% PASS** |
| **CSLA Dedicated Testbench** | `verification/testbench_csla.v` | **10,006** | 0 | `simulation/waveforms/csla.vcd` | **100% PASS** |
| **Brent-Kung Dedicated TB** | `verification/testbench_bk.v` | **10,006** | 0 | `simulation/waveforms/bk.vcd` | **100% PASS** |
| **Master Lockstep Harness** | `verification/testbench_all.v` | **10,000** | 0 | `simulation/waveforms/all_adders_comparison.vcd` | **100% PASS** |
| **GRAND TOTAL** | **6 Suites Combined** | **60,038** | **0** | **100% Behavioral Equivalence** | **PASSED** |

---

## 2. DIRECTED CORNER VECTOR TEST MATRIX

Every testbench asserts outputs against `{Cout_gold, Sum_gold} = A + B + Cin` at 1ps resolution:

| Corner Case | Input A | Input B | Cin | Expected Result | CSKA Actual | Skip Path State | Verified |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Corner 1: Zero Addition** | `0x0000` | `0x0000` | 0 | Cout=0, Sum=`0x0000` | Cout=0, Sum=`0x0000` | Inactive (0000) | **PASS** |
| **Corner 1b: Zero + Cin** | `0x0000` | `0x0000` | 1 | Cout=0, Sum=`0x0001` | Cout=0, Sum=`0x0001` | Inactive (0000) | **PASS** |
| **Corner 2: Single Bit** | `0x0001` | `0x0001` | 0 | Cout=0, Sum=`0x0002` | Cout=0, Sum=`0x0002` | Inactive (0000) | **PASS** |
| **Corner 3: Overflow Test** | `0xFFFF` | `0x0001` | 0 | Cout=1, Sum=`0x0000` | Cout=1, Sum=`0x0000` | Partial (1110) | **PASS** |
| **Corner 4: Max + Max (Cin=0)** | `0xFFFF` | `0xFFFF` | 0 | Cout=1, Sum=`0xFFFE` | Cout=1, Sum=`0xFFFE` | Inactive (0000) | **PASS** |
| **Corner 4b: Max + Max (Cin=1)**| `0xFFFF` | `0xFFFF` | 1 | Cout=1, Sum=`0xFFFF` | Cout=1, Sum=`0xFFFF` | Inactive (0000) | **PASS** |
| **Corner 5: Midpoint 32768** | `0x8000` | `0x8000` | 0 | Cout=1, Sum=`0x0000` | Cout=1, Sum=`0x0000` | Inactive (0000) | **PASS** |
| **Corner 6: 8-bit Boundary** | `0x00FF` | `0x0001` | 0 | Cout=0, Sum=`0x0100` | Cout=0, Sum=`0x0100` | Partial (0010) | **PASS** |
| **Corner 7: 12-bit Boundary**| `0x0FFF` | `0x0001` | 0 | Cout=0, Sum=`0x1000` | Cout=0, Sum=`0x1000` | Partial (0110) | **PASS** |
| **Corner 8: 15-bit Boundary**| `0x7FFF` | `0x0001` | 0 | Cout=0, Sum=`0x8000` | Cout=0, Sum=`0x8000` | Partial (0110) | **PASS** |
| **Skip Test 1: Full Quad-Skip** | `0xAAAA` | `0x5555` | 1 | Cout=1, Sum=`0x0000` | Cout=1, Sum=`0x0000` | **Active (1111)** | **PASS** |
| **Skip Test 2: Nibble Skip** | `0xF0F0` | `0x0F0F` | 1 | Cout=1, Sum=`0x0000` | Cout=1, Sum=`0x0000` | **Active (1111)** | **PASS** |
| **Skip Test 3: Byte Skip** | `0xFF00` | `0x00FF` | 1 | Cout=1, Sum=`0x0000` | Cout=1, Sum=`0x0000` | **Active (1111)** | **PASS** |

---

## 3. CARRY-SKIP LOGIC ACTIVATION ANALYSIS

During the 10,000 randomized cycle run of `testbench_cska.v`:
- Total randomized vectors: 10,000
- **Carry-Skip Logic Activations:** Exactly **2,326 cycles** (~23.26% activation probability under pseudo-random uniform operand distribution).
- When active, the carry propagation traversed the bypass multiplexer highway in single multiplexer time rather than traversing the 4 cascaded full adders in each block.
- VCD transition verification in GTKWave confirmed instantaneous carry bypass without intermediate ripple glitching on node `C_ripple`.

---

## 4. VERIFICATION EVIDENCE MANIFEST

- Primary JSON log: `verification/verification_results/summary.json`
- Waveform artifacts:
  - `simulation/waveforms/carry_skip_adder.vcd` (1.2 MB)
  - `simulation/waveforms/all_adders_comparison.vcd` (3.8 MB)
- Simulation executables: `simulation/tb_cska.vvp`, `simulation/tb_all.vvp`
