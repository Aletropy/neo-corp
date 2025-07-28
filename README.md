# NeoCorp RPG - Plataforma VTT para Ordem Paranormal

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Uma plataforma completa de Virtual Tabletop (VTT) desenvolvida para facilitar sessões de RPG de mesa online, com foco em interatividade em tempo real e gerenciamento detalhado de personagens para o sistema "Ordem Paranormal". A aplicação é construída com uma stack moderna e robusta, incluindo Node.js, Express, TypeScript e Socket.io no backend, e EJS com Tailwind CSS no frontend.


## ✨ Funcionalidades Principais

*   **🎲 Interpretador Avançado de Dados:** Um parser e interpretador de expressões de dados construído do zero, com suporte a operações complexas como `>[2d20] + 5`, permitindo rolagens filtradas (pegando o maior resultado) e cálculos matemáticos.
*   **👥 Sessões em Tempo Real:** Utilização de WebSockets via **Socket.io** para sincronizar ações como rolagens de dados e listas de jogadores entre todos os participantes de uma campanha instantaneamente.
*   **👤 Gestão Completa de Personagens:** Criação, visualização e edição detalhada de fichas de personagem, incluindo atributos, perícias, poderes, rituais, armas e inventário.
*   **🌍 Campanhas e Mestres de Jogo:** Sistema de criação e gerenciamento de campanhas, com distinção de papéis entre Mestre (Admin) e Jogador. O mestre pode visualizar e gerenciar todos os personagens e dados da campanha.
*   **🛡️ Base de Dados Robusta:** Modelagem de dados completa com **Sequelize ORM** e **PostgreSQL**, com seeding automático de dados base (poderes, rituais, armas, etc.) a partir de arquivos JSON.
*   **🔐 Autenticação e Segurança:** Sistema de login com hash de senhas (bcrypt) e gerenciamento de sessão via `express-session`, com middlewares para proteção de rotas e diferenciação de permissões de administrador.
*   **🎨 Frontend Dinâmico:** Interface renderizada no servidor com **EJS** e estilizada com **Tailwind CSS**, oferecendo uma experiência de usuário limpa e responsiva.
*   **💡 Sistema de Sugestões:** Funcionalidade que permite aos usuários enviar sugestões (de itens, regras, etc.), que podem ser visualizadas pelo administrador.

## 🛠️ Stack de Tecnologias

| Área         | Tecnologias Principais                                       |
|--------------|--------------------------------------------------------------|
| **Backend**  | Node.js, Express.js, TypeScript, Socket.IO                   |
| **Database** | PostgreSQL, Sequelize (ORM)                                  |
| **Frontend** | EJS (Server-Side Rendering), Tailwind CSS, JavaScript (DOM)  |
| **Auth**     | `express-session`, `bcrypt.js`, Middlewares customizados     |
| **DevOps**   | `dotenv` para variáveis de ambiente, `https` para SSL         |

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
*   [PostgreSQL](https://www.postgresql.org/download/) (um servidor de banco de dados rodando localmente ou em um container Docker)

### 1. Clonar o Repositório

```bash
git clone https://github.com/Aletropy/neo-corp.git
cd neo-corp
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar o Banco de Dados
1.  Acesse seu servidor PostgreSQL.
2.  Crie um novo banco de dados. Ex: `CREATE DATABASE neocorp_rpg;`.
3.  **Nota:** O código usa `sequelize.sync({ alter: true })`, que irá criar e/ou alterar as tabelas automaticamente na primeira execução.

### 4. Configurar Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto e preencha com as suas credenciais, seguindo o modelo abaixo.

```ini
# .env

# Banco de Dados PostgreSQL
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_DATABASE=neocorp_rpg # O nome do banco que você criou

# Configurações da Aplicação
EXPRESS_IP=127.0.0.1
HTTPS_PORT=8000
HTTP_PORT=8001
SECRET=uma_string_secreta_muito_forte_para_sessoes # Troque por um valor seguro

# Certificados SSL (necessário para HTTPS)
# Para desenvolvimento, você pode gerar certificados autoassinados.
# Ex: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes
SSL_KEY=caminho/para/sua/key.pem
SSL_CERT=caminho/para/sua/cert.pem
```

### 5. Compilar o TypeScript

```bash
npm run build
```

### 6. Iniciar o Servidor

```bash
npm start
```
O servidor será iniciado em `https://localhost:8000` (HTTPS) e um servidor de redirecionamento em `http://localhost:8001`.

O sistema criará automaticamente um usuário **Admin** (usuário: `Admin`, senha: `Admin`) e um usuário **Default** (usuário: `Default`, senha: `Default`) na primeira inicialização.

## 📂 Estrutura do Projeto

A estrutura do projeto foi organizada para manter uma separação clara de responsabilidades:

```
/src
├── Core/             # Configurações centrais (Config.ts)
├── Data/             # Lógica de dados
│   ├── Models/       # Modelos do Sequelize (User.ts, Character.ts, etc.)
│   └── Database.ts   # Conexão e inicialização do Sequelize
├── Dice/             # Implementação do interpretador de dados customizado
├── Enum/             # Enums reutilizáveis para regras do jogo
├── Middlewares/      # Middlewares do Express (auth.ts)
├── Session/          # Lógica de tempo real com Socket.io (SessionHandler.ts)
├── routes/           # Definições de rotas do Express
└── main.ts           # Ponto de entrada da aplicação
/public/              # Arquivos estáticos e views EJS
└── ...
```