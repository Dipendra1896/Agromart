Set-Location -Path "D:\AgroMart\backend"
Write-Host "Attempting to create admin user..."
node create-admin.js
Write-Host "Press Enter to exit..."
$null = Read-Host 