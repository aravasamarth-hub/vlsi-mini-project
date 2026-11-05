# CYBERCORE 3D — FINAL FUNCTIONAL VERIFICATION REPORT
## Empirical Simulation Verification Against Golden Arithmetic Reference Model
**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Verification Simulator:** Icarus Verilog 13.0 (devel) + VVP Engine  
**Execution Timestamp:** November 6, 2026 (Live CLI Run)  
**Verification Standard:** 17-Bit Unconstrained Behavioral Model (`A + B + Cin`)  
**Overall Result:** **60,038 VECTORS SIMULATED • 60,038 PASSED • 0 MISMATCHES (100.0% PASS RATE)**  

---

## 1. Master Simulation Scoreboard

| Testbench Suite | Target Architecture | Test Vectors Executed | Vectors Passed | Mismatches / Errors | Pass Rate | Generated VCD Waveform |
|---|---|---|---|---|---|---|
| `testbench_cska.v` | **CSKA (Primary DUT)** | **10,014** | 10,014 | 0 | **100.0%** | `simulation/waveforms/carry_skip_adder.vcd` (8.20 MB) |
| `testbench_all.v` | **All 5 Adders (Master)** | **10,000** | 10,000 | 0 | **100.0%** | `simulation/waveforms/all_adders_comparison.vcd` (30.65 MB) |
| `testbench_rca.v` | Ripple Carry Adder | **10,006** | 10,006 | 0 | **100.0%** | `simulation/waveforms/ripple_carry_adder.vcd` (5.95 MB) |
| `testbench_cla.v` | Carry Look-Ahead Adder | **10,006** | 10,006 | 0 | **100.0%** | `simulation/waveforms/carry_lookahead_adder.vcd` (5.24 MB) |
| `testbench_csla.v` | Carry Select Adder | **10,006** | 10,006 | 0 | **100.0%** | `simulation/waveforms/carry_select_adder.vcd` (9.82 MB) |
| `testbench_bk.v` | Brent-Kung Prefix Adder | **10,006** | 10,006 | 0 | **100.0%** | `simulation/waveforms/brent_kung_adder.vcd` (8.32 MB) |
| **GRAND TOTAL** | **Across All Suites** | **60,038** | **60,038** | **0** | **100.0%** | **6 Multi-Megabyte Waveform Files** |

---

## 2. Test Category Breakdown (CSKA Primary DUT)

1. **Directed Corner Cases (14 vectors):**
   - Zero addition ($A=0, B=0, Cin=0 \rightarrow SUM=0, Cout=0$)
   - Zero addition with carry-in ($A=0, B=0, Cin=1 \rightarrow SUM=1, Cout=0$)
   - Minimum non-zero ($1 + 1 \rightarrow 2$)
   - Maximum integer overflow ($0xFFFF + 0x0001 \rightarrow SUM=0, Cout=1$)
   - Maximum operands ($0xFFFF + 0xFFFF, Cin=0 \rightarrow SUM=0xFFFE, Cout=1$)
   - Maximum operands with carry-in ($0xFFFF + 0xFFFF, Cin=1 \rightarrow SUM=0xFFFF, Cout=1$)
   - Midpoint addition ($32768 + 32768 \rightarrow SUM=0, Cout=1$)
   - Bit boundary transitions (8-bit, 12-bit, 15-bit boundaries)
2. **Exhaustive Skip Bypass Tests:**
   - All 4 blocks skip ($A=0xAAAA, B=0x5555, Cin=1 \rightarrow P_{grp}=1111$, Cout bypasses in 1 cycle)
   - Alternating block skip ($A=0xF0F0, B=0x0F0F, Cin=1$)
   - Byte-wise block propagate ($A=0xFF00, B=0x00FF, Cin=1$)
   - Total Skip Logic Activations: **2,326 cycles**
3. **Constrained Pseudo-Random Stress Test:**
   - 10,000 randomized 16-bit operands with uniform distribution across $A, B$, and $Cin$.

---

## 3. Live Simulation Transcript Evidence

