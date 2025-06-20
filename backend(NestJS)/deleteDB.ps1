Write-Host "Resetting SQLite database..." -ForegroundColor Yellow

if (Test-Path "database.sqlite") {
    try {
        Remove-Item "database.sqlite" -Force
        Write-Host "Database 'database.sqlite' removed successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "Error removing database: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "File 'database.sqlite' not found." -ForegroundColor Cyan
}

$dbFiles = @("database.sqlite3", "*.db", "database.db")
foreach ($pattern in $dbFiles) {
    $files = Get-ChildItem $pattern -ErrorAction SilentlyContinue
    if ($files) {
        foreach ($file in $files) {
            Remove-Item $file.FullName -Force
            Write-Host "Removed: $($file.Name)" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "To recreate database, run: npm run start:dev" -ForegroundColor Cyan
Write-Host "Database reset complete!" -ForegroundColor Green