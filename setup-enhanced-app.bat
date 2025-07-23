@echo off
echo ========================================
echo    SETTING UP ENHANCED GQCARS APP
echo ========================================

echo.
echo Step 1: Stopping any running Expo servers...
taskkill /f /im node.exe 2>nul
taskkill /f /im expo.exe 2>nul

echo.
echo Step 2: Pulling latest enhanced code from GitHub...
git pull origin main

echo.
echo Step 3: Installing dependencies...
npm install

echo.
echo Step 4: Clearing Expo cache...
npx expo install --fix

echo.
echo Step 5: Starting enhanced Expo server with tunnel...
echo.
echo ========================================
echo    ENHANCED APP STARTING...
echo    Look for QR code below!
echo ========================================
echo.

npx expo start --tunnel --clear

pause
