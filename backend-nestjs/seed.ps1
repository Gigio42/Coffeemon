$BaseUrl = "http://localhost:3000"
$DatabasePath = ".\database.sqlite"

Write-Host "🌱 Starting Coffeemon Database Seed" -ForegroundColor Green

function Test-ServerConnection {
    try {
        Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 5 | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Execute-SQL {
    param([string]$Query)
    
    try {
        sqlite3 $DatabasePath $Query | Out-Null
        return $true
    }
    catch {
        Write-Error "SQL Error: $($_.Exception.Message)"
        return $false
    }
}

function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null
    )
    
    $headers = @{ "Content-Type" = "application/json" }
    $params = @{
        Uri = "$BaseUrl$Endpoint"
        Method = $Method
        Headers = $headers
        TimeoutSec = 30
    }
    
    if ($Body) {
        $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
    }
    
    try {
        return Invoke-RestMethod @params
    }
    catch {
        return $null
    }
}

function Create-Users-Via-API {
    Write-Host "👥 Creating users via API..." -ForegroundColor Yellow
    
    $users = @(
        @{ username = "admin"; email = "admin@coffeemon.com"; password = "Jubarte@1234" },
        @{ username = "Dark"; email = "Dark@email.com"; password = "Jubarte@1234" },
        @{ username = "Silver"; email = "Silver@email.com"; password = "Jubarte@1234" }
    )
    
    foreach ($user in $users) {
        $result = Invoke-ApiRequest -Method "POST" -Endpoint "/users" -Body $user
        $status = if ($result) { "✓ Created" } else { "⚠ Exists" }
        Write-Host "  $status : $($user.email)" -ForegroundColor Gray
    }
    
    Write-Host "✅ Users processed" -ForegroundColor Green
}

function Update-Admin-Role {
    Write-Host "👑 Setting admin role..." -ForegroundColor Yellow
    Execute-SQL "UPDATE user SET role = 'admin' WHERE email = 'admin@coffeemon.com';"
    Write-Host "✅ Admin role updated" -ForegroundColor Green
}

function Create-Coffeemons {
    Write-Host "☕ Creating coffeemons..." -ForegroundColor Yellow
    
    $coffeemons = @(
        @{ name = "Jasminelle"; type = "floral"; hp = 90; attack = 40; defense = 50; 
           moves = '[{"id":1,"name":"Petal Breeze","power":30,"type":"attack","description":"A gentle breeze of jasmine petals that damages enemies.","effects":[{"type":"defenseUp","chance":0.5,"duration":2,"target":"self","value":1.3}]},{"id":2,"name":"Fragrant Shield","power":0,"type":"attack","description":"Emits a jasmine scent that boosts defense.","effects":[{"type":"defenseUp","chance":1,"duration":3,"target":"self","value":1.5}]}]' },
        
        @{ name = "Limonetto"; type = "fruity"; hp = 80; attack = 55; defense = 35;
           moves = '[{"id":3,"name":"Zesty Burst","power":50,"type":"attack","description":"A sharp burst of citrus flavor that stuns the opponent.","effects":[{"type":"sleep","chance":0.2,"duration":1,"target":"enemy"}]},{"id":4,"name":"Ristretto Flame","power":40,"type":"attack","description":"A quick, fiery espresso shot that burns the enemy.","effects":[{"type":"burn","chance":0.3,"duration":3,"target":"enemy","value":5}]}]' },
        
        @{ name = "Maprion"; type = "fruity"; hp = 100; attack = 45; defense = 40;
           moves = '[{"id":5,"name":"Maple Splash","power":35,"type":"attack","description":"A sweet splash of maple syrup that soothes allies.","effects":[]},{"id":6,"name":"Sticky Trap","power":20,"type":"attack","description":"Traps enemies with sticky maple syrup, lowering their speed.","effects":[{"type":"attackUp","chance":0.5,"duration":2,"target":"self","value":1.3}]}]' },
        
        @{ name = "Cocoly"; type = "nutty"; hp = 85; attack = 50; defense = 45;
           moves = '[{"id":7,"name":"Cocoa Whip","power":40,"type":"attack","description":"Whips up a creamy cocoa blast that deals damage.","effects":[{"type":"burn","chance":0.2,"duration":3,"target":"enemy","value":4}]},{"id":8,"name":"Warm Hug","power":0,"type":"attack","description":"Heals allies with a warm cocoa embrace.","effects":[]}]' },
        
        @{ name = "Espressaur"; type = "roasted"; hp = 95; attack = 60; defense = 40;
           moves = '[{"id":9,"name":"Espresso Shot","power":55,"type":"attack","description":"A powerful concentrated coffee shot that deals medium damage.","effects":[{"type":"burn","chance":0.3,"duration":3,"target":"enemy","value":6}]},{"id":10,"name":"Bean Blast","power":45,"type":"attack","description":"A blast of coffee beans that damages the enemy.","effects":[]}]' },
        
        @{ name = "Cinnara"; type = "spicy"; hp = 80; attack = 55; defense = 40;
           moves = '[{"id":11,"name":"Cinnamon Whirl","power":50,"type":"attack","description":"A spicy swirl of cinnamon that burns and confuses enemies.","effects":[{"type":"burn","chance":0.3,"duration":3,"target":"enemy","value":5}]},{"id":12,"name":"Clove Guard","power":0,"type":"attack","description":"Raises defense by enveloping itself in clove aroma.","effects":[{"type":"defenseUp","chance":1,"duration":3,"target":"self","value":1.4}]}]' }
    )
    
    foreach ($c in $coffeemons) {
        $sql = "INSERT OR IGNORE INTO coffeemon (name, type, baseHp, baseAttack, baseDefense, imageUrl, moves) VALUES ('$($c.name)', '$($c.type)', $($c.hp), $($c.attack), $($c.defense), 'https://coffeemon.com/images/$($c.name.ToLower()).png', '$($c.moves)');"
        Execute-SQL $sql
    }
    
    Write-Host "✅ Coffeemons created" -ForegroundColor Green
}

