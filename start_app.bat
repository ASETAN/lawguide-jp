@echo off
cd /d %~dp0
echo Current Directory: %CD%
echo Starting LawGuideJP System...
echo ===================================

echo 1. Starting Backend Server (Port 3001)...
start "LawGuideJP Backend" cmd /k "cd server && npm start || pause"

echo 2. Starting Frontend Server (Port 5173)...
start "LawGuideJP Frontend" cmd /k "cd client && npm run dev || pause"

echo 3. Waiting for servers to initialize...
echo Browser will open automatically when ready...
timeout /t 5

echo ===================================
echo Application is running!
echo Close the command windows to stop the servers.
pause
