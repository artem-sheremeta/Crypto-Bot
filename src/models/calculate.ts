import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize";

export interface CalculateInstance extends Model {
  id: number;
  userId: number;
  username: any;
  sum_buy: number;
  course_buy: number;
  course_sell: number;
  get_currency: number;
  commission: number;
  expense_limit: number;
  profit: number;
}

export const Calculate = sequelize.define("Calculate", {
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
  sum_buy: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  course_buy: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  course_sell: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  get_currency: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  commission: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  expense_limit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  profit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
