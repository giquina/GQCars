@echo off
title GQCars Enhanced App Setup
color 0A

echo.
echo ========================================
echo    GQCARS ENHANCED APP AUTO-SETUP
echo ========================================
echo.
echo This will automatically:
echo 1. Open your terminal
echo 2. Navigate to your GQCars folder
echo 3. Pull the latest enhanced code
echo 4. Install dependencies
echo 5. Start the enhanced app with QR code
echo.
echo ========================================
echo.

echo Checking if we're in the right directory...
if not exist "package.json" (
    echo ERROR: Not in GQCars directory!
    echo Please put this file in: C:\Users\Owner\GQCars\GQCars\
    echo Then double-click it again.
    pause
    exit
)

echo ✓ Found package.json - we're in the right place!
echo.

echo Step 1: Pulling latest enhanced code from GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo ERROR: Git pull failed. Make sure you're connected to internet.
    pause
    exit
)
echo ✓ Latest code pulled successfully!
echo.

echo Step 2: Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed.
    pause
    exit
)
echo ✓ Dependencies installed successfully!
echo.

echo Step 3: Starting enhanced Expo server...
echo.
echo ========================================
echo    ENHANCED APP STARTING...
echo    QR CODE WILL APPEAR BELOW!
echo    Scan it with Expo Go on your phone!
echo ========================================
echo.

npx expo start --tunnel --clear

echo.
echo If you see this, the server stopped.
pause
