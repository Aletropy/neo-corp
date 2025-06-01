import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs"
import sequelize from "../Database";

interface UserAttributes
{
    id : number;
    username : string;
    password : string;
    isAdmin : boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes>
{
    public static async SeedAdmin()
    {
        const ADMIN = "Admin";
        const DEFAULT = "Default";

        const adminExists = await this.findOne({
            where: { username: ADMIN }
        });
        if(adminExists == null) {
            await this.create({
                username: ADMIN,
                password: ADMIN,
                isAdmin: true
            });
        }

        const defaultExists = await this.findOne({
            where: { username: DEFAULT }
        });
        if(defaultExists == null) {
            await this.create({
                username: DEFAULT,
                password: DEFAULT,
                isAdmin: false
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
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
          this.setDataValue('password', bcrypt.hashSync(value));
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    });
  }
}

export default User;