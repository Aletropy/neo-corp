// src/Models/CharacterSkills.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";
import Character from "./Character";

export interface CharacterSkillsAttributes {
  characterId?: number;
  acrobacia?: number;
  adestramento?: number;
  artes?: number;
  atletismo?: number;
  atualidades?: number;
  ciencias?: number;
  crime?: number;
  diplomacia?: number;
  enganacao?: number;
  fortitude?: number;
  furtividade?: number;
  iniciativa?: number;
  intimidacao?: number;
  intuicao?: number;
  investigacao?: number;
  luta?: number;
  medicina?: number;
  ocultismo?: number;
  percepcao?: number;
  pilotagem?: number;
  pontaria?: number;
  profissao?: number;
  reflexos?: number;
  religiao?: number;
  sobrevivencia?: number;
  tatica?: number;
  tecnologia?: number;
  vontade?: number;
}

export type SkillName = keyof Omit<CharacterSkillsAttributes, 'characterId'>;

type CharacterSkillsCreationAttributes = Optional<CharacterSkillsAttributes, 'characterId' | 'tatica' | 'vontade' | 'tecnologia' | 'sobrevivencia' | 'religiao' | 'reflexos' | 'profissao' | 'pontaria' | 'pilotagem' | 'percepcao' | 'ocultismo' | 'medicina' | 'luta' | 'investigacao' | 'intuicao' | 'intimidacao' | 'iniciativa' | 'furtividade' | 'fortitude' | 'enganacao' | 'diplomacia' | 'crime' | 'ciencias' | 'atualidades' | 'atletismo' | 'artes' | 'adestramento' | 'acrobacia'>;

class CharacterSkills extends Model<CharacterSkillsAttributes, CharacterSkillsCreationAttributes> {
  
  public static readonly skillToAttributeMap: Record<SkillName, string> = {
    acrobacia: 'agi',
    adestramento: 'pre',
    artes: 'pre',
    atletismo: 'for',
    atualidades: 'int',
    ciencias: 'int',
    crime: 'agi',
    diplomacia: 'pre',
    enganacao: 'pre',
    fortitude: 'vig',
    furtividade: 'agi',
    iniciativa: 'agi',
    intimidacao: 'pre',
    intuicao: 'int',
    investigacao: 'int',
    luta: 'for',
    medicina: 'int',
    ocultismo: 'int',
    percepcao: 'pre',
    pilotagem: 'agi',
    pontaria: 'agi',
    profissao: 'int',
    reflexos: 'agi',
    religiao: 'pre',
    sobrevivencia: 'int',
    tatica: 'int',
    tecnologia: 'int',
    vontade: 'pre'
  };

  static initialize() {
    this.init({
      characterId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Character,
          key: 'id'
        }
      },
      acrobacia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      adestramento: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      artes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      atletismo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      atualidades: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ciencias: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      crime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      diplomacia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      enganacao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      fortitude: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      furtividade: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      iniciativa: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      intimidacao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      intuicao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      investigacao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      luta: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      medicina: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ocultismo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      percepcao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      pilotagem: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      pontaria: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      profissao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      reflexos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      religiao: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      sobrevivencia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      tatica: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      tecnologia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      vontade: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'CharacterSkills',
      tableName: 'character_skills',
      timestamps: true
    });

    Character.hasOne(CharacterSkills, {
        foreignKey: 'characterId',
        as: 'skills'
    });

    CharacterSkills.belongsTo(Character, {
        foreignKey: 'characterId',
        as: 'character'
    });
  }
}



export default CharacterSkills;