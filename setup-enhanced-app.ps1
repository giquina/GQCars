Write-Host "========================================" -ForegroundColor Green
Write-Host "    SETTING UP ENHANCED GQCARS APP" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Stopping any running Expo servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "expo" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "Step 2: Pulling latest enhanced code from GitHub..." -ForegroundColor Yellow
git pull origin main

Write-Host ""
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Step 4: Clearing Expo cache..." -ForegroundColor Yellow
npx expo install --fix

Write-Host ""
Write-Host "Step 5: Starting enhanced Expo server with tunnel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    ENHANCED APP STARTING..." -ForegroundColor Green
Write-Host "    Look for QR code below!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

npx expo start --tunnel --clear

Read-Host "Press Enter to exit"
