import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize";

export interface DepositInstance extends Model {
  id: number;
  userId: number;
  username: any;
  bankName: string;
  deposit: number;
  createdAt: number;
}

export const Deposit = sequelize.define("Deposit", {
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
  deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
