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
exports.getListTransactions = exports.setDeposit = exports.addDepositToDB = void 0;
const deposit_1 = require("../models/deposit");
const user_1 = require("../models/user");
const limit_1 = require("../models/limit");
const transfer_1 = require("../models/transfer");
const listButtons_1 = require("../mainHandlers/listButtons");
const listButtons_2 = require("../mainHandlers/listButtons");
function addDepositToDB(msg, userContext, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const username = msg.chat.username;
        const text = msg.text;
        const bankName = userContext[chatId].bankName;
        const messageId = userContext[chatId].messageId;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.bankOperations,
        };
        try {
            if (text && (listButtons_2.ignoreListButton === null || listButtons_2.ignoreListButton === void 0 ? void 0 : listButtons_2.ignoreListButton.includes(text))) {
                userContext[chatId].isDeposit = false;
                return;
            }
            else if (text === undefined) {
                bot.sendMessage(chatId, "Вибачте, я приймаю тільки текстові повідомлення.");
                return;
            }
            else {
                const number = parseFloat(text);
                if (isNaN(number)) {
                    bot.sendMessage(chatId, "Будь ласка, введіть число.");
                }
                else {
                    const user = (yield user_1.User.findOne({
                        where: { username },
                    }));
                    if (user) {
                        const limit = (yield limit_1.Limit.findOne({
                            where: {
                                userId: user.id,
                                username: username,
                                bankName: bankName,
                            },
                        }));
                        if (limit) {
                            const newLimitBalance = limit.limit_balance - Number(text);
                            const newAccountBalance = Number(limit.account_balance) + (text ? parseInt(text) : 0);
                            yield limit_1.Limit.update({
                                limit_balance: newLimitBalance,
                                account_balance: newAccountBalance,
                            }, {
                                where: {
                                    userId: user.id,
                                    username: username,
                                    bankName: bankName,
                                },
                            });
                            yield deposit_1.Deposit.create({
                                userId: user.id,
                                username: username,
                                bankName: bankName,
                                deposit: text,
                                limit_balance: newLimitBalance,
                                account_balance: text,
                            });
                            bot.editMessageText(`Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${newLimitBalance}грн.\nВаш поточний баланс карти: ${newAccountBalance} грн.`, {
                                chat_id: chatId,
                                message_id: messageId,
                                reply_markup: keyboardMarkup,
                            });
                        }
                    }
                    else {
                        bot.sendMessage(chatId, "Користувач не знайдений у базі даних.");
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.addDepositToDB = addDepositToDB;
function setDeposit(chatId, messageId, bot) {
    bot
        .sendMessage(chatId, "Будь ласка, введіть суму поповнення:")
        .then((sentMessage) => {
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMessage.message_id);
        }, 5000);
    });
}
exports.setDeposit = setDeposit;
function getListTransactions(chatId, username, userContext, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const bankName = userContext[chatId].bankName;
        try {
            const user = (yield user_1.User.findOne({
                where: { username },
            }));
            if (user) {
                const transactions = (yield deposit_1.Deposit.findAll({
                    where: {
                        userId: user.id,
                        bankName: bankName,
                    },
                    order: [["createdAt", "DESC"]],
                }));
                const transfers = (yield transfer_1.Transfer.findAll({
                    where: {
                        userId: user.id,
                        bankName: bankName,
                    },
                    order: [["createdAt", "DESC"]],
                }));
                let messageText = `Історія транзакцій для банку ${bankName}:\n`;
                transactions.forEach((transaction) => {
                    const formattedDate = transaction.createdAt.toLocaleString();
                    messageText += `${formattedDate} - Поповнення: ${transaction.deposit} грн\n`;
                });
                transfers.forEach((transfer) => {
                    const formattedDate = transfer.createdAt.toLocaleString();
                    messageText += `${formattedDate} - Переказ: ${transfer.transfer} грн\n`;
                });
                bot.sendMessage(chatId, messageText, { parse_mode: "HTML" });
            }
            else {
                bot.sendMessage(chatId, "Користувач не знайдений у базі даних.");
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getListTransactions = getListTransactions;
