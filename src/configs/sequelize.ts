import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize({
  dialect: "mssql",
  host: "crypto-bot.database.windows.net",
  database: "Crypto-Bot",
  username: "artem",
  password: process.env.PASSWORD_DB,
  port: 1433,
  logging: false,
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});
