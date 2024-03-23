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
exports.updateCalculate = exports.calculateProfit = exports.commission = exports.courseSell = exports.courseBuy = exports.sumBuy = exports.menuCalculator = exports.sendQuestion = void 0;
const listButtons_1 = require("../mainHandlers/listButtons");
const calculate_1 = require("../models/calculate");
const user_1 = require("../models/user");
const listButtons_2 = require("../mainHandlers/listButtons");
function sendQuestion(chatId, messageId, bot, userContext, text) {
    userContext[chatId].messageId = messageId;
    bot.sendMessage(chatId, `${text}`).then((sentMessage) => {
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMessage.message_id);
        }, 5000);
    });
}
exports.sendQuestion = sendQuestion;
function menuCalculator(msg, bot, userContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const username = msg.chat.username;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        if (!userContext[chatId]) {
            userContext[chatId] = {};
        }
        userContext[chatId].messageId = msg.message_id;
        try {
            const user = (yield user_1.User.findOne({
                where: { username },
            }));
            if (user) {
                const calculate = (yield calculate_1.Calculate.findOne({
                    where: {
                        userId: user.id,
                        username: username,
                    },
                }));
                if (calculate) {
                    bot.sendMessage(chatId, `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`, {
                        reply_markup: keyboardMarkup,
                    });
                }
                else {
                    const calculate = (yield calculate_1.Calculate.create({
                        userId: user.id,
                        username: username,
                        sum_buy: 0,
                        course_buy: 0,
                        course_sell: 0,
                        get_currency: 0,
                        commission: 0,
                        profit: 0,
                        expense_limit: 0,
                    }));
                    bot.sendMessage(chatId, `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`, {
                        reply_markup: keyboardMarkup,
                    });
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.menuCalculator = menuCalculator;
function sumBuy(msg, userContext, bot, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const messageId = userContext[chatId].messageId;
        const text = msg.text;
        userContext[chatId].sumBuy = msg.text;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        try {
            if (text && (listButtons_2.ignoreListButton === null || listButtons_2.ignoreListButton === void 0 ? void 0 : listButtons_2.ignoreListButton.includes(text))) {
                userContext[chatId].isSumBuy = false;
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
                    const calculate = (yield calculate_1.Calculate.findOne({
                        where: { username: username },
                    }));
                    let getCurrency = (Number(msg.text) / (calculate === null || calculate === void 0 ? void 0 : calculate.course_buy)).toFixed(2);
                    if (getCurrency == "Infinity")
                        getCurrency = "0";
                    if (calculate) {
                        yield calculate_1.Calculate.update({ sum_buy: text, get_currency: getCurrency }, {
                            where: {
                                username: username,
                            },
                        });
                        bot.editMessageText(`Купуєте USDT 💵 на: ${text}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${getCurrency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`, {
                            chat_id: chatId,
                            message_id: messageId,
                            reply_markup: keyboardMarkup,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.sumBuy = sumBuy;
function courseBuy(msg, userContext, bot, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const text = msg.text;
        const messageId = userContext[chatId].messageId;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        try {
            if (text && (listButtons_2.ignoreListButton === null || listButtons_2.ignoreListButton === void 0 ? void 0 : listButtons_2.ignoreListButton.includes(text))) {
                userContext[chatId].isCourseBuy = false;
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
                    const calculate = (yield calculate_1.Calculate.findOne({
                        where: { username: username },
                    }));
                    const getCurrency = ((calculate === null || calculate === void 0 ? void 0 : calculate.sum_buy) / Number(msg.text)).toFixed(2);
                    if (calculate) {
                        yield calculate_1.Calculate.update({ course_buy: text, get_currency: getCurrency }, {
                            where: {
                                username: username,
                            },
                        });
                        bot.editMessageText(`Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${text}\nВи отримаєте USDT: ${getCurrency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`, {
                            chat_id: chatId,
                            message_id: messageId,
                            reply_markup: keyboardMarkup,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.courseBuy = courseBuy;
function courseSell(msg, userContext, bot, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const text = msg.text;
        const messageId = userContext[chatId].messageId;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        try {
            if (text && (listButtons_2.ignoreListButton === null || listButtons_2.ignoreListButton === void 0 ? void 0 : listButtons_2.ignoreListButton.includes(text))) {
                userContext[chatId].isCourseSell = false;
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
                    const calculate = (yield calculate_1.Calculate.findOne({
                        where: { username: username },
                    }));
                    if (calculate) {
                        yield calculate_1.Calculate.update({ course_sell: text }, {
                            where: {
                                username: username,
                            },
                        });
                        bot.editMessageText(`Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${text}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`, {
                            chat_id: chatId,
                            message_id: messageId,
                            reply_markup: keyboardMarkup,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.courseSell = courseSell;
function commission(msg, userContext, bot, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const text = msg.text;
        const messageId = userContext[chatId].messageId;
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        try {
            if (text && (listButtons_2.ignoreListButton === null || listButtons_2.ignoreListButton === void 0 ? void 0 : listButtons_2.ignoreListButton.includes(text))) {
                userContext[chatId].isCommission = false;
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
                    const calculate = (yield calculate_1.Calculate.findOne({
                        where: { username: username },
                    }));
                    if (calculate) {
                        yield calculate_1.Calculate.update({ commission: text }, {
                            where: {
                                username: username,
                            },
                        });
                        bot.editMessageText(`Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${text}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`, {
                            chat_id: chatId,
                            message_id: messageId,
                            reply_markup: keyboardMarkup,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.commission = commission;
function calculateProfit(chatId, bot, userContext, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        try {
            const calculate = (yield calculate_1.Calculate.findOne({
                where: { username: username },
            }));
            const getProfit = (((calculate === null || calculate === void 0 ? void 0 : calculate.course_sell) - (calculate === null || calculate === void 0 ? void 0 : calculate.course_buy)) *
                (calculate === null || calculate === void 0 ? void 0 : calculate.get_currency) -
                (calculate === null || calculate === void 0 ? void 0 : calculate.commission) * (calculate === null || calculate === void 0 ? void 0 : calculate.course_buy)).toFixed(2);
            const getLimit = Number((calculate === null || calculate === void 0 ? void 0 : calculate.sum_buy) * 2 + Number(getProfit)).toFixed(2);
            if (calculate) {
                yield calculate_1.Calculate.update({ profit: getProfit, expense_limit: getLimit }, {
                    where: {
                        username: username,
                    },
                });
                bot.sendMessage(chatId, `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${getLimit}\nВаш чистий дохід складає 💳: ${getProfit}`, {
                    reply_markup: keyboardMarkup,
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.calculateProfit = calculateProfit;
function updateCalculate(chatId, messageId, bot, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyboardMarkup = {
            inline_keyboard: listButtons_1.calculateOperations,
        };
        try {
            yield calculate_1.Calculate.update({
                sum_buy: 0,
                course_buy: 0,
                course_sell: 0,
                get_currency: 0,
                commission: 0,
                profit: 0,
                expense_limit: 0,
            }, { where: { username: username } });
            bot.editMessageText(`Купуєте USDT 💵 на: 0\nКурс купівлі: 0\nВи отримаєте USDT: 0\nКурс продажу 💥: 0\nКомісія ( в USDT) : 0\nВитрата ліміту по банку: 0\nВаш чистий дохід складає 💳: 0`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: keyboardMarkup,
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.updateCalculate = updateCalculate;
