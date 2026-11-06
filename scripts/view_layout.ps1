param(
    [ValidateSet("hs_cska", "hd_cska", "hs_rca", "hd_rca")]
    [string]$Design = "hs_cska"
)

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " CYBERCORE 3D - Launching KLayout GDSII Viewer for: $Design" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan

$baseDir = "/mnt/d/mini project/CYBERCORE_3D_FINAL/physical_design"
$designMap = @{
    "hs_cska" = @{ gds = "$baseDir/sky130hs_cska/6_final.gds"; lyp = "$baseDir/sky130hs.lyp" }
    "hd_cska" = @{ gds = "$baseDir/sky130hd_cska/6_final.gds"; lyp = "$baseDir/sky130hd.lyp" }
    "hs_rca"  = @{ gds = "$baseDir/sky130hs_rca/6_final.gds";  lyp = "$baseDir/sky130hs.lyp" }
    "hd_rca"  = @{ gds = "$baseDir/sky130hd_rca/6_final.gds";  lyp = "$baseDir/sky130hd.lyp" }
}

$target = $designMap[$Design]
wsl klayout $target.gds -l $target.lyp

