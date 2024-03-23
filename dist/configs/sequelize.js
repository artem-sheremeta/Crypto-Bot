"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("dotenv/config");
exports.sequelize = new sequelize_1.Sequelize({
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
