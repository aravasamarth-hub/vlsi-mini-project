# CYBERCORE 3D VLSI PROJECT RULES

These rules govern the development, simulation, synthesis, and physical verification workflow for the 16-Bit Carry Skip Adder project targeting the SkyWater 130nm PDK.

## 1. RTL Verification & Integrity
- All Verilog modules must be fully synthesizable (Verilog-2005 / SystemVerilog standard).
- Never report pseudo-random simulation as "formal equivalence". Explicitly label tests as "simulation-based verification" or "pseudo-random test vectors".
- Always verify DUT outputs against a bit-accurate golden model: `{Cout, SUM} = A + B + Cin`.
- Boundary corner cases (Zero, Max Saturation, Walking Ones, Worst-Case Ripple, Full Carry Skip) must be tested in addition to random vectors.

## 2. Logic Synthesis & Technology Mapping
- Target the official SkyWater 130nm High-Density library: `sky130_fd_sc_hd__tt_025C_1v80.lib`.
- In Yosys scripts, always verify hierarchy before mapping: `hierarchy -check -top <module>`.
- Audit post-synthesis statistics for unmapped logic (`$scopeinfo` or unresolved internal primitives).
- Ensure discrete carry skip multiplexers and propagate gates are preserved when evaluating architectural structural depth.

## 3. Physical Implementation & Layout
- Ensure all standard-cell placements align strictly to the Sky130 HD site grid ($2.72\,\mu\text{m}$ row height, $0.46\,\mu\text{m}$ site width).
- Enforce alternating row orientation (`N` and `FS` / `MX`) to ensure VDD/VSS power rail sharing across adjacent standard-cell rows.
- Distinguish placement-only DEF databases from full detailed routed (TritonRoute) databases. Do not claim signoff routing, DRC, or LVS unless genuine physical verification logs are generated.

## 4. Frontend & 3D WebGL Standards
- React 18, Three.js, and React Three Fiber components must compile with zero TypeScript errors (`tsc --noEmit`).
- Three.js geometries and materials must be properly disposed on unmount to prevent WebGL memory leaks.
- All hardware telemetry and PPA figures displayed in the dashboard must pull directly from authentic JSON project artifacts (`analysis/comparison_results.json`).
