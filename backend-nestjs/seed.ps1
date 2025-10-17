$BaseUrl = "http://localhost:3000"
$DatabasePath = ".\database.sqlite"

function Test-ServerConnection {
    try { Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 5 | Out-Null; return $true }
    catch { return $false }
}

function Execute-SQL {
    param([string]$Query)
    try { sqlite3 $DatabasePath $Query | Out-Null; return $true }
    catch { Write-Error $_.Exception.Message; return $false }
}

function Invoke-ApiRequest {
    param([string]$Method, [string]$Endpoint, [object]$Body=$null)
    $params = @{ Uri = "$BaseUrl$Endpoint"; Method = $Method; Headers = @{ "Content-Type" = "application/json" }; TimeoutSec = 30 }
    if ($Body) { $params["Body"] = ($Body | ConvertTo-Json -Depth 10) }
    try { return Invoke-RestMethod @params } catch { return $null }
}

function Create-Users-Via-API {
    $users = @(
        @{ username="admin"; email="admin@coffeemon.com"; password="Jubarte@1234" },
        @{ username="Dark"; email="Dark@email.com"; password="Jubarte@1234" },
        @{ username="Silver"; email="Silver@email.com"; password="Jubarte@1234" }
    )

    foreach ($user in $users) {
        $exists = sqlite3 $DatabasePath "SELECT COUNT(1) FROM user WHERE email='$($user.email)';"
        if ($exists.Trim() -eq '0') {
            Invoke-ApiRequest -Method "POST" -Endpoint "/users" -Body $user | Out-Null
        }
    }
}

function Update-Admin-Role {
    $adminRole = sqlite3 $DatabasePath "SELECT role FROM user WHERE email='admin@coffeemon.com';"
    if ($adminRole.Trim() -ne 'admin') {
        Execute-SQL "UPDATE user SET role='admin' WHERE email='admin@coffeemon.com';"
    }
}

function Create-Players {
    $users = sqlite3 $DatabasePath "SELECT u.id FROM user u LEFT JOIN player p ON u.id=p.userId WHERE p.id IS NULL;"
    if ($users) {
        foreach ($userIdRaw in $users -split "`n") {
            $userId = $userIdRaw.Trim()
            if ($userId) {
                Execute-SQL "INSERT INTO player (coins, level, experience, userId) VALUES (100,1,0,$userId);"
            }
        }
    }
}

function Distribute-Coffeemons {
    $assignments = @{
        "Dark@email.com" = 1..3
        "Silver@email.com" = 4..6
    }

    foreach ($email in $assignments.Keys) {
        $playerIdRaw = sqlite3 $DatabasePath "SELECT p.id FROM player p INNER JOIN user u ON p.userId=u.id WHERE u.email='$email';"
        $playerId = $playerIdRaw.Trim()
        if (-not $playerId) { continue }

        foreach ($i in $assignments[$email]) {
            $exists = sqlite3 $DatabasePath "SELECT COUNT(1) FROM player_coffeemons WHERE playerId=$playerId AND coffeemonId=$i;"
            if ($exists.Trim() -eq '0') {
                $statsRaw = sqlite3 $DatabasePath "SELECT baseHp, baseAttack, baseDefense FROM coffeemon WHERE id=$i;"
                $stats = $statsRaw.Trim() -split "\|"
                Execute-SQL "INSERT INTO player_coffeemons (hp, attack, defense, level, experience, isInParty, playerId, coffeemonId) VALUES ($($stats[0]),$($stats[1]),$($stats[2]),1,0,1,$playerId,$i);"
            }
        }
    }
}

function Show-Summary {
    Write-Host "Users processed, Admin role set, Players created, Coffeemons distributed"
}

try {
    if (-not (Test-ServerConnection)) { Write-Error "Server not running"; exit 1 }
    if (-not (Test-Path $DatabasePath)) { Write-Error "Database not found"; exit 1 }

    Create-Users-Via-API
    Update-Admin-Role
    Create-Players
    Distribute-Coffeemons
    Show-Summary
}
catch { Write-Error $_.Exception.Message; exit 1 }
