import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";
import { readFileSync } from "fs";

export interface ItemAttributes {
	id: number;
	name: string;
	description: string;
	category : number;
	storage : number;
}

type ItemCreationAttributes = Optional<ItemAttributes, 'id'>;

class Item extends Model<ItemAttributes, ItemCreationAttributes> {

	public static async SeedDefaultItens(defaultItensPath : string)
    {
        await this.sync({ force: true });

        const json = readFileSync(defaultItensPath, 'utf-8');
        const itensData = JSON.parse(json);

        for(const item of itensData)
        {
            await this.create({
                name: item.name,
                description: item.description,
				category: item.category,
				storage: item.storage
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
			category: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			storage: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}, {
			sequelize,
			modelName: 'Item',
			tableName: 'items',
			timestamps: false
		});
	}
}

export default Item;