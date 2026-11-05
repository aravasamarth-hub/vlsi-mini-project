# Setup environment variables for EDA tools locally in this session
$ToolRoot = "D:\mini project\tools\oss-cad-suite"
$KLayoutRoot = "C:\Users\arava\AppData\Roaming\KLayout"
$VenvRoot = "D:\mini project\.venv\Scripts"

$env:YOSYSHQ_ROOT = $ToolRoot
$env:SSL_CERT_FILE = Join-Path $ToolRoot "etc\cacert.pem"
$env:QT_PLUGIN_PATH = Join-Path $ToolRoot "lib\qt6\plugins"
$env:QT_LOGGING_RULES = "*=false"
$env:GTK_EXE_PREFIX = $ToolRoot
$env:GTK_DATA_PREFIX = $ToolRoot
$env:GDK_PIXBUF_MODULEDIR = Join-Path $ToolRoot "lib\gdk-pixbuf-2.0\2.10.0\loaders"
$env:GDK_PIXBUF_MODULE_FILE = Join-Path $ToolRoot "lib\gdk-pixbuf-2.0\2.10.0\loaders.cache"

$env:PATH = "$ToolRoot\bin;$ToolRoot\lib;$KLayoutRoot;$VenvRoot;" + $env:PATH

Write-Host "Local EDA Environment Configured:" -ForegroundColor Green
Write-Host "  Icarus Verilog : $(iverilog -V | Select-Object -First 1)"
Write-Host "  Yosys          : $(yosys -V)"
Write-Host "  Python         : $(python --version)"
Write-Host "  KLayout Path   : $KLayoutRoot"

