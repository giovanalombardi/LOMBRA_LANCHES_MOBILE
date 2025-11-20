# 🍔 LOMBRA LANCHES MOBILE (Fullstack)

Este projeto é o aplicativo de gestão de cardápio (Admin) do ecossistema "Lombra Lanches". Ele consiste em um **App Mobile** (React Native) conectado a uma **API Backend** (Python Flask).

O sistema permite o gerenciamento completo dos produtos (CRUD: Criar, Ler, Atualizar, Deletar) em tempo real.

---

## 🌐 Acesso Web (Vercel)

🔗 **Link do App:** **https://lombra-lanches-mobile.vercel.app/**

---

## 🛠️ Arquitetura do Projeto

O projeto utiliza uma arquitetura híbrida para permitir desenvolvimento ágil e acesso remoto:

1.  **Frontend:** React Native com Expo (Expo Router).
2.  **Backend:** API Python Flask (Portátil, rodando na porta 5001).
3.  **Conexão:** Túnel **Ngrok** (Expondo a API local para a internet segura via HTTPS).
4.  **Banco de Dados:** Em memória (Runtime) para facilitar a portabilidade e testes.

**Estrutura de Pastas:**
* `/app-gerenciador`: Código fonte do Mobile.
* `/app-gerenciador/backend`: Código fonte da API Python (`server.py`).

---

## 🚀 Como Rodar o Projeto Localmente

Se desejar executar o projeto em sua máquina, siga os passos abaixo. É necessário rodar o Backend e o Frontend simultaneamente.

### Pré-requisitos
* Node.js e NPM
* Python 3.x
* App Expo Go (no celular)

### PASSO 1: Iniciar o Backend (API)

1.  Abra o terminal na pasta do backend:
    ```bash
    cd app-gerenciador/backend
    ```
2.  Instale as dependências (se necessário):
    ```bash
    pip install flask flask-cors
    ```
3.  Inicie o servidor:
    ```bash
    python server.py
    ```
    ✅ *O servidor iniciará na porta **5001**.*

### PASSO 2: Configurar a Conexão (Túnel)

Para que o celular (ou a Vercel) acesse o Python local, recomendamos usar o Ngrok.

1.  Em um novo terminal, inicie o túnel na porta da API:
    ```bash
    ngrok http 5001
    ```
2.  Copie o link gerado (ex: `https://xxxx.ngrok-free.app`).
3.  Vá nos arquivos `app/index.tsx` e `app/modal-produto.tsx` e atualize a constante `BASE_URL` com este link.

### PASSO 3: Iniciar o Mobile (Frontend)

1.  Abra um novo terminal na pasta do app:
    ```bash
    cd app-gerenciador
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o projeto Expo:
    ```bash
    npx expo start
    ```
4.  Escaneie o QR Code com seu celular (Android/iOS).

---

## 📱 Funcionalidades Implementadas

* **Listagem:** Consumo de API REST para listar produtos.
* **Cadastro:** Envio de formulário via POST.
* **Edição:** Carregamento de dados prévios e atualização via PUT.
* **Exclusão:** Remoção de itens via DELETE com confirmação nativa.
* **UX:** Feedback visual de carregamento (Loaders), "Pull to Refresh" e validação de campos.
