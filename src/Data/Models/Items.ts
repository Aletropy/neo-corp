import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../Database";

export interface ItemAttributes {
	id: number;
	name: string;
	description: string;
	category : number;
	storage : number;
}

type ItemCreationAttributes = Optional<ItemAttributes, 'id'>;

class Item extends Model<ItemAttributes, ItemCreationAttributes> {
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