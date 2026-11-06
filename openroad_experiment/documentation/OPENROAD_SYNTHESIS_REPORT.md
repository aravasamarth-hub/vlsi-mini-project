# OPENROAD SYNTHESIS REPORT — CSKA & RCA
**Synthesis Engine:** Yosys 0.68+post with ABC logic optimization  
**Target Libraries:** SkyWater 130nm High-Density (`sky130hd`) and High-Speed (`sky130hs`)  
**Operating Conditions:** TT, 25°C, 1.80V  

---

## 1. Synthesis Methodology
The 16-bit Carry Skip Adder (CSKA) and 16-bit Ripple Carry Adder (RCA) were synthesized using OpenROAD flow scripts with hierarchical preservation flags (`SYNTH_HIERARCHICAL = 1`). This prevents ABC from flattening the architecture into unstructured majority/XNOR networks and preserves the 4-bit skip blocks and bypass multiplexers.

## 2. Gate-Level Mappings
### 16-Bit Hierarchical CSKA (4 Blocks of 4-bit Adders + 4 Skip Multiplexers):
- **SKY130HD Mapped Standard Cells:**
  - `sky130_fd_sc_hd__fa_1` / `maj3_1` / `xor3_1`: 16 full-adder bit slices.
  - `sky130_fd_sc_hd__and4_1`: 4 group propagate detectors ($P_{[0:3]}, P_{[4:7]}, P_{[8:11]}, P_{[12:15]}$).
  - `sky130_fd_sc_hd__mux2_1`: 4 2:1 carry bypass multiplexers.
  - Multi-input combinational cell count: **40 cells**
  - Raw gate area: **565.54 µm²**

- **SKY130HS Mapped Standard Cells:**
  - `sky130_fd_sc_hs__fa_1`: 16 high-speed full-adder cells.
  - `sky130_fd_sc_hs__and4_1`: 4 high-speed group propagate gates.
  - `sky130_fd_sc_hs__mux2_1`: 4 high-speed 2:1 multiplexers.
  - Multi-input combinational cell count: **40 cells**
  - Raw gate area: **773.63 µm²**

### 16-Bit Ripple Carry Adder:
- **SKY130HD:** 16 full adders (`sky130_fd_sc_hd__fa_1`), **16 cells**, raw area **320.31 µm²**.
- **SKY130HS:** 16 high-speed full adders (`sky130_fd_sc_hs__fa_1`), **16 cells**, raw area **460.34 µm²**.

## 3. Structural Equivalence Verification
Both synthesized netlists (`1_2_yosys.v` and `6_final.v`) were verified using Yosys formal equivalence checking (LEC) against the input RTL source files:
- `CSKA`: 100% equivalent (0 unmapped keys, 0 logic discrepancies).
- `RCA`: 100% equivalent.
