@echo off
title DRONA AI System - Backend & Frontend
cd /d "%~dp0"
echo Starting DRONA AI System...
echo.
start /min cmd /k "cd drona-AI Backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2 >nul
start /min cmd /k "cd drona-AI Frontend && npm run dev"
timeout /t 5 >nul
start msedge http://localhost:3000
timeout /t 1 >nul
start msedge http://localhost:8000/docs
timeout /t 2 >nul
cls
echo.
echo =====================================
echo DRONA AI System is Running...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo Docs:     http://localhost:8000/docs
echo.
echo =====================================
echo.
timeout /t 3 >nul
exit
