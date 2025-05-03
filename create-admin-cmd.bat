@echo off
echo ======================================
echo    Adding Admin User to AgroMart
echo ======================================
echo.
cd D:\AgroMart\backend
echo Running script from: %CD%
echo.
echo Attempting to create admin user...
node create-admin.js
echo.
echo If you didn't see any errors, the admin user was likely created successfully.
echo Admin credentials:
echo   Email: admin@agromart.com
echo   Password: agromart123
echo.
echo Press any key to exit...
pause > nul 