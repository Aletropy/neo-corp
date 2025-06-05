import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";

export interface CampaignAttributes
{
    id : number;
    name : string;
    description : string;
    gameMaster : number;
    players: number[];
    characters : string[];
    progress: number;
}

type CampaignCreationAttributes = Optional<CampaignAttributes, 'id'>;

class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes>
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
      modelName: 'Campaign',
      tableName: 'campaings',
      timestamps: true
    });
  }
}

export default Campaign;