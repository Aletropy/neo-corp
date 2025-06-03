import { DataTypes, Model, Optional } from "sequelize";
import User from "./User";
import sequelize from "../Database";

export interface SuggestionAttribute
{
    id?: number;
    text: string;
    type : string;
    authorId: number;
}

type SuggestionCreationAttributes = Optional<SuggestionAttribute, 'id'>;

export class Suggestion extends Model<SuggestionAttribute, SuggestionCreationAttributes>
{
    public static initialize()
    {
        this.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: sequelize,
            tableName: 'suggestions',
            modelName: 'Suggestion'
        })

        Suggestion.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
    }
}