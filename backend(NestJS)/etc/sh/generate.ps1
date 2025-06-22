# 1. Criar dois usuários
$user1 = @{
    username = "user1"
    email = "user1@email.com"
    password = "123456"
}
$user2 = @{
    username = "user2"
    email = "user2@email.com"
    password = "123456"
}

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -Body ($user1 | ConvertTo-Json) -ContentType "application/json"
Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -Body ($user2 | ConvertTo-Json) -ContentType "application/json"

# 2. Logar com user1 e pegar o token
$login1 = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body (@{ email = $user1.email; password = $user1.password } | ConvertTo-Json) -ContentType "application/json"
$token1 = $login1.access_token

# 3. Logar com user2 e pegar o token
$login2 = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body (@{ email = $user2.email; password = $user2.password } | ConvertTo-Json) -ContentType "application/json"
$token2 = $login2.access_token

# 4. Criar coffeemons (precisa ser admin, ajuste o token se necessário)
$coffeemons = @{
    coffeemons = @(
        @{
            name = "Espressaur"
            type = "ESPRESSO"
            baseHp = 100
            baseAttack = 50
            baseDefense = 40
            imageUrl = "https://example.com/espressaur.png"
            moves = @(
                @{ id = 1; name = "Café Shot"; power = 50; type = "ESPRESSO"; description = "Um poderoso jato de café" }
            )
        },
        @{
            name = "Latteon"
            type = "LATTE"
            baseHp = 90
            baseAttack = 40
            baseDefense = 50
            imageUrl = "https://example.com/latteon.png"
            moves = @(
                @{ id = 2; name = "Latte Wave"; power = 45; type = "LATTE"; description = "Uma onda cremosa" }
            )
        }
    )
}

Invoke-RestMethod -Uri "http://localhost:3000/game/coffeemons/batch" -Method Post -Headers @{ Authorization = "Bearer $token1" } -Body ($coffeemons | ConvertTo-Json -Depth 5) -ContentType "application/json"

# 5. Criar player para user1
Invoke-RestMethod -Uri "http://localhost:3000/game/players" -Method Post -Headers @{ Authorization = "Bearer $token1" } -Body (@{} | ConvertTo-Json) -ContentType "application/json"

# 6. Criar player para user2
Invoke-RestMethod -Uri "http://localhost:3000/game/players" -Method Post -Headers @{ Authorization = "Bearer $token2" } -Body (@{} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Setup concluído!"