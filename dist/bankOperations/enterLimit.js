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
exports.addLimitToDB = exports.setLimit = exports.updateBankMenu = void 0;
const user_1 = require("../models/user");
const limit_1 = require("../models/limit");
const listButtons_1 = require("../mainHandlers/listButtons");
const listButtons_2 = require("../mainHandlers/listButtons");
function updateBankMenu(chatId, messageId, bot, userContext) {
    const keyboardMarkup = {
        inline_keyboard: listButtons_1.bankMenuKeyboard,
    };
    userContext[chatId].isSettingLimit = false;
    userContext[chatId].isProfit = false;
    userContext[chatId].isTransactions = false;
    userContext[chatId].isTransfer = false;
    userContext[chatId].isSumBuy = false;
    userContext[chatId].isCourseBuy = false;
    userContext[chatId].isCourseSell = false;
    userContext[chatId].isCommission = false;
    if (messageId === undefined) {
        bot
            .sendMessage(chatId, "Виберіть опцію:", {
            reply_markup: keyboardMarkup,
        })
            .then((sentMessage) => {
            messageId = sentMessage.message_id;
        });
    }
    else {
        bot.editMessageText("Виберіть банк:", {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: keyboardMarkup,
        });
    }
}
exports.updateBankMenu = updateBankMenu;
function setLimit(chatId, messageId, bot) {
    bot
        .sendMessage(chatId, "Будь ласка, введіть новий ліміт:")
        .then((sentMessage) => {
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMessage.message_id);
        }, 5000);
    });
}
exports.setLimit = setLimit;
function addLimitToDB(msg, userContext, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const text = msg.text;
        const username = msg.chat.username;
        const bankName = userContext[chatId].bankName;
        const messageId = userContext[chatId].messageId;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.bankOperations,
        };
        try {
            if (text && (listButtons_2.ignoreListButton === null || listButtons_2.ignoreListButton === void 0 ? void 0 : listButtons_2.ignoreListButton.includes(text))) {
                userContext[chatId].isSettingLimit = false;
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
                        userContext[chatId].currentBalance = limit === null || limit === void 0 ? void 0 : limit.account_balance;
                        if (limit) {
                            yield limit_1.Limit.update({ limit_balance: text }, {
                                where: {
                                    userId: user.id,
                                    username: username,
                                    bankName: bankName,
                                },
                            });
                        }
                        else {
                            const limit = (yield limit_1.Limit.create({
                                userId: user.id,
                                username: username,
                                bankName: bankName,
                                limit_balance: text,
                                account_balance: 0,
                            }));
                            userContext[chatId].currentBalance = limit === null || limit === void 0 ? void 0 : limit.account_balance;
                        }
                        bot.editMessageText(`Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${text}грн.\nВаш поточний баланс карти: ${userContext[chatId].currentBalance} грн.`, {
                            chat_id: chatId,
                            message_id: messageId,
                            reply_markup: keyboardMarkup,
                        });
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
exports.addLimitToDB = addLimitToDB;
