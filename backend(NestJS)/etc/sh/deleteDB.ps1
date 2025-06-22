Write-Host "Resetting SQLite database..." -ForegroundColor Yellow

$basePath = Resolve-Path "$PSScriptRoot\..\.."

$dbFiles = @("database.sqlite", "database.sqlite3", "*.db", "database.db")
foreach ($pattern in $dbFiles) {
    $files = Get-ChildItem -Path $basePath -Filter $pattern -ErrorAction SilentlyContinue
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