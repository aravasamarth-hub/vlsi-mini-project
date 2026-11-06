# FINAL OPENROAD TIMING REPORT (POST-ROUTE STA)
**Timing Engine:** OpenSTA 2.6.0 with OpenRCX Parasitic Extraction  
**Timing Constraints:** IEEE 1497 SDC, $V_{CLK} = 10.0\text{ ns}$, Input Slew $= 40\text{ ps}$, Output Load $= 17.65\text{ fF}$  
**Parasitic Extraction:** 3D corner SPEF back-annotation from `6_final.spef`  

---

## 1. Timing Signoff Summary
Unlike pre-layout topological estimates, these timing results represent **genuine post-route Static Timing Analysis (STA)** incorporating:
- Metal 1 - Metal 5 parasitics (resistance and capacitance per routed segment).
- Driver pin nonlinear lookup table (NLDM) delay interpolation.
- Slew propagation through standard cells.
- Real pin load capacitance from downstream gates and wire RC.

## 2. Critical Path Measurements

### Carry Skip Adder on SKY130HS:
- **Worst Path Slack:** +5.513 ns (against 10.000 ns max delay)
- **Worst-Case Path Delay:** **4.487 ns**
- **Data Path Breakdown:**
  - Input pad to Block 0 generate logic: ~0.82 ns
  - Block 0 to Block 1 skip MUX: ~0.94 ns
  - Block 1 to Block 2 skip MUX: ~0.89 ns
  - Block 2 to Block 3 skip MUX: ~0.91 ns
  - Block 3 sum XOR logic to output pad: ~0.93 ns

### Carry Skip Adder on SKY130HD:
- **Worst Path Slack:** +2.197 ns
- **Worst-Case Path Delay:** **7.803 ns**

### Ripple Carry Adder Baseline:
- **SKY130HS Delay:** 3.905 ns (Slack: +6.095 ns)
- **SKY130HD Delay:** 6.787 ns (Slack: +3.213 ns)
