import { Sequelize } from "sequelize";
import User from "../Data/Models/User";
import Character from "../Data/Models/Character";
import Campaign from "../Data/Models/Campaign";
import CharacterSkills from "../Data/Models/CharacterSkills";
import Item from "../Data/Models/Items";
import Arma from "../Data/Models/Weapon";
import Ritual from "../Data/Models/Ritual";
import { Poder } from "../Data/Models/Poder";
import path from "path";
import Config from "../Core/Config";
import { Suggestion } from "./Models/Suggestion";

const sequelize = new Sequelize(
    Config.DB_DATABASE,
    Config.DB_USER,
    Config.DB_PASSWORD, 
    {
        host: "localhost",
        dialect: 'postgres',
        port: 5432,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
});

export async function initializeDatabase()
{
    try {
        User.initialize();
        Campaign.initialize();

        Character.initialize();
        CharacterSkills.initialize();
        Poder.initialize();

        Item.initialize();
        Arma.initialize();
        Ritual.initialize();

        Suggestion.initialize();

        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const templatesPath = path.join(__dirname, "../../template/");

        await User.SeedAdmin();
        await Poder.SeedDefaultPoderes(templatesPath + "Poderes.json");
        await Ritual.SeedDefaultRituais(templatesPath + "Rituais.json");
        await Arma.SeedDefaultArmas(templatesPath + "Armas.json");
        await Item.SeedDefaultItens(templatesPath + "Itens.json");

        console.log("Database connected and initialized.");
    } catch(error) {
        console.error("An error ocurred when connecting to database: " + error);
    }
}

export default sequelize;