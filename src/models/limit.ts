import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize";

export interface LimitInstance extends Model {
  id: number;
  userId: number;
  username: any;
  bankName: string;
  limit_balance: number;
  account_balance: number;
}

export const Limit = sequelize.define("Limit", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  limit_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  account_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
});
