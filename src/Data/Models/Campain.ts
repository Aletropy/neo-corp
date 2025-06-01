import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";

export interface CampainAttributes
{
    id : number;
    name : string;
    description : string;
    gameMaster : number;
    players: number[];
    characters : string[];
    progress: number;
}

type CampainCreationAttributes = Optional<CampainAttributes, 'id'>;

class Campain extends Model<CampainAttributes, CampainCreationAttributes>
{
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
        allowNull: false
      },
      gameMaster: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      characters: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      players: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Campain',
      tableName: 'campaings',
      timestamps: true
    });
  }
}

export default Campain;