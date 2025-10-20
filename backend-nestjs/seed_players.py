import requests
import sqlite3
import json
import os

# --- Configuração ---
# Ajuste se sua API rodar em outra porta ou host
BASE_URL = "http://localhost:3000"
# Caminho para o seu banco de dados SQLite
DATABASE_PATH = "./database.sqlite"

# Definição dos usuários e seus Coffeemons iniciais
# As senhas devem atender aos requisitos de senha forte da sua API
USERS_TO_CREATE = [
    {"username": "admin", "email": "admin@coffeemon.com", "password": "Jubarte@1234"},
    {"username": "Dark", "email": "Dark@email.com", "password": "Jubarte@1234"},
    {"username": "Silver", "email": "Silver@email.com", "password": "Jubarte@1234"},
]

# Mapeamento de quais Coffeemons cada jogador receberá (pelos IDs do coffeemon.data.json)
COFFEEMON_ASSIGNMENTS = {
    "Dark@email.com": [1, 2, 3],    # Jasminelle, Limonetto, Maprion
    "Silver@email.com": [4, 5, 6],  # Cocoly, Espressaur, Cinnara
}

# --- Funções do Script ---

def check_server_connection():
    """Verifica se o servidor NestJS está respondendo."""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        response.raise_for_status()
        print("✅ Conexão com o servidor estabelecida.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro: Não foi possível conectar ao servidor em {BASE_URL}.")
        print(f"   Detalhes: {e}")
        return False

def create_users_via_api():
    """Cria usuários na API apenas se eles não existirem no banco."""
    print("\n--- 1. Criando Usuários via API ---")
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    for user_data in USERS_TO_CREATE:
        cursor.execute("SELECT COUNT(1) FROM user WHERE email=?", (user_data["email"],))
        exists = cursor.fetchone()[0]

        if exists == 0:
            try:
                print(f"   Criando usuário: {user_data['username']} ({user_data['email']})")
                response = requests.post(f"{BASE_URL}/users", json=user_data, timeout=10)
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(f"   ⚠️  Falha ao criar usuário {user_data['username']}: {e.response.text if e.response else e}")
        else:
            print(f"   Usuário {user_data['username']} já existe. Pulando.")
    
    conn.close()

def update_admin_role():
    """Garante que o usuário admin tenha a role 'admin' no banco."""
    print("\n--- 2. Atualizando Role do Admin ---")
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE user SET role='admin' WHERE email='admin@coffeemon.com' AND role != 'admin'")
        if cursor.rowcount > 0:
            print("   Role do usuário 'admin' atualizada com sucesso.")
        else:
            print("   Role do usuário 'admin' já está correta.")
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"   ❌ Erro ao atualizar role do admin: {e}")

def create_players_if_not_exist():
    """Cria um perfil de Player para cada User que ainda não o tenha."""
    print("\n--- 3. Criando Players no Banco ---")
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        # Encontra usuários que não têm um player associado
        cursor.execute("SELECT u.id FROM user u LEFT JOIN player p ON u.id = p.userId WHERE p.id IS NULL")
        users_without_player = cursor.fetchall()

        if not users_without_player:
            print("   Todos os usuários já possuem perfis de player.")
            conn.close()
            return

        for row in users_without_player:
            user_id = row[0]
            print(f"   Criando player para o userId: {user_id}")
            cursor.execute(
                "INSERT INTO player (coins, level, experience, userId) VALUES (?, ?, ?, ?)",
                (100, 1, 0, user_id)
            )
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"   ❌ Erro ao criar players: {e}")

def distribute_coffeemons_and_moves():
    """Distribui Coffeemons e seus moves iniciais para os players definidos."""
    print("\n--- 4. Distribuindo Coffeemons e Moves Iniciais ---")
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row # Permite acessar colunas por nome
        cursor = conn.cursor()

        for email, coffeemon_ids in COFFEEMON_ASSIGNMENTS.items():
            # Pega o ID do player a partir do email do usuário
            cursor.execute("SELECT p.id FROM player p JOIN user u ON p.userId = u.id WHERE u.email=?", (email,))
            player_row = cursor.fetchone()
            if not player_row:
                print(f"   ⚠️  Player para o email {email} não encontrado. Pulando.")
                continue
            
            player_id = player_row['id']
            print(f"\n   Processando Coffeemons para Player ID: {player_id} ({email})")

            for coffeemon_id in coffeemon_ids:
                # Verifica se este player já possui esta espécie de Coffeemon
                cursor.execute("SELECT COUNT(1) FROM player_coffeemons WHERE playerId=? AND coffeemonId=?", (player_id, coffeemon_id))
                if cursor.fetchone()[0] > 0:
                    print(f"     - Coffeemon ID {coffeemon_id} já pertence ao player. Pulando.")
                    continue

                # Pega os stats base do Coffeemon
                cursor.execute("SELECT baseHp, baseAttack, baseDefense FROM coffeemon WHERE id=?", (coffeemon_id,))
                base_stats = cursor.fetchone()
                if not base_stats:
                    print(f"     ⚠️  Espécie Coffeemon com ID {coffeemon_id} não encontrada no banco. Pulando.")
                    continue

                # 1. Insere o Coffeemon na coleção do player
                print(f"     - Adicionando Coffeemon ID {coffeemon_id} ao player...")
                cursor.execute(
                    "INSERT INTO player_coffeemons (hp, attack, defense, level, experience, isInParty, playerId, coffeemonId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (base_stats['baseHp'], base_stats['baseAttack'], base_stats['baseDefense'], 1, 0, 1, player_id, coffeemon_id)
                )
                player_coffeemon_id = cursor.lastrowid # Pega o ID da instância que acabamos de criar

                # 2. Busca os moves iniciais para esta espécie de Coffeemon
                cursor.execute(
                    "SELECT moveId FROM coffeemon_learnset_move WHERE coffeemonId=? AND learnMethod='start'",
                    (coffeemon_id,)
                )
                starting_moves = cursor.fetchall()
                
                if not starting_moves:
                    print(f"     - Nenhum move inicial encontrado para o Coffeemon ID {coffeemon_id}.")
                    continue

                # 3. Insere os moves iniciais na coleção do PlayerCoffeemon
                for i, move_row in enumerate(starting_moves):
                    move_id = move_row['moveId']
                    slot = i + 1
                    if slot > 4: break # Garante que não passe de 4 slots
                    
                    print(f"       - Equipando move inicial ID {move_id} no slot {slot}.")
                    cursor.execute(
                        "INSERT INTO player_coffeemon_move (playerCoffeemonId, moveId, slot) VALUES (?, ?, ?)",
                        (player_coffeemon_id, move_id, slot)
                    )
        
        conn.commit()
        conn.close()
        print("\n   Distribuição concluída.")

    except sqlite3.Error as e:
        print(f"   ❌ Erro ao distribuir Coffeemons: {e}")
        if conn:
            conn.rollback()
            conn.close()


def main():
    """Função principal para orquestrar o processo de seed."""
    if not os.path.exists(DATABASE_PATH):
        print(f"❌ Erro: Arquivo do banco de dados '{DATABASE_PATH}' não encontrado.")
        print("   Por favor, inicie o servidor NestJS uma vez para que ele seja criado.")
        return

    if not check_server_connection():
        return
        
    create_users_via_api()
    update_admin_role()
    create_players_if_not_exist()
    distribute_coffeemons_and_moves()

    print("\n🎉 Processo de Seed finalizado com sucesso!")


if __name__ == "__main__":
    main()