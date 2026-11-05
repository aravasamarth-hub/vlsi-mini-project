@echo off
setlocal enabledelayedexpansion

echo ==============================================================================
echo        CYBERCORE - 16-BIT CARRY SKIP ADDER USING SKY130 PDK
echo        Master Engineering Automated Execution Pipeline
echo ==============================================================================

set "PROJECT_ROOT=D:\mini project"
cd /d "%PROJECT_ROOT%"

:: Activate local environment paths
call scripts\setup_env.bat

echo.
echo [STAGE 1/5] Running Multi-Architecture Functional Verification...
".venv\Scripts\python.exe" simulation\run_simulation.py
if %ERRORLEVEL% NEQ 0 (
    echo [-] Functional verification failed! Halting pipeline.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [STAGE 2/5] Running SkyWater 130nm Logic Synthesis with Yosys...
".venv\Scripts\python.exe" synthesis\run_synthesis.py
if %ERRORLEVEL% NEQ 0 (
    echo [-] Synthesis failed! Halting pipeline.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [STAGE 3/5] Generating Physical Placement and KLayout GDSII Layout...
".venv\Scripts\python.exe" physical_design\generate_physical_layout.py
".venv\Scripts\python.exe" physical_design\plot_layout.py
if %ERRORLEVEL% NEQ 0 (
    echo [-] Physical design layout generation failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [STAGE 4/5] Computing Critical Path Timing, Power, and PPA Matrix...
".venv\Scripts\python.exe" analysis\performance_analysis.py
if %ERRORLEVEL% NEQ 0 (
    echo [-] Performance analysis failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [STAGE 5/5] Launching CYBERCORE 3D Engineering Platform...
echo [*] Starting FastAPI Backend on http://127.0.0.1:8000
start "CYBERCORE-API" ".venv\Scripts\python.exe" -m uvicorn backend.app:app --port 8000 --host 127.0.0.1

echo [*] Starting CYBERCORE 3D Frontend on http://localhost:3000
cd frontend
start "CYBERCORE-3D-UI" npm run preview -- --port 3000 --host

echo.
echo ==============================================================================
echo [SUCCESS] Complete VLSI Pipeline Executed and Verified!
echo Application is running at: http://localhost:3000
echo Backend API docs at      : http://127.0.0.1:8000/docs
echo ==============================================================================
pause