```text
==========================================================================
>>> STARTING FUNCTIONAL VERIFICATION: 16-BIT CARRY SKIP ADDER (CSKA) <<<
==========================================================================
[PASS] Corner 1: Zero Addition (Cin=0) | A=0 (0x0000), B=0 (0x0000), Cin=0 => SUM=0 (0x0000), Cout=0 | GP=0000, SkipActive=0000
[PASS] Corner 1b: Zero Addition (Cin=1) | A=0 (0x0000), B=0 (0x0000), Cin=1 => SUM=1 (0x0001), Cout=0 | GP=0000, SkipActive=0000
[PASS] Corner 2: 1 + 1 | A=1 (0x0001), B=1 (0x0001), Cin=0 => SUM=2 (0x0002), Cout=0 | GP=0000, SkipActive=0000
[PASS] Corner 3: Max Int + 1 (Overflow test) | A=65535 (0xffff), B=1 (0x0001), Cin=0 => SUM=0 (0x0000), Cout=1 | GP=1110, SkipActive=1110
[PASS] Corner 4: Max + Max (Cin=0) | A=65535 (0xffff), B=65535 (0xffff), Cin=0 => SUM=65534 (0xfffe), Cout=1 | GP=0000, SkipActive=0000
[PASS] Corner 4b: Max + Max (Cin=1) | A=65535 (0xffff), B=65535 (0xffff), Cin=1 => SUM=65535 (0xffff), Cout=1 | GP=0000, SkipActive=0000
[PASS] Corner 5: Midpoint 32768 + 32768 | A=32768 (0x8000), B=32768 (0x8000), Cin=0 => SUM=0 (0x0000), Cout=1 | GP=0000, SkipActive=0000
[PASS] Corner 6: Arbitrary Pattern (12345+54321) | A=12345 (0x3039), B=54321 (0xd431), Cin=0 => SUM=1130 (0x046a), Cout=1 | GP=0000, SkipActive=0000
[PASS] Corner 7: 8-bit Boundary (255 + 1) | A=255 (0x00ff), B=1 (0x0001), Cin=0 => SUM=256 (0x0100), Cout=0 | GP=0010, SkipActive=0010
[PASS] Corner 8: 12-bit Boundary (4095 + 1) | A=4095 (0x0fff), B=1 (0x0001), Cin=0 => SUM=4096 (0x1000), Cout=0 | GP=0110, SkipActive=0110
[PASS] Corner 9: 15-bit Boundary (32767 + 1) | A=32767 (0x7fff), B=1 (0x0001), Cin=0 => SUM=32768 (0x8000), Cout=0 | GP=0110, SkipActive=0110
[PASS] Skip Test 1 (All 4 Blocks Skip) | A=43690 (0xaaaa), B=21845 (0x5555), Cin=1 => SUM=0 (0x0000), Cout=1 | GP=1111, SkipActive=1111
[PASS] Skip Test 2 (Alternating Blocks) | A=61680 (0xf0f0), B=3855 (0x0f0f), Cin=1 => SUM=0 (0x0000), Cout=1 | GP=1111, SkipActive=1111
[PASS] Skip Test 3 (Byte-wise Propagate) | A=65280 (0xff00), B=255 (0x00ff), Cin=1 => SUM=0 (0x0000), Cout=1 | GP=1111, SkipActive=1111
--------------------------------------------------------------------------
>>> RUNNING 10,000 RANDOMIZED STRESS TEST VECTORS <<<
--------------------------------------------------------------------------
==========================================================================
>>> CARRY SKIP ADDER VERIFICATION COMPLETE <<<
  Total Vectors Executed : 10014
  Passed Vectors         : 10014
  Failed Vectors         : 0
  Skip Logic Activations : 2326 cycles
  VERIFICATION RESULT    : [100% PASSED - ZERO DEFECTS]
==========================================================================
```

---

## 4. Waveform Inspection in GTKWave

To inspect the generated waveform file:
```powershell
gtkwave simulation/waveforms/carry_skip_adder.vcd
```
Signals to observe:
1. `testbench_cska.A[15:0]` & `B[15:0]`
2. `testbench_cska.Cin`
3. `testbench_cska.SUM[15:0]` & `Cout`
4. `testbench_cska.uut.group_propagate[3:0]`
5. `testbench_cska.uut.skip_active[3:0]`
6. `testbench_cska.uut.ripple_carries[3:0]`

