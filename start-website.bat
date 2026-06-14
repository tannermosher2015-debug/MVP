@echo off
title Real Estate on Molokai
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo.
echo   ============================================================
echo      REAL ESTATE ON MOLOKAI
echo   ============================================================
echo.

if not exist ".next\BUILD_ID" (
  echo   First-time setup: preparing the website (about 30-60 sec)...
  echo.
  call npm run build
)

echo   Starting the website. Your browser will open in a few seconds.
echo.

start "Real Estate on Molokai - server (keep this window open)" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && npm run start"

timeout /t 6 /nobreak >nul
start chrome "http://localhost:3000" || start "" "http://localhost:3000"

exit
