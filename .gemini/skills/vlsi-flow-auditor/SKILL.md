---
name: vlsi-flow-auditor
description: Repeatable workflow for verifying Verilog RTL, running Yosys synthesis on SkyWater 130nm PDK, extracting PPA metrics, and validating KLayout GDSII streams.
---

# VLSI Flow Auditor Skill

Use this skill whenever compiling, simulating, synthesizing, or performing physical layout audits on digital adder designs in this workspace.

## 1. Quick Verification Commands
To re-run simulation of all 5 adder architectures (60,000+ vectors):
```cmd
& ".venv/Scripts/python.exe" "simulation/run_simulation.py"
```

## 2. Quick Synthesis Command
To re-run Yosys logic synthesis targeting SkyWater 130nm:
```cmd
& ".venv/Scripts/python.exe" "synthesis/run_synthesis.py"
```

## 3. Physical Layout Generation & Inspection
To re-generate DEF placement and GDSII stream:
```cmd
& ".venv/Scripts/python.exe" "physical_design/generate_physical_layout.py"
```
To view the resulting layout in KLayout:
```cmd
& "C:\Users\arava\AppData\Roaming\KLayout\klayout_app.exe" "physical_design/gds/cska_sky130.gds" -l "synthesis/sky130_pdk/sky130hd.lyp"
```

## 4. Key Rules
- Check synthesis logs in `synthesis/reports/*_synth.log` for unmapped cells or `$scopeinfo` pseudo-cells.
- Differentiate between structural cell count and logical gate counts.
- Never claim routing, DRC, or LVS clean without actual tool execution reports.

