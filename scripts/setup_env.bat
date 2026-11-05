@echo off
set "ToolRoot=D:\mini project\tools\oss-cad-suite"
set "KLayoutRoot=C:\Users\arava\AppData\Roaming\KLayout"
set "VenvRoot=D:\mini project\.venv\Scripts"

set "YOSYSHQ_ROOT=%ToolRoot%"
set "SSL_CERT_FILE=%ToolRoot%\etc\cacert.pem"
set "QT_PLUGIN_PATH=%ToolRoot%\lib\qt6\plugins"
set "QT_LOGGING_RULES=*=false"
set "GTK_EXE_PREFIX=%ToolRoot%"
set "GTK_DATA_PREFIX=%ToolRoot%"
set "GDK_PIXBUF_MODULEDIR=%ToolRoot%\lib\gdk-pixbuf-2.0\2.10.0\loaders"
set "GDK_PIXBUF_MODULE_FILE=%ToolRoot%\lib\gdk-pixbuf-2.0\2.10.0\loaders.cache"

set "PATH=%ToolRoot%\bin;%ToolRoot%\lib;%KLayoutRoot%;%VenvRoot%;%PATH%"
echo Local EDA Environment Ready.
