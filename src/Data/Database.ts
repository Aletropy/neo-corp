import { Sequelize } from "sequelize";
import User from "./Models/User";
import Character from "./Models/Character";
import Campain from "./Models/Campain";
import CharacterSkills from "./Models/CharacterSkills";
import Item from "./Models/Items";
import Weapon from "./Models/Weapon";
import Ritual from "./Models/Ritual";
import { Poder } from "./Models/Poder";

const sequelize = new Sequelize(
    'neocorp',
    'admin',
    'Admin8525', 
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
        Campain.initialize();

        Character.initialize();
        CharacterSkills.initialize();
        Poder.initialize();

        Item.initialize();
        Weapon.initialize();
        Ritual.initialize();

        await sequelize.authenticate();
        await sequelize.sync({ force: false });

        await User.SeedAdmin();
        await Poder.SeedDefaultPoderes("/home/aletropy/Projects/RpgOverview/template/Poderes.json");
        await Ritual.SeedDefaultPoderes("/home/aletropy/Projects/RpgOverview/template/Rituais.json");
        console.log("Database connected and initialized.");
    } catch(error) {
        console.error("An error ocurred when connecting to database: " + error);
    }
}

export default sequelize;