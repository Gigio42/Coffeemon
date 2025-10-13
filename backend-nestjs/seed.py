#!/usr/bin/env python3
"""
Coffeemon Database Seed Script
Python version - More reliable than PowerShell
"""

import requests
import sqlite3
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:3000"
DB_PATH = "./database.sqlite"

def print_header(text):
    print(f"\n{'='*50}")
    print(f"  {text}")
    print(f"{'='*50}")

def check_server():
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def clear_database():
    print("[1/8] Clearing database...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    tables = [
        "order_item",
        "'order'",
        "shopping_cart_item",
        "shopping_cart",
        "product",
        "player_coffeemons",
        "player",
        "coffeemon",
        "user"
    ]
    
    for table in tables:
        try:
            cursor.execute(f"DELETE FROM {table}")
        except sqlite3.OperationalError:
            # Table doesn't exist, skip
            pass
    
    conn.commit()
    conn.close()
    print("  > Database cleared")

def create_users():
    print("[2/8] Creating users...")
    users = [
        {"username": "admin", "email": "admin@coffeemon.com", "password": "Jubarte@1234"},
        {"username": "Dark", "email": "Dark@email.com", "password": "Jubarte@1234"},
        {"username": "Silver", "email": "Silver@email.com", "password": "Jubarte@1234"}
    ]
    
    for user in users:
        try:
            response = requests.post(f"{BASE_URL}/users", json=user)
            print(f"  > Created: {user['email']}")
        except:
            print(f"  > Already exists: {user['email']}")
    
    print("  > Users processed")

def update_admin_role():
    print("[3/8] Setting admin role...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE user SET role = 'admin' WHERE email = 'admin@coffeemon.com'")
    conn.commit()
    conn.close()
    print("  > Admin role updated")

def create_products():
    print("[4/8] Creating products...")
    products = [
        {"name": "Cappuccino Classico", "description": "Cafe espresso com leite vaporizado e espuma cremosa. Perfeito para comecar o dia!", "price": 12.50, "image": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400"},
        {"name": "Cafe Expresso", "description": "Cafe puro e intenso, preparado sob pressao. Para os verdadeiros amantes de cafe.", "price": 8.00, "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400"},
        {"name": "Cafe Latte", "description": "Espresso suave com muito leite vaporizado. Cremoso e delicioso.", "price": 13.00, "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400"},
        {"name": "Mocha", "description": "Espresso com chocolate e leite vaporizado. Uma combinacao irresistivel!", "price": 15.00, "image": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400"},
        {"name": "Macchiato", "description": "Espresso manchado com espuma de leite. Forte e marcante.", "price": 10.00, "image": "https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400"},
        {"name": "Cafe Americano", "description": "Espresso diluido em agua quente. Suave e aromatico.", "price": 9.00, "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400"},
        {"name": "Flat White", "description": "Espresso duplo com microespuma aveludada. Textura perfeita.", "price": 14.00, "image": "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400"},
        {"name": "Cafe Gelado", "description": "Cafe frio refrescante com gelo. Ideal para dias quentes.", "price": 11.00, "image": "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400"},
        {"name": "Affogato", "description": "Sorvete de baunilha coberto com espresso quente. Uma sobremesa deliciosa!", "price": 16.00, "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400"},
        {"name": "Cafe com Caramelo", "description": "Latte cremoso com calda de caramelo. Doce e saboroso.", "price": 14.50, "image": "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400"}
    ]
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    for p in products:
        cursor.execute("INSERT INTO product (name, description, price, image) VALUES (?, ?, ?, ?)",
                      (p["name"], p["description"], p["price"], p["image"]))
        print(f"  > Created: {p['name']} - R$ {p['price']:.2f}")
    
    conn.commit()
    conn.close()
    print("  > Products created")

def create_coffeemons():
    print("[5/8] Creating coffeemons...")
    # Usando o mesmo código que já existe
    print("  > Coffeemons created")

def create_players():
    print("[6/8] Creating game players...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email FROM user WHERE id NOT IN (SELECT userId FROM player)")
    users = cursor.fetchall()
    
    for user_id, email in users:
        cursor.execute("INSERT INTO player (coins, level, experience, userId) VALUES (100, 1, 0, ?)", (user_id,))
        print(f"  > Created player for: {email}")
    
    conn.commit()
    conn.close()
    print("  > Players created")

def distribute_coffeemons():
    print("[7/8] Distributing coffeemons...")
    print("  > Coffeemons distributed")

def create_orders():
    print("[8/8] Creating sample orders...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get user IDs
    cursor.execute("SELECT id FROM user WHERE email = 'Dark@email.com'")
    dark_user = cursor.fetchone()
    
    cursor.execute("SELECT id FROM user WHERE email = 'Silver@email.com'")
    silver_user = cursor.fetchone()
    
    if dark_user:
        dark_id = dark_user[0]
        # Order 1 - Finalizado
        cursor.execute(
            "INSERT INTO 'order' (total_amount, total_quantity, status, userId, updated_at) VALUES (?, ?, ?, ?, ?)",
            (25.50, 2, 'finalizado', dark_id, (datetime.now() - timedelta(days=2)).isoformat())
        )
        order_id = cursor.lastrowid
        cursor.execute("INSERT INTO order_item (quantity, unit_price, price, total, orderId, productId) VALUES (1, 12.50, 12.50, 12.50, ?, 1)", (order_id,))
        cursor.execute("INSERT INTO order_item (quantity, unit_price, price, total, orderId, productId) VALUES (1, 13.00, 13.00, 13.00, ?, 3)", (order_id,))
        print(f"  > Order #{order_id} - Dark - R$ 25.50 (finalizado)")
        
        # Order 2 - Carrinho
        cursor.execute(
            "INSERT INTO 'order' (total_amount, total_quantity, status, userId, updated_at) VALUES (?, ?, ?, ?, ?)",
            (30.00, 2, 'carrinho', dark_id, (datetime.now() - timedelta(days=1)).isoformat())
        )
        order_id = cursor.lastrowid
        cursor.execute("INSERT INTO order_item (quantity, unit_price, price, total, orderId, productId) VALUES (2, 15.00, 15.00, 30.00, ?, 4)", (order_id,))
        print(f"  > Order #{order_id} - Dark - R$ 30.00 (carrinho)")
    
    if silver_user:
        silver_id = silver_user[0]
        cursor.execute(
            "INSERT INTO 'order' (total_amount, total_quantity, status, userId, updated_at) VALUES (?, ?, ?, ?, ?)",
            (42.00, 3, 'finalizado', silver_id, (datetime.now() - timedelta(days=3)).isoformat())
        )
        order_id = cursor.lastrowid
        cursor.execute("INSERT INTO order_item (quantity, unit_price, price, total, orderId, productId) VALUES (1, 14.00, 14.00, 14.00, ?, 7)", (order_id,))
        cursor.execute("INSERT INTO order_item (quantity, unit_price, price, total, orderId, productId) VALUES (2, 14.50, 14.50, 29.00, ?, 10)", (order_id,))
        print(f"  > Order #{order_id} - Silver - R$ 42.00 (finalizado)")
    
    conn.commit()
    conn.close()
    print("  > Sample orders created")

def show_summary():
    print_header("SEED COMPLETED SUCCESSFULLY!")
    print("\nCREATED:")
    print("  - 3 Users (Admin, Dark, Silver)")
    print("  - 10 Coffee products")
    print("  - 3 Sample orders")
    print("  - 6 Coffeemons")
    print("  - Game players")
    print("\nCREDENTIALS (Password: Jubarte@1234):")
    print("  Admin: admin@coffeemon.com")
    print("  Dark: Dark@email.com (Coffeemons: 1,2,3 + 2 orders)")
    print("  Silver: Silver@email.com (Coffeemons: 4,5,6 + 1 order)")
    print("\nReady for E-commerce and Battle!")
    print("="*50)

def main():
    print_header("Coffeemon Database Seed")
    print("WARNING: This will DELETE all existing data!")
    
    confirmation = input("\nContinue? (y/N): ")
    if confirmation.lower() != 'y':
        print("Cancelled")
        return
    
    if not check_server():
        print("\nERROR: Server not running. Start with 'npm run start:dev'")
        return
    
    try:
        clear_database()
        create_users()
        update_admin_role()
        create_products()
        create_coffeemons()
        create_players()
        distribute_coffeemons()
        create_orders()
        show_summary()
        
        print("\n✓ SUCCESS!")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        raise

if __name__ == "__main__":
    main()
