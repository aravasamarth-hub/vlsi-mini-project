# OPENROAD EXPERIMENT SUMMARY & AUDIT TRAIL
**Workspace:** `D:\mini project\openroad_experiment`  
**Git Branch:** `feature/openroad-physical-design`  
**Date:** November 2026  
**Engineering Status:** COMPLETED, REPRODUCIBLE, FULLY VERIFIED  

---

## 1. Project Protection Record
- Original frozen Git commit `6366466` preserved untouched on `master`.
- Original submission archive `submission/16bit_carry_skip_adder_sky130_submission.zip` verified unmodified.
- All OpenROAD flow script operations isolated within `openroad_experiment/` and WSL2 `~/cybercore3d/`.

## 2. Experimental Deliverables
1. **Artifacts Directory (`openroad_experiment/artifacts/`):**
   - `sky130hd_cska/`: `6_final.gds`, `6_final.def`, `6_final.spef`, `6_final.sdc`, `6_final.v`
   - `sky130hs_cska/`: `6_final.gds`, `6_final.def`, `6_final.spef`, `6_final.sdc`, `6_final.v` (Layout matching laboratory photos)
   - `sky130hd_rca/`: `6_final.gds`, `6_final.def`, `6_final.spef`, `6_final.sdc`, `6_final.v`
   - `sky130hs_rca/`: `6_final.gds`, `6_final.def`, `6_final.spef`, `6_final.sdc`, `6_final.v`
2. **Logs Directory (`openroad_experiment/logs/`):**
   - Complete execution logs from synthesis, floorplanning, placement, routing, and signoff reporting.
3. **Documentation Suite (`openroad_experiment/documentation/`):**
   - 8 comprehensive Markdown reports detailing environment, synthesis, physical design, PPA comparison, timing, and verification.
