import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";
import { Element } from "../../Enum/Element";
import { RitualCircle, RitualDuration, RitualRange } from "../../Enum/RitualEnums";
import { readFileSync } from "fs";

export interface RitualAttributes {
    id: number;
    name: string;
    description: string;
    circle: RitualCircle;
    element : Element;
    range : RitualRange;
    duration : RitualDuration;
}

type RitualCreationAttributes = Optional<RitualAttributes, 'id'>;

class Ritual extends Model<RitualAttributes, RitualCreationAttributes> {

    public static async SeedDefaultPoderes(defaultRitualsPath : string)
    {
        await this.sync({ force: true });

        const json = readFileSync(defaultRitualsPath, 'utf-8');
        const rituaisData = JSON.parse(json);

        for(const ritual of rituaisData)
        {
            await this.create({
                name: ritual.name,
                description: ritual.description,
                circle: ritual.circle,
                element: ritual.element,
                range: ritual.range,
                duration: ritual.duration
            });
        }
    }

    static initialize() {
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
            circle: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            element: {
                type: DataTypes.ENUM(...(Object.values(Element))),
                allowNull: false
            },
            range: {
                type: DataTypes.ENUM(...(Object.values(RitualRange))),
                allowNull: false
            },
            duration: {
                type: DataTypes.ENUM(...(Object.values(RitualDuration))),
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Ritual',
            tableName: 'rituals',
            timestamps: false
        });
    }
}

export default Ritual;