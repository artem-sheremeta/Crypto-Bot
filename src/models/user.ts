import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize";

export interface UserInstance extends Model {
  id: number;
  name: string;
  username: string;
}

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});
