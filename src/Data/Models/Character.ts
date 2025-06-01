import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";
import { Classe } from "../../Enum/Classe";

export interface CharacterAttributes
{
    id : number;
    owner : number;
    currentCampain? : number;
    classe : Classe;
    nex : number;
    poderes: number[];
    itens: {id: number, count : number}[];
    armas: number[];
    rituais: number[];
    info: {
      name : string;
      age : string;
      appearenceDescription : string;
      description : string;
    },
    attributes: {
      for : number;
      vig : number;
      agi : number;
      pre : number;
      int : number;
    }
}

type CharacterCreationAttributes = Optional<CharacterAttributes, 'id' | 'armas' | 'itens' | 'poderes' | 'rituais'>;

class Character extends Model<CharacterAttributes, CharacterCreationAttributes>
{
    static initialize() {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      currentCampain: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nex: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rituais: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: []
      },
      armas: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: []
      },
      poderes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: []
      },
      itens: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        defaultValue: []
      },
      classe: {
        type: DataTypes.ENUM(...Object.values(Classe)),
        allowNull: false,
      },
      info: {
        type: DataTypes.JSON,
        allowNull: false
      },
      attributes: {
        type: DataTypes.JSON,
        defaultValue: {
          for: 1,
          vig: 1,
          agi: 1,
          pre: 1,
          int: 1
        },
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Character',
      tableName: 'characters',
      timestamps: true
    });
  }
}

export default Character;