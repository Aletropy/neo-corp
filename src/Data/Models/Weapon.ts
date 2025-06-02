import { DataTypes, Model, Optional } from "sequelize";
import { ItemAttributes } from "./Items";
import sequelize from "../Database";
import { readFileSync } from "fs";

export enum ArmaType
{
    Melee = "corpo_a_corpo",
    Thrown = "arremessavel",
    Ranged = "ranged",
    Fire = "fire",
}

export enum ArmaGrip
{
    Light = "leve",
    OneHanded = "uma_mao",
    TwoHanded = "duas_maos"
}

export enum ArmaProficiency
{
    Simple = "simples",
    Tatical = "tatica",
    Heavy = "pesada"
}

export enum ArmaCriticalChance
{
    _19 = 19,
    _18 = 18
}

export enum ArmaCritialMultiplier
{
    X2 = 2,
    X3 = 3,
    X4 = 4
}

export interface ArmaAttributes extends ItemAttributes
{
    weaponType: ArmaType;
    grip : ArmaGrip;
    proficiency : ArmaProficiency;
    damageDice : string;
    criticalChance? : ArmaCriticalChance;
    criticalMultiplier? : ArmaCritialMultiplier;
}

type ArmaCreationAttributes = Optional<ArmaAttributes, 'id' | 'criticalChance' | 'criticalMultiplier'>;

class Arma extends Model<ArmaAttributes, ArmaCreationAttributes>
{
    public static async SeedDefaultArmas(defaultArmasPath : string)
    {
        await this.sync({ force: true });

        const json = readFileSync(defaultArmasPath, 'utf-8');
        const armasData = JSON.parse(json);

        for(const arma of armasData)
        {
            await this.create({
                name: arma.name,
                description: arma.description,
                category: arma.category,
                damageDice: arma.damageDice,
                grip: arma.grip,
                proficiency: arma.proficiency,
                storage: arma.storage,
                weaponType: arma.weaponType,
                criticalChance: arma.criticalChance,
                criticalMultiplier: arma.criticalMultiplier
            });
        }
    }

    static initialize()
    {
        this.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			category: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			storage: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
            grip: {
                type: DataTypes.STRING,
                allowNull: false
            },
            proficiency: {
                type: DataTypes.STRING,
                allowNull: false
            },
            weaponType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            damageDice: {
                type: DataTypes.STRING,
                allowNull: false
            },
            criticalChance: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            criticalMultiplier: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            sequelize,
            modelName: 'Weapon',
            tableName: 'weapons',
            timestamps: false
        })
    }
}

export default Arma;