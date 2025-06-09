import dotenv from "dotenv"

dotenv.config();

const Config = {
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_DATABASE: process.env.DB_DATABASE!,
    EXPRESS_IP: process.env.EXPRESS_IP || "127.0.0.1",
    HTTPS_PORT: process.env.HTTPS_PORT ? parseInt(process.env.HTTPS_PORT) : 8000,
    HTTP_PORT: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8001,
    SECRET: process.env.SECRET || "ChangeMePls",
    SSL_KEY: process.env.SSL_KEY!,
    SSL_CERT: process.env.SSL_CERT!
};

export default Config;