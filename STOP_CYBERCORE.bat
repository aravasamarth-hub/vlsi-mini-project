@echo off
setlocal enabledelayedexpansion
title CYBERCORE 3D VLSI Engineering Lab - Shutdown

echo ==============================================================================
echo       CYBERCORE 3D - 16-BIT CARRY SKIP ADDER USING SKY130 PDK
echo                      SYSTEM SHUTDOWN UTILITY
echo ==============================================================================
echo.

echo [*] Searching for active CYBERCORE 3D port listeners (8000, 3000, 8501)...

for %%P in (8000 3000 8501) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%P" ^| findstr "LISTENING"') do (
        set "PID=%%a"
        if defined PID (
            echo     [-] Terminating process on port %%P (PID !PID!)...
            taskkill /F /PID !PID! >nul 2>&1
        )
    )
)

echo.
echo [*] Cleaning up virtual drive mapping X:...
subst X: /d >nul 2>&1

echo.
echo ==============================================================================
echo              CYBERCORE 3D SERVICES SAFELY TERMINATED
echo ==============================================================================
echo.
timeout /t 3 >nul
exit /b 0
