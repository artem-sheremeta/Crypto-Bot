"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showTransactionSums = void 0;
const sequelize_1 = require("sequelize");
const deposit_1 = require("../models/deposit");
function getFirstDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function getFirstDayOfWeek() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}
function showTransactionSums(msg, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const username = msg.chat.username;
        const startOfMonth = getFirstDayOfMonth();
        const startOfWeek = getFirstDayOfWeek();
        const monthlySum = yield deposit_1.Deposit.sum("deposit", {
            where: {
                username: username,
                createdAt: {
                    [sequelize_1.Op.gte]: startOfMonth,
                },
            },
        });
        let weeklySum = yield deposit_1.Deposit.sum("deposit", {
            where: {
                username: username,
                createdAt: {
                    [sequelize_1.Op.gte]: startOfWeek,
                },
            },
        });
        weeklySum = weeklySum === null ? 0 : weeklySum;
        const monthlyCount = yield deposit_1.Deposit.count({
            where: {
                username: username,
                createdAt: {
                    [sequelize_1.Op.gte]: startOfMonth,
                },
            },
        });
        const weeklyCount = yield deposit_1.Deposit.count({
            where: {
                username: username,
                createdAt: {
                    [sequelize_1.Op.gte]: startOfWeek,
                },
            },
        });
        const message = `Сума транзакцій:\nЗа місяць: ${monthlySum || 0} грн (${monthlyCount} транзакцій)\nЗа тиждень: ${weeklySum || 0} грн (${weeklyCount} транзакцій)\n`;
        bot.sendMessage(chatId, message);
    });
}
exports.showTransactionSums = showTransactionSums;
