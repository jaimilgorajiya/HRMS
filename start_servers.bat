@echo off
TITLE HRMS System Starter
COLOR 0A

echo ========================================
echo   Starting HRMS Application Suite
echo ========================================

echo.
echo [1/2] Starting BACKEND (Node.js/Nodemon)...
start cmd /k "cd /d %~dp0backend && nodemon server.js"

echo [2/2] Starting FRONTEND (Vite/React)...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are now starting!
echo   Keep this window open to manage them.
echo ========================================
echo.
pause





