import dotenv from "dotenv"

dotenv.config();

const Config = {
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_DATABASE: process.env.DB_DATABASE!
};

export default Config;