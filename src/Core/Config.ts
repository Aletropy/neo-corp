import dotenv from "dotenv"

dotenv.config();

const Config = {
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_DATABASE: process.env.DB_DATABASE!,
    EXPRESS_IP: process.env.EXPRESS_IP || "127.0.0.1",
    EXPRESS_PORT: process.env.EXPRESS_PORT ? parseInt(process.env.EXPRESS_PORT) : 8000,
    SECRET: process.env.SECRET || "ChangeMePls"
};

export default Config;