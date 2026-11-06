import os
import shutil
import zipfile
from pathlib import Path

base_dir = Path("D:/mini project")
target_dir = base_dir / "CYBERCORE_3D_FINAL"
zip_path = base_dir / "CYBERCORE_3D_FINAL_SUBMISSION.zip"

if target_dir.exists():
    shutil.rmtree(target_dir)
target_dir.mkdir(parents=True)

# 1. RTL
shutil.copytree(base_dir / "rtl", target_dir / "rtl")

# 2. Verification & Testbenches
(target_dir / "verification").mkdir()
for f in (base_dir / "verification").glob("*.v"):
    shutil.copy2(f, target_dir / "verification")

# 3. Documentation
shutil.copytree(base_dir / "documentation", target_dir / "documentation")

# 4. OpenROAD Artifacts (Physical Design)
pd_dir = target_dir / "physical_design"
pd_dir.mkdir()
shutil.copytree(base_dir / "openroad_experiment/artifacts/sky130hd_cska", pd_dir / "sky130hd_cska")
shutil.copytree(base_dir / "openroad_experiment/artifacts/sky130hs_cska", pd_dir / "sky130hs_cska")
shutil.copytree(base_dir / "openroad_experiment/artifacts/sky130hd_rca", pd_dir / "sky130hd_rca")
shutil.copytree(base_dir / "openroad_experiment/artifacts/sky130hs_rca", pd_dir / "sky130hs_rca")

# 5. OpenROAD Documentation & Logs
shutil.copytree(base_dir / "openroad_experiment/documentation", target_dir / "reports")
shutil.copytree(base_dir / "openroad_experiment/logs", target_dir / "logs")

# 6. Scripts & Guide
(target_dir / "scripts").mkdir()
for f in (base_dir / "scripts").glob("*.tcl"):
    shutil.copy2(f, target_dir / "scripts")
for f in (base_dir / "scripts").glob("*.py"):
    shutil.copy2(f, target_dir / "scripts")

shutil.copy2(base_dir / "documentation/REPRODUCIBILITY_GUIDE.md", target_dir / "REPRODUCIBILITY_GUIDE.md")

# Create README.md
readme_content = """# CYBERCORE 3D — 16-Bit Carry Skip Adder Academic Submission Package
Technology: SkyWater 130nm CMOS (sky130hd and sky130hs)

Contents:
- rtl/: Synthesizable Verilog RTL for CSKA, RCA, CLA, CSLA, and Brent-Kung adders.
- verification/: Testbenches and common golden reference model.
- physical_design/: Full OpenROAD physical design deliverables (GDS, DEF, SPEF, SDC, netlists).
- reports/: Detailed evidence, timing sensitization, and physical verification reports.
- documentation/: Master academic project report, viva guide, and environment validation.
- logs/: Raw OpenSTA, TritonRoute, and synthesis logs.
- scripts/: OpenSTA, OpenROAD, and Python verification scripts.
- REPRODUCIBILITY_GUIDE.md: Step-by-step reproduction instructions.
"""
with open(target_dir / "README.md", "w") as f:
    f.write(readme_content)

# Zip
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            file_path = Path(root) / file
            arcname = file_path.relative_to(target_dir.parent)
            zipf.write(file_path, arcname)

size = zip_path.stat().st_size
print(f"Created {zip_path} ({size:,} bytes)")

