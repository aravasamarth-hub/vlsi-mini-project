@echo off
REM ==============================================================================
REM CYBERCORE 3D - Launch KLayout GDSII Silicon Viewer via WSL
REM ==============================================================================

set DESIGN=%1
if "%DESIGN%"=="" set DESIGN=hs_cska

echo =====================================================================
echo  CYBERCORE 3D - Launching KLayout GDSII Viewer for: %DESIGN%
echo =====================================================================

if /I "%DESIGN%"=="hs_cska" (
    wsl klayout "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hs_cska/6_final.gds" -l "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hs.lyp"
) else if /I "%DESIGN%"=="hd_cska" (
    wsl klayout "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hd_cska/6_final.gds" -l "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hd.lyp"
) else if /I "%DESIGN%"=="hs_rca" (
    wsl klayout "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hs_rca/6_final.gds" -l "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hs.lyp"
) else if /I "%DESIGN%"=="hd_rca" (
    wsl klayout "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hd_rca/6_final.gds" -l "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design/sky130hd.lyp"
) else (
    echo Unknown design: %DESIGN%
    echo Available options: hs_cska, hd_cska, hs_rca, hd_rca
)

