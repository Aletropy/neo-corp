import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";
import { Classe } from "../../Enum/Classe";
import { readFileSync } from "fs";
import { Trilhas as Trilha } from "../../Enum/Trilhas";
import { Element } from "../../Enum/Element";

export interface PoderAttributes
{
    id : number;
    name : string;
    description : string;
    isHabilidade? : boolean;
    fromClasse? : Classe;
    fromTrilha? : Trilha;
    elemento? : Element;
}

type PoderCreationAttributes = Optional<PoderAttributes, 'id' | 'isHabilidade' | 'fromClasse' | 'fromTrilha' | 'elemento'>;

export class Poder extends Model<PoderAttributes, PoderCreationAttributes>
{
    public static async SeedDefaultPoderes(defaultPoderesPath : string)
    {
        await this.sync({ force: true });

        const json = readFileSync(defaultPoderesPath, 'utf-8');
        const poderesData = JSON.parse(json);

        for(const poder of poderesData)
        {
            await this.create({
                name: poder.name,
                description: poder.description,
                fromClasse: poder.fromClass != undefined ? poder.fromClass.toLowerCase() : null,
                fromTrilha: poder.fromTrilha != undefined ? poder.fromTrilha : null,
                isHabilidade: poder.isHabilidade != undefined ? poder.isHabilidade : false,
                elemento: poder.element
            });
        }
    }

    public static initialize()
    {
        this.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            elemento: {
                type: DataTypes.ENUM(...(Object.values(Element))),
                allowNull: true
            },
            fromClasse: {
                type: DataTypes.ENUM(...(Object.values(Classe))),
                allowNull: true
            },
            fromTrilha: {
                type: DataTypes.ENUM(...(Object.values(Trilha))),
                allowNull: true
            },
            isHabilidade: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true
            }
        }, {
            sequelize: sequelize,
            modelName: "Poder",
            tableName: "poderes",
            timestamps: false
        });
    }
}