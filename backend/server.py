from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

print("--- BACKEND PORTÁTIL LOMBRA LANCHES (ZERO) ---")
print("Rodando na porta 5001. Banco de dados vazio.")

# --- BANCO DE DADOS NA MEMÓRIA (VAZIO) ---
db_produtos = [] 

# Contador para gerar IDs novos (começa do 1)
proximo_id = 1

# --- ROTA 1: LISTAR (GET) ---
@app.route("/restaurants/<int:restaurant_id>/products", methods=["GET"])
def get_products(restaurant_id):
    return jsonify(db_produtos), 200

# --- ROTA 2: CRIAR (POST) ---
@app.route("/restaurants/<int:restaurant_id>/products", methods=["POST"])
def create_product(restaurant_id):
    global proximo_id
    data = request.json
    
    novo_produto = {
        "id": proximo_id,
        "name": data.get('name'),
        "description": data.get('description'),
        "price": data.get('price'),
        "restaurant_id": restaurant_id
    }
    
    db_produtos.append(novo_produto)
    proximo_id += 1
    
    print(f"✅ Produto Criado: {novo_produto['name']} (ID: {novo_produto['id']})")
    return jsonify({"id": novo_produto['id'], "message": "Criado com sucesso!"}), 201

# --- ROTA 3: ATUALIZAR (PUT) ---
@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    
    for produto in db_produtos:
        if produto['id'] == product_id:
            produto['name'] = data.get('name')
            produto['description'] = data.get('description')
            produto['price'] = data.get('price')
            
            print(f"🔄 Produto Atualizado: {produto['name']}")
            return jsonify({"message": "Atualizado!"}), 200
            
    return jsonify({"error": "Produto não encontrado"}), 404

# --- ROTA 4: DELETAR (DELETE) ---
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    global db_produtos
    
    lista_antes = len(db_produtos)
    # Reconstrói a lista mantendo apenas o que NÃO for o ID deletado
    db_produtos = [p for p in db_produtos if p['id'] != product_id]
    
    if len(db_produtos) < lista_antes:
        print(f"🗑️ Produto {product_id} Deletado")
        return jsonify({"message": "Deletado!"}), 200
    else:
        return jsonify({"error": "Produto não encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')