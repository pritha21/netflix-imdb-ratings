# Netflix IMDb Ratings Extension - Setup Helper Script
# This script helps validate your setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Netflix IMDb Ratings - Setup Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if config.js exists
if (Test-Path "config.js") {
    Write-Host "[OK] config.js found" -ForegroundColor Green
    
    # Check if API key is configured
    $configContent = Get-Content "config.js" -Raw
    if ($configContent -match "OMDB_API_KEY:\s*'YOUR_API_KEY_HERE'") {
        Write-Host "[WARNING] API key not configured yet!" -ForegroundColor Yellow
        Write-Host "  -> Please edit config.js and add your OMDb API key" -ForegroundColor Yellow
    } else {
        Write-Host "[OK] API key appears to be configured" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] config.js not found!" -ForegroundColor Red
}

Write-Host ""

# Check for required files
$requiredFiles = @(
    "manifest.json",
    "content.js",
    "api-service.js",
    "styles.css",
    "popup.html",
    "popup.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Missing: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check icons directory
if (Test-Path "icons") {
    Write-Host "[OK] icons directory exists" -ForegroundColor Green
    
    $iconFiles = @("icon16.png", "icon48.png", "icon128.png")
    $missingIcons = @()
    
    foreach ($icon in $iconFiles) {
        if (-not (Test-Path "icons\$icon")) {
            $missingIcons += $icon
        }
    }
    
    if ($missingIcons.Count -gt 0) {
        Write-Host "[WARNING] Missing icons: $($missingIcons -join ', ')" -ForegroundColor Yellow
        Write-Host "  -> Open create-icons.html to generate them" -ForegroundColor Yellow
    } else {
        Write-Host "[OK] All icon files present" -ForegroundColor Green
    }
} else {
    Write-Host "[WARNING] icons directory not found" -ForegroundColor Yellow
    Write-Host "  -> Creating icons directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Name "icons" | Out-Null
    Write-Host "[OK] icons directory created" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "config.js") -or $allFilesExist -eq $false) {
    Write-Host "1. Fix missing files (see errors above)" -ForegroundColor Red
} else {
    Write-Host "1. Edit config.js and add your OMDb API key" -ForegroundColor Yellow
    Write-Host "2. Open create-icons.html to generate icons" -ForegroundColor Yellow
    Write-Host "3. Open test-api.html to verify your API key" -ForegroundColor Yellow
    Write-Host "4. Load extension in Chrome:" -ForegroundColor Yellow
    Write-Host "   - Go to chrome://extensions/" -ForegroundColor Gray
    Write-Host "   - Enable Developer mode" -ForegroundColor Gray
    Write-Host "   - Click 'Load unpacked'" -ForegroundColor Gray
    Write-Host "   - Select this folder" -ForegroundColor Gray
    Write-Host "5. Visit Netflix and enjoy!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "  - QUICK_START.md (5 minute setup)" -ForegroundColor White
Write-Host "  - INSTALL.md (detailed guide)" -ForegroundColor White
Write-Host "  - README.md (full documentation)" -ForegroundColor White
Write-Host ""

# Offer to open helpful files
Write-Host "Would you like to:" -ForegroundColor Cyan
Write-Host "1. Open config.js in Notepad" -ForegroundColor White
Write-Host "2. Open test-api.html in browser" -ForegroundColor White
Write-Host "3. Open create-icons.html in browser" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        if (Test-Path "config.js") {
            notepad.exe "config.js"
        }
    }
    "2" {
        if (Test-Path "test-api.html") {
            Start-Process "test-api.html"
        }
    }
    "3" {
        if (Test-Path "create-icons.html") {
            Start-Process "create-icons.html"
        }
    }
    "4" {
        Write-Host "Goodbye!" -ForegroundColor Green
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    }
}
