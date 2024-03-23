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
exports.setTransfer = exports.addTransferToDB = void 0;
const transfer_1 = require("../models/transfer");
const user_1 = require("../models/user");
const listButtons_1 = require("../mainHandlers/listButtons");
const limit_1 = require("../models/limit");
const listButtons_2 = require("../mainHandlers/listButtons");
function addTransferToDB(msg, userContext, bot) {
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
                userContext[chatId].isTransfer = false;
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
                    const limit = (yield limit_1.Limit.findOne({
                        where: { username: username, bankName: bankName },
                    }));
                    const currentBalance = Number(limit === null || limit === void 0 ? void 0 : limit.account_balance);
                    const transferAmount = Number(text);
                    if (currentBalance < transferAmount) {
                        const amountDifference = transferAmount - currentBalance;
                        bot
                            .sendMessage(chatId, `На вашому рахунку недостатньо ${amountDifference} грн. для виконання переказу коштів!`)
                            .then((sentMessage) => {
                            setTimeout(() => {
                                bot.deleteMessage(chatId, sentMessage.message_id);
                            }, 5000);
                        });
                    }
                    else if (user) {
                        (yield transfer_1.Transfer.create({
                            userId: user.id,
                            username: username,
                            bankName: bankName,
                            transfer: transferAmount,
                        }));
                        const accountBalance = currentBalance - transferAmount;
                        yield limit_1.Limit.update({
                            account_balance: accountBalance,
                        }, {
                            where: {
                                userId: user.id,
                                username: username,
                                bankName: bankName,
                            },
                        });
                        bot.editMessageText(`Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${limit === null || limit === void 0 ? void 0 : limit.limit_balance}грн.\nВаш поточний баланс карти: ${accountBalance} грн.`, {
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
exports.addTransferToDB = addTransferToDB;
function setTransfer(chatId, messageId, bot) {
    bot
        .sendMessage(chatId, "Будь ласка, введіть суму переказу:")
        .then((sentMessage) => {
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMessage.message_id);
        }, 5000);
    });
}
exports.setTransfer = setTransfer;
