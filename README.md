# ☕ LOMBRA LANCHES (Admin CRUD)

Este é um aplicativo de gerenciamento de cardápio (CRUD - Create, Read, Update, Delete) para o "Lombra Lanches". Ele simula a interface de administrador de um app tipo iFood, permitindo a gestão completa dos produtos.

Este é um projeto **standalone** (100% frontend). Ele não precisa de um backend separado. Todos os dados são salvos localmente no dispositivo usando **`AsyncStorage`** (no celular) e **`LocalStorage`** (no navegador), o que garante que os dados persistem mesmo após fechar o app.

---

## 🛠️ Tecnologias Utilizadas

* **React Native** (com **Expo**)
* **Expo Router** (para navegação entre a lista e o modal)
* **TypeScript**
* **AsyncStorage** (para persistência de dados local)
* **Expo Web** (para rodar o app no navegador)

---

## 📋 Pré-requisitos

Para rodar este projeto, você precisará **apenas** de:

* **Node.js** (v18 ou superior)
* **NPM** (geralmente instalado com o Node.js)
* **(Para teste mobile)** O app **"Expo Go"** instalado no seu celular (iOS ou Android).

---

## 🚀 Como Executar (Modo Web)

Este é o método mais simples. O app rodará 100% no navegador, sem precisar de celular.

1.  Abra um terminal e navegue até a pasta do projeto:
    ```bash
    cd /caminho/para/LOMBRA_LANCHES_MOBILE/app-gerenciador
    ```

2.  Instale todas as dependências do projeto (só precisa fazer isso uma vez):
    ```bash
    npm install
    ```

3.  Inicie o servidor da aplicação no modo Web:
    ```bash
    npm run web
    ```
    *(Este comando é um atalho para `npx expo start --web`)*

✅ **Pronto!** O terminal irá compilar o projeto e abrir automaticamente uma aba no seu navegador padrão (geralmente `http://localhost:8081`).

O app estará 100% funcional no navegador, salvando os dados no `LocalStorage`.

---

## 📱 Como Executar (Modo Mobile - Para Teste no Celular)

Este método permite que você rode o app nativamente no seu próprio celular usando o aplicativo **Expo Go**.

1.  Certifique-se de que seu **computador** e seu **celular** estejam conectados na **mesma rede Wi-Fi**.

2.  Abra um terminal e navegue até a pasta do projeto:
    ```bash
    cd /caminho/para/LOMBRA_LANCHES_MOBILE/app-gerenciador
    ```

3.  Instale as dependências (se ainda não o fez):
    ```bash
    npm install
    ```

4.  Inicie o servidor de desenvolvimento do Expo (este comando **mostrará um QR Code**):
    ```bash
    npm start
    ```
    *(Este comando é um atalho para `npx expo start`)*

5.  Abra o aplicativo **Câmera** padrão do seu celular (iOS ou Android).

6.  **Aponte a câmera para o QR Code** que apareceu no seu terminal.

7. O seu celular mostrará uma notificação ou um pop-up perguntando se você quer "Abrir com o Expo Go". **Toque nessa notificação.**

✅ **Pronto!** O Expo Go irá carregar o aplicativo, e ele rodará diretamente no seu celular, salvando os dados no `AsyncStorage` do dispositivo.