@echo off
echo ===================================
echo        AgroMart Application
echo ===================================

:MENU
cls
echo Choose what to start:
echo.
echo [1] Start Frontend (Dev Server)
echo [2] Start Backend
echo [3] Start Both (Frontend + Backend)
echo [4] Exit
echo.
choice /C 1234 /N /M "Enter your choice (1-4): "

if errorlevel 4 goto EXIT
if errorlevel 3 goto BOTH
if errorlevel 2 goto BACKEND
if errorlevel 1 goto FRONTEND

:FRONTEND
cls
echo Starting Frontend...
cd /d D:\AgroMart\frontend
start cmd /k "npm run dev"
goto END

:BACKEND
cls
echo Starting Backend...
cd /d D:\AgroMart\backend
start cmd /k "npm start"
goto END

:BOTH
cls
echo Starting Backend...
cd /d D:\AgroMart\backend
start cmd /k "npm start"
timeout /t 2 /nobreak > nul
echo Starting Frontend...
cd /d D:\AgroMart\frontend
start cmd /k "npm run dev"
goto END

:EXIT
echo Exiting...
exit

:END
echo.
echo Application(s) started in new command windows.
echo Note: Close those windows when you want to stop the servers.
echo.
pause
goto MENU 