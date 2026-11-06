import hashlib
import os
from pathlib import Path

def get_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

files_to_check = [
    # RTL
    "rtl/carry_skip_adder.v",
    "rtl/carry_skip_block_4bit.v",
    "rtl/ripple_carry_adder.v",
    "rtl/cla_16bit.v",
    "rtl/csl_16bit.v",
    "rtl/brent_kung_16bit.v",
    "rtl/full_adder.v",
    "rtl/half_adder.v",
    # Verification
    "verification/common_reference_model.v",
    "verification/tb_carry_skip_adder.v",
    "verification/tb_ripple_carry_adder.v",
    "verification/tb_cla_16bit.v",
    "verification/tb_csl_16bit.v",
    "verification/tb_brent_kung_16bit.v",
    "verification/tb_exhaustive_cska.v",
    # OpenROAD Artifacts
    "openroad_experiment/artifacts/sky130hs_cska/6_final.gds",
    "openroad_experiment/artifacts/sky130hs_cska/6_final.def",
    "openroad_experiment/artifacts/sky130hs_cska/6_final.spef",
    "openroad_experiment/artifacts/sky130hs_cska/6_final.sdc",
    "openroad_experiment/artifacts/sky130hs_cska/6_final.v",
    "openroad_experiment/artifacts/sky130hd_cska/6_final.gds",
    "openroad_experiment/artifacts/sky130hd_cska/6_final.def",
    "openroad_experiment/artifacts/sky130hd_cska/6_final.spef",
    "openroad_experiment/artifacts/sky130hd_cska/6_final.sdc",
    "openroad_experiment/artifacts/sky130hd_cska/6_final.v",
    "openroad_experiment/artifacts/sky130hs_rca/6_final.gds",
    "openroad_experiment/artifacts/sky130hs_rca/6_final.def",
    "openroad_experiment/artifacts/sky130hs_rca/6_final.spef",
    "openroad_experiment/artifacts/sky130hs_rca/6_final.sdc",
    "openroad_experiment/artifacts/sky130hs_rca/6_final.v",
    "openroad_experiment/artifacts/sky130hd_rca/6_final.gds",
    "openroad_experiment/artifacts/sky130hd_rca/6_final.def",
    "openroad_experiment/artifacts/sky130hd_rca/6_final.spef",
    "openroad_experiment/artifacts/sky130hd_rca/6_final.sdc",
    "openroad_experiment/artifacts/sky130hd_rca/6_final.v",
    # Submission Zip
    "submission/CYBERCORE_3D_16BIT_CSKA_FINAL_SUBMISSION.zip",
    "openroad_experiment/openroad_physical_design_results.zip"
]

out = ["# FINAL PROJECT INVENTORY & CRYPTOGRAPHIC HASH REGISTER",
       "**Project:** CYBERCORE 3D — 16-Bit Carry Skip Adder Physical Implementation",
       "**Git Branch:** `feature/openroad-physical-design` (HEAD: `144ecbe`, Base: `6366466`)",
       "**Audit Date:** November 2026\n",
       "| Component | Relative Path | File Size (Bytes) | SHA-256 Checksum |",
       "| :--- | :--- | :---: | :--- |"]

for f in files_to_check:
    p = Path(f)
    if p.exists():
        size = p.stat().st_size
        sha = get_sha256(p)
        out.append(f"| `{p.parts[0]}` | `{p.as_posix()}` | {size:,} | `{sha}` |")
    else:
        out.append(f"| `{p.parts[0]}` | `{p.as_posix()}` | Missing | `NOT FOUND` |")

with open("documentation/FINAL_PROJECT_INVENTORY.md", "w") as fp:
    fp.write("\n".join(out) + "\n")

print("Inventory generated successfully.")

