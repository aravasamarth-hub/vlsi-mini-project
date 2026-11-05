@echo off
setlocal enabledelayedexpansion
title CYBERCORE 3D VLSI Engineering Lab - Launcher

echo ==============================================================================
echo       CYBERCORE 3D - 16-BIT CARRY SKIP ADDER USING SKY130 PDK
echo                      SYSTEM STARTUP LAUNCHER
echo ==============================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo [*] Step 1: Mapping Virtual Drive X: to eliminate space path issues...
subst X: "%PROJECT_DIR:~0,-1%" >nul 2>&1
if exist X:\ (
    echo     [+] Drive X: successfully mapped to "%PROJECT_DIR:~0,-1%".
) else (
    echo     [!] Note: Drive X: mapping skipped or already in use.
)

echo [*] Step 2: Checking Python Virtual Environment...
if exist "%PROJECT_DIR%.venv\Scripts\python.exe" (
    echo     [+] Python venv detected at .venv\Scripts\python.exe
) else (
    echo     [ERROR] Python venv not found! Please create and install dependencies.
    pause
    exit /b 1
)

echo [*] Step 3: Starting FastAPI REST Telemetry Backend (Port 8000)...
start "CyberCore FastAPI Daemon" /B "%PROJECT_DIR%.venv\Scripts\python.exe" -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 > "%PROJECT_DIR%backend_server.log" 2>&1
echo     [+] Backend daemon launched. API documentation at: http://127.0.0.1:8000/docs

echo [*] Step 4: Starting Frontend Production Server (Port 3000)...
cd /d "%PROJECT_DIR%frontend"
start "CyberCore Frontend Preview" /B npm run preview -- --port 3000 --host > "%PROJECT_DIR%frontend_server.log" 2>&1
cd /d "%PROJECT_DIR%"
echo     [+] Frontend server launched. Web app at: http://localhost:3000

echo [*] Step 5: Starting Streamlit Analytics Dashboard (Port 8501)...
start "CyberCore Streamlit Dashboard" /B "%PROJECT_DIR%.venv\Scripts\streamlit.exe" run "%PROJECT_DIR%dashboard\app.py" --server.port 8501 --server.headless true > "%PROJECT_DIR%dashboard_server.log" 2>&1
echo     [+] Streamlit dashboard launched at: http://localhost:8501

echo.
echo ==============================================================================
echo                     ALL CYBERCORE 3D SERVICES ACTIVE
echo ==============================================================================
echo   - 3D Web Application : http://localhost:3000
echo   - FastAPI REST API   : http://127.0.0.1:8000 (Health: /api/health)
echo   - Interactive Docs   : http://127.0.0.1:8000/docs
echo   - Analytics Dashboard: http://localhost:8501
echo ==============================================================================
echo.
echo Press any key to open the application in your default web browser...
pause >nul
start http://localhost:3000
exit /b 0