function Create-Players {
    Write-Host "👤 Creating game players..." -ForegroundColor Yellow
    
    $users = sqlite3 $DatabasePath "SELECT u.id, u.email FROM user u LEFT JOIN player p ON u.id = p.userId WHERE p.id IS NULL;"
    
    if ($users) {
        $userLines = $users -split "`n"
        foreach ($userLine in $userLines) {
            if ($userLine.Trim()) {
                $parts = $userLine -split "\|"
                $userId = $parts[0]
                $email = $parts[1]
                
                Execute-SQL "INSERT INTO player (coins, level, experience, userId) VALUES (100, 1, 0, $userId);"
                Write-Host "  ✓ Created player for: $email" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "✅ Players created" -ForegroundColor Green
}

function Distribute-Coffeemons {
    Write-Host "🔗 Distributing coffeemons..." -ForegroundColor Yellow
    
    $darkPlayerId = sqlite3 $DatabasePath "SELECT p.id FROM player p INNER JOIN user u ON p.userId = u.id WHERE u.email = 'Dark@email.com';"
    $silverPlayerId = sqlite3 $DatabasePath "SELECT p.id FROM player p INNER JOIN user u ON p.userId = u.id WHERE u.email = 'Silver@email.com';"
    
    if ($darkPlayerId) {
        for ($i = 1; $i -le 3; $i++) {
            $coffeemonStats = sqlite3 $DatabasePath "SELECT baseHp, baseAttack, baseDefense, name FROM coffeemon WHERE id = $i;"
            if ($coffeemonStats) {
                $stats = $coffeemonStats -split "\|"
                $hp = $stats[0]; $attack = $stats[1]; $defense = $stats[2]; $name = $stats[3]
                
                Execute-SQL "INSERT OR IGNORE INTO player_coffeemons (hp, attack, defense, level, experience, isInParty, playerId, coffeemonId) VALUES ($hp, $attack, $defense, 1, 0, 1, $darkPlayerId, $i);"
                Write-Host "  ✓ Dark got: $name (ID: $i)" -ForegroundColor Gray
            }
        }
    }
    
    if ($silverPlayerId) {
        for ($i = 4; $i -le 6; $i++) {
            $coffeemonStats = sqlite3 $DatabasePath "SELECT baseHp, baseAttack, baseDefense, name FROM coffeemon WHERE id = $i;"
            if ($coffeemonStats) {
                $stats = $coffeemonStats -split "\|"
                $hp = $stats[0]; $attack = $stats[1]; $defense = $stats[2]; $name = $stats[3]
                
                Execute-SQL "INSERT OR IGNORE INTO player_coffeemons (hp, attack, defense, level, experience, isInParty, playerId, coffeemonId) VALUES ($hp, $attack, $defense, 1, 0, 1, $silverPlayerId, $i);"
                Write-Host "  ✓ Silver got: $name (ID: $i)" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "✅ Coffeemons distributed (3 each, all active)" -ForegroundColor Green
}

function Show-Summary {
    Write-Host ""
    Write-Host "📊 Seed Summary:" -ForegroundColor Cyan
    Write-Host "✅ Users processed (bcrypt hashing)" -ForegroundColor White
    Write-Host "✅ Admin role configured" -ForegroundColor White
    Write-Host "✅ 6 Coffeemons with moves created" -ForegroundColor White
    Write-Host "✅ Game players created" -ForegroundColor White
    Write-Host "✅ Coffeemons distributed and battle-ready" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Credentials (Password: Jubarte@1234):" -ForegroundColor Yellow
    Write-Host "  Admin: admin@coffeemon.com" -ForegroundColor White
    Write-Host "  Dark: Dark@email.com (Coffeemons: 1,2,3)" -ForegroundColor White  
    Write-Host "  Silver: Silver@email.com (Coffeemons: 4,5,6)" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Ready for battle testing!" -ForegroundColor Blue
}

try {
    if (-not (Test-ServerConnection)) {
        Write-Error "❌ Server not running. Start with 'npm run start:dev'"
        exit 1
    }
    
    if (-not (Test-Path $DatabasePath)) {
        Write-Error "❌ Database not found: $DatabasePath"
        exit 1
    }
    
    Create-Users-Via-API
    Update-Admin-Role
    Create-Coffeemons
    Create-Players
    Distribute-Coffeemons
    Show-Summary
    
    Write-Host "🎉 Seed completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "❌ Seed failed: $($_.Exception.Message)"
    exit 1
}