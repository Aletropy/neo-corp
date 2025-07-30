# NeoCorp RPG - VTT Platform for Ordem Paranormal

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A comprehensive Virtual Tabletop (VTT) platform developed to facilitate online tabletop RPG sessions, with a focus on real-time interactivity and detailed character management for the "Ordem Paranormal" system. The application is built with a modern and robust stack, including Node.js, Express, TypeScript, and Socket.io on the backend, with EJS and Tailwind CSS on the frontend.

*Note: "Ordem Paranormal" is a popular Brazilian tabletop RPG system.*

## ✨ Core Features

*   **🎲 Advanced Dice Parser:** A custom-built dice expression parser and interpreter that supports complex operations like `>[2d20] + 5`, allowing for filtered rolls (e.g., taking the highest result) and mathematical calculations.
*   **👥 Real-time Sessions:** Utilizes WebSockets via **Socket.io** to instantly synchronize actions, such as dice rolls and player lists, among all campaign participants.
*   **👤 Complete Character Management:** Create, view, and edit detailed character sheets, including attributes, skills, powers, rituals, weapons, and inventory.
*   **🌍 Campaigns and Game Masters:** A system for creating and managing campaigns with distinct roles for Game Master (Admin) and Player. The GM can view and manage all characters and dice rolls within the campaign.
*   **🛡️ Robust Database:** Full data modeling using **Sequelize ORM** and **PostgreSQL**, with automatic seeding of base game data (powers, rituals, weapons, etc.) from JSON files.
*   **🔐 Authentication & Security:** Login system with password hashing (bcrypt) and session management via `express-session`, featuring middlewares for route protection and role-based permission handling.
*   **🎨 Dynamic Frontend:** A server-side rendered interface using **EJS** and styled with **Tailwind CSS**, providing a clean and responsive user experience.
*   **💡 Suggestion System:** A feature allowing users to submit suggestions (for items, rules, etc.) that can be reviewed by the administrator.

## 🛠️ Tech Stack

| Area         | Core Technologies                                            |
|--------------|--------------------------------------------------------------|
| **Backend**  | Node.js, Express.js, TypeScript, Socket.IO                   |
| **Database** | PostgreSQL, Sequelize (ORM)                                  |
| **Frontend** | EJS (Server-Side Rendering), Tailwind CSS, JavaScript (DOM)  |
| **Auth**     | `express-session`, `bcrypt.js`, Custom Middlewares           |
| **DevOps**   | `dotenv` for environment variables, `https` for SSL           |

## 🚀 How to Run The Project Locally

Follow the steps below to set up and run the application in your development environment.

### Prerequisites
*   [Node.js](https://nodejs.org/) (version 18.x or higher)
*   [PostgreSQL](https://www.postgresql.org/download/) (a database server running locally or in a Docker container)

### 1. Clone the Repository

```bash
git clone https://github.com/Aletropy/neo-corp.git
cd neo-corp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database
1.  Access your PostgreSQL server.
2.  Create a new database. Ex: `CREATE DATABASE neocorp_rpg;`.
3.  **Note:** The code uses `sequelize.sync({ alter: true })`, which will automatically create and/or alter tables on the first run.

### 4. Configure Environment Variables
Create a file named `.env` in the project root and fill it with your credentials, using the template below.

```ini
# .env

# PostgreSQL Database
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_DATABASE=neocorp_rpg # The name of the database you created

# Application Settings
EXPRESS_IP=127.0.0.1
HTTPS_PORT=8000
HTTP_PORT=8001
SECRET=a_very_strong_secret_string_for_sessions # Change to a secure value

# SSL Certificates (required for HTTPS)
# For development, you can generate self-signed certificates.
# Ex: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes
SSL_KEY=path/to/your/key.pem
SSL_CERT=path/to/your/cert.pem
```

### 5. Compile TypeScript

```bash
npm run build
```

### 6. Start the Server

```bash
npm start
```
The server will start on `https://localhost:8000` (HTTPS), with a redirect server on `http://localhost:8001`.

The system will automatically create an **Admin** user (username: `Admin`, password: `Admin`) and a **Default** user (username: `Default`, password: `Default`) on the first launch.

## 📂 Project Structure

The project is organized to maintain a clear separation of concerns:

```
/src
├── Core/             # Core settings (Config.ts)
├── Data/             # Data logic
│   ├── Models/       # Sequelize models (User.ts, Character.ts, etc.)
│   └── Database.ts   # Sequelize connection and initialization
├── Dice/             # Custom dice parser implementation
├── Enum/             # Reusable enums for game rules
├── Middlewares/      # Express middlewares (auth.ts)
├── Session/          # Real-time logic with Socket.io (SessionHandler.ts)
├── routes/           # Express route definitions
└── main.ts           # Application entry point
/public/              # Static files and EJS views
└── ...
```