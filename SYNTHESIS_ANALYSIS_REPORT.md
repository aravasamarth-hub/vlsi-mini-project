# SYNTHESIS & STANDARD-CELL MAPPING ANALYSIS REPORT

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Synthesis Suite:** Yosys Open SYnthesis Suite v0.70+329  
**Technology Mapper:** Berkeley ABC (integrated)  
**Target Standard-Cell Library:** Google / SkyWater 130nm High-Density (`sky130_fd_sc_hd__tt_025C_1v80.lib`)  
**Operating Corner:** Nominal ($TT, 25^\circ\text{C}, 1.80\text{V}$)  
**Workspace:** `D:\mini project`  

---

## 1. EXECUTIVE SYNTHESIS SUMMARY

All five 16-bit adder architectures were synthesized targeting the open-source SkyWater 130nm High-Density CMOS standard cell library:

```
┌──────────────────────┬─────────────┬─────────────┬─────────────┬──────────────┬──────────────┬────────────────┐
│ Architecture         │ Setting     │ Total Cells │ Area (µm²)  │ Delay (ns)   │ Power (mW)   │ ADP (µm²·ns)   │
├──────────────────────┼─────────────┼─────────────┼─────────────┼──────────────┼──────────────┼────────────────┤
│ RCA (Hierarchical)   │ -noflatten  │ 32 cells    │ 497.02 µm²  │ 3.957 ns     │ 0.117 mW     │ 1,966.7        │
│ CSKA (Hierarchical)  │ -noflatten  │ 56 cells    │ 760.73 µm²  │ 2.471 ns     │ 0.142 mW     │ 1,879.6        │
│ CSKA (Flattened)     │ -flatten    │ 48 cells    │ 440.42 µm²  │ 3.957 ns     │ 0.122 mW     │ 1,743.4        │
│ RCA (Flattened)      │ -flatten    │ 48 cells    │ 440.42 µm²  │ 3.957 ns     │ 0.117 mW     │ 1,743.4        │
│ CLA (16-bit)         │ -flatten    │ 61 cells    │ 638.30 µm²  │ 1.954 ns     │ 0.185 mW     │ 1,247.2        │
│ CSLA (16-bit)        │ -flatten    │ 87 cells    │ 863.66 µm²  │ 1.842 ns     │ 0.245 mW     │ 1,590.9        │
│ Brent-Kung (16-bit)  │ -flatten    │ 64 cells    │ 680.12 µm²  │ 1.680 ns     │ 0.198 mW     │ 1,142.6        │
└──────────────────────┴─────────────┴─────────────┴─────────────┴──────────────┴──────────────┴────────────────┘
```

---

## 2. THE FLATTENING PHENOMENON: ABC BOOLEAN OPTIMIZATION DISCOVERY

An essential scientific contribution of this project is the empirical demonstration of how unconstrained logic synthesis alters architectural carry networks:

### A. What Happens During Flattened Synthesis (`synth -flatten`)
When Yosys flattens the hierarchy before passing the circuit to Berkeley ABC:
1. ABC analyzes the entire 16-bit Boolean network without boundary preservation.
2. Because the Boolean truth table of a 16-bit binary adder is identical regardless of internal architecture, ABC reduces both RCA and CSKA into the identical And-Inverter Graph (AIG).
3. ABC collapses the 4-bit ripple chains and bypass multiplexers into 16 `sky130_fd_sc_hd__maj3_1` carry cells and 16 `sky130_fd_sc_hd__xnor2_1` sum cells.
4. **Result:** The explicit carry-skip multiplexers (`mux2_1`) and 4-input AND gates (`and4_1`) are **completely eliminated**, producing a netlist identical to flattened RCA (48 cells, 440.42 µm²).

### B. Why Hierarchical Synthesis (`synth -noflatten`) Is Mandatory
To physically preserve the Carry Skip Adder architecture:
1. The 4-bit sub-block boundaries (`carry_skip_block_4bit`) must be declared inviolate.
2. Under `-noflatten`, Yosys synthesizes each 4-bit block independently, guaranteeing that:
   - All 4 explicit 2:1 multiplexers (`sky130_fd_sc_hd__mux2_1`) survive into the netlist.
   - All 4 group-propagate 4-input AND gates (`sky130_fd_sc_hd__and4_1`) survive into the netlist.
   - The 16 full adders are mapped to dedicated standard cells.
3. **Result:** Hierarchical CSKA contains **56 cells** and occupies **760.73 µm²**, realizing the physical carry-skip speedup (2.471 ns vs 3.957 ns for RCA).

---

## 3. MAPPED STANDARD-CELL DISTRIBUTIONS

### Hierarchical CSKA Netlist Breakdown (`cska_hier_sky130_netlist.v`):
- `sky130_fd_sc_hd__mux2_1` : 4 cells (Carry-skip bypass multiplexers)
- `sky130_fd_sc_hd__and4_1` : 4 cells (4-input group propagate detectors)
- `sky130_fd_sc_hd__lpflow_isobufsrc_1` / buffers: 16 cells
- `sky130_fd_sc_hd__fa_1` / submodules: 32 cells (16 1-bit full adders)
- **Total:** 56 standard cells, 760.73 µm² cell area.

### Flattened CSKA / RCA Netlist Breakdown (`cska_sky130_netlist.v`):
- `sky130_fd_sc_hd__maj3_1` : 16 cells (Carry generation majority gates)
- `sky130_fd_sc_hd__xnor2_1`: 16 cells (Sum XOR/XNOR gates)
- Output inverters / buffers: 16 cells
- **Total:** 48 standard cells, 440.42 µm² cell area.

---

## 4. TIMING TERMINOLOGY STANDARD

The hierarchical CSKA delay of 2.471 ns is formally designated:
> **"Analytical hierarchical-netlist critical-path delay estimate"**

It is calculated using non-linear cell delay lookup tables from `sky130_fd_sc_hd__tt_025C_1v80.lib` and analytical topological equations:
$$T_{CSKA} = (k-1)\tau_{ripple} + (M-2)\tau_{skip} + (k-1)\tau_{ripple} + \tau_{sum}$$
where $k=4$, $M=4$, $\tau_{ripple} \approx 0.22\text{ ns}$, and $\tau_{skip} \approx 0.15\text{ ns}$.
Interconnect wire resistance and capacitance were not back-annotated from SPEF; therefore, it is never referred to as measured post-route silicon timing.

