import { DataTypes, Model, Optional } from "sequelize";
import { ItemAttributes } from "./Items";
import sequelize from "../Database";

export enum WeaponType
{
    Melee = "corpo_a_corpo",
    Thrown = "arremessavel",
    Ranged = "ranged",
    Fire = "fire",
}

export enum WeaponGrip
{
    Light = "leve",
    OneHanded = "uma_mao",
    TwoHanded = "duas_maos"
}

export enum WeaponProficiency
{
    Simple = "simples",
    Tatical = "tatica",
    Heavy = "pesada"
}

export interface WeaponAttributes extends ItemAttributes
{
    weaponType: WeaponType;
    grip : WeaponGrip;
    proficiency : WeaponProficiency;
}

type WeaponCreationAttributes = Optional<WeaponAttributes, 'id'>;

class Weapon extends Model<WeaponAttributes, WeaponCreationAttributes>
{
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
        }, {
            sequelize,
            modelName: 'Weapon',
            tableName: 'weapons',
            timestamps: false
        })
    }
}

export default Weapon;