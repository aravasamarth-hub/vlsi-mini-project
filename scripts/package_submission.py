#!/usr/bin/env python3
"""
CYBERCORE 3D VLSI PROJECT - SUBMISSION PACKAGING UTILITY
======================================================
Automated archive generator that packages the complete academic and industrial
deliverables into a clean, distributable ZIP package:
'submission/16bit_carry_skip_adder_sky130_submission.zip'

Filters out transient build artifacts:
- Excludes .venv/
- Excludes node_modules/
- Excludes .git/
- Excludes portable toolchain installers (tools/)
- Preserves synthesizable RTL, testbenches, verification logs,
  synthesis netlists, reports, physical layout DEF & GDSII (4.09 MB),
  high-res charts, frontend sources & dist, backend API, and all documentation.
"""

import os
import sys
import zipfile
import time
from typing import List

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBMISSION_DIR = os.path.join(PROJECT_ROOT, "submission")
ARCHIVE_NAME = "16bit_carry_skip_adder_sky130_submission.zip"
OUTPUT_ZIP_PATH = os.path.join(SUBMISSION_DIR, ARCHIVE_NAME)

EXCLUDED_DIRS = {
    ".venv",
    "node_modules",
    ".git",
    "tools",
    "__pycache__",
    ".pytest_cache",
    ".idea",
    ".vscode"
}

EXCLUDED_EXTENSIONS = {
    ".pyc",
    ".pyo"
}

def should_include_file(rel_path: str) -> bool:
    """Evaluates whether a relative path should be packaged."""
    parts = rel_path.replace("\\", "/").split("/")
    for part in parts:
        if part in EXCLUDED_DIRS:
            return False
    _, ext = os.path.splitext(rel_path)
    if ext.lower() in EXCLUDED_EXTENSIONS:
        return False
    return True

def package_project():
    print("=" * 80)
    print(" CYBERCORE 3D VLSI PROJECT - PACKAGING SUBMISSION DELIVERABLE")
    print(" Project: 16-Bit Carry Skip Adder using SkyWater 130nm PDK")
    print("=" * 80)

    if not os.path.exists(SUBMISSION_DIR):
        os.makedirs(SUBMISSION_DIR, exist_ok=True)

    included_files: List[str] = []
    total_uncompressed_bytes = 0

    print("Scanning project tree...")
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # In-place directory filtering
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, PROJECT_ROOT)
            
            # Avoid self-packaging the output zip or other archives in submission
            if rel_path.startswith("submission"):
                continue

            if should_include_file(rel_path):
                included_files.append((full_path, rel_path))
                total_uncompressed_bytes += os.path.getsize(full_path)

    print(f"Total candidate files to package : {len(included_files)}")
    print(f"Uncompressed payload size         : {total_uncompressed_bytes / (1024 * 1024):.2f} MB")
    print(f"Target archive destination       : {OUTPUT_ZIP_PATH}")
    print("-" * 80)

    start_time = time.time()
    with zipfile.ZipFile(OUTPUT_ZIP_PATH, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for idx, (full_path, rel_path) in enumerate(included_files, start=1):
            if idx % 50 == 0 or idx == len(included_files):
                print(f"  [{idx:03d}/{len(included_files):03d}] Adding: {rel_path}")
            zipf.write(full_path, arcname=os.path.join("carry_skip_adder_16bit_sky130", rel_path))

    elapsed = time.time() - start_time
    compressed_bytes = os.path.getsize(OUTPUT_ZIP_PATH)
    ratio = (1.0 - (compressed_bytes / total_uncompressed_bytes)) * 100.0 if total_uncompressed_bytes > 0 else 0.0

    print("-" * 80)
    print(" >>> PACKAGING COMPLETED SUCCESSFULLY <<<")
    print(f" Archive Created        : {OUTPUT_ZIP_PATH}")
    print(f" Final Archive Size     : {compressed_bytes / (1024 * 1024):.2f} MB ({compressed_bytes:,} bytes)")
    print(f" Compression Ratio      : {ratio:.1f}% space saved")
    print(f" Elapsed Packaging Time : {elapsed:.2f} seconds")
    print("=" * 80)

    # Generate submission manifest
    manifest_path = os.path.join(SUBMISSION_DIR, "SUBMISSION_MANIFEST.txt")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("CYBERCORE 3D - OFFICIAL PROJECT SUBMISSION MANIFEST\n")
        f.write(f"Archive: {ARCHIVE_NAME}\n")
        f.write(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total Packaged Files: {len(included_files)}\n")
        f.write(f"Archive Size: {compressed_bytes / (1024 * 1024):.2f} MB\n")
        f.write("=" * 80 + "\n\n")
        f.write("KEY DELIVERABLES INCLUDED:\n")
        f.write("1. RTL Source Code (rtl/*.v - 5 adder architectures + primitives)\n")
        f.write("2. Automated Self-Checking Testbenches (verification/*.v - 60,046 vectors)\n")
        f.write("3. SkyWater 130nm Synthesis Gate Netlists & Reports (synthesis/)\n")
        f.write("4. Physical Implementation (DEF placement, SDC timing, GDSII layout stream - 4.09 MB)\n")
        f.write("5. PPA Performance Analysis, Charts & Multi-Attribute Recommendation Engine (analysis/)\n")
        f.write("6. CYBERCORE 3D Web Application (frontend/ with production dist/ bundle)\n")
        f.write("7. FastAPI Telemetry Backend & Streamlit Interactive Dashboard (backend/, dashboard/)\n")
        f.write("8. Complete Academic Documentation & Viva Defense Guide (documentation/, *.md)\n\n")
        f.write("-" * 80 + "\n")
        f.write("COMPLETE FILE INVENTORY:\n")
        for _, rel_path in sorted(included_files, key=lambda x: x[1]):
            f.write(f"  {rel_path}\n")

    print(f"Manifest generated at: {manifest_path}")

if __name__ == "__main__":
    package_project()
