"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
// createTable(sequelize, User, Deposit, Transfer, Limit, Calculate);
const buttonHandlers_1 = require("./mainHandlers/buttonHandlers");
const depositFunctions_1 = require("./bankOperations/depositFunctions");
const enterLimit_1 = require("./bankOperations/enterLimit");
const transferOperations_1 = require("./bankOperations/transferOperations");
const calculateButton_1 = require("./buttonClick/calculateButton");
const bot = new node_telegram_bot_api_1.default(process.env.TOKEN, { polling: true });
const userContext = {};
bot.onText(/\/start/, (msg) => (0, buttonHandlers_1.clickStart)(msg, bot, userContext));
bot.onText(/menu/, (msg) => (0, buttonHandlers_1.clickMenu)(msg, bot, userContext));
bot.onText(/manual/, (msg) => (0, buttonHandlers_1.manual)(msg, bot));
bot.onText(/back/, (msg) => (0, buttonHandlers_1.clickBack)(msg, bot, userContext));
bot.onText(/limits/, (msg) => (0, buttonHandlers_1.statistics)(msg, bot));
bot.onText(/manual/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `https://t.me/cryptostratagems`);
});
bot.onText(/back/, (msg) => (0, buttonHandlers_1.clickBack)(msg, bot, userContext));
bot.onText(/statistics/, (msg) => (0, buttonHandlers_1.statistics)(msg, bot));
bot.onText(/\/calculate/, (msg) => (0, calculateButton_1.menuCalculator)(msg, bot, userContext));
bot.onText(/calculator/, (msg) => (0, calculateButton_1.menuCalculator)(msg, bot, userContext));
bot.onText(/\/banks/, (msg) => (0, buttonHandlers_1.getListBank)(msg, bot));
bot.onText(/transaction manager/, (msg) => (0, buttonHandlers_1.getListBank)(msg, bot));
bot.onText(/\/help/, (msg) => (0, buttonHandlers_1.help)(msg, bot));
bot.onText(/help/, (msg) => (0, buttonHandlers_1.help)(msg, bot));
const callbackHandlersForCalculate = {
    sum_buy: (chatId, messageId, bot) => {
        userContext[chatId].isSumBuy = true;
        (0, calculateButton_1.sendQuestion)(chatId, messageId, bot, userContext, "На яку суму ви купляєте USDT?");
    },
    course_buy: (chatId, messageId, bot) => {
        userContext[chatId].isCourseBuy = true;
        (0, calculateButton_1.sendQuestion)(chatId, messageId, bot, userContext, "Курс покупкі?");
    },
    course_sell: (chatId, messageId, bot) => {
        userContext[chatId].isCourseSell = true;
        (0, calculateButton_1.sendQuestion)(chatId, messageId, bot, userContext, "Курс продажі?");
    },
    commission: (chatId, bot, messageId) => {
        userContext[chatId].isCommission = true;
        (0, calculateButton_1.sendQuestion)(chatId, bot, messageId, userContext, "Яка комісія за всі транзакції?");
    },
    calculate: (chatId, messageId, bot, username) => (0, calculateButton_1.calculateProfit)(chatId, bot, userContext, username),
    refresher: (chatId, messageId, bot, username) => (0, calculateButton_1.updateCalculate)(chatId, messageId, bot, username),
};
const callbackHandlers = {
    monobank: (chatId, messageId, bot, bankName, username) => (0, buttonHandlers_1.menuBank)(chatId, messageId, bot, bankName, userContext, username),
    privat: (chatId, messageId, bot, bankName, username) => (0, buttonHandlers_1.menuBank)(chatId, messageId, bot, bankName, userContext, username),
    pumb: (chatId, messageId, bot, bankName, username) => (0, buttonHandlers_1.menuBank)(chatId, messageId, bot, bankName, userContext, username),
    abank: (chatId, messageId, bot, bankName, username) => (0, buttonHandlers_1.menuBank)(chatId, messageId, bot, bankName, userContext, username),
    novapay: (chatId, messageId, bot, bankName, username) => (0, buttonHandlers_1.menuBank)(chatId, messageId, bot, bankName, userContext, username),
    sportbank: (chatId, messageId, bot, bankName, username) => (0, buttonHandlers_1.menuBank)(chatId, messageId, bot, bankName, userContext, username),
    back_to_banks: (chatId, messageId, bot) => (0, enterLimit_1.updateBankMenu)(chatId, messageId, bot, userContext),
    set_limit: (chatId, messageId, bot) => {
        userContext[chatId].isSettingLimit = true;
        (0, enterLimit_1.setLimit)(chatId, messageId, bot);
    },
    transactions: (chatId, messageId, bot) => {
        userContext[chatId].isDeposit = true;
        (0, depositFunctions_1.setDeposit)(chatId, messageId, bot);
    },
    history_transactions: (chatId, messageId, bot, bankName, username) => {
        (0, depositFunctions_1.getListTransactions)(chatId, username, userContext, bot);
    },
    transfer: (chatId, messageId, bot) => {
        userContext[chatId].isTransfer = true;
        (0, transferOperations_1.setTransfer)(chatId, messageId, bot);
    },
};
bot.on("callback_query", (query) => {
    const username = query.from.username;
    const data = query.data;
    const bankName = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const handlerForBank = callbackHandlers[data];
    const handlerForCalculate = callbackHandlersForCalculate[data];
    if (handlerForBank) {
        handlerForBank(chatId, messageId, bot, bankName, username);
    }
    else if (handlerForCalculate) {
        handlerForCalculate(chatId, messageId, bot, username);
    }
    else {
        bot.sendMessage(chatId, "Невідома команда.");
    }
});
bot.on("message", (msg) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    if ((_a = userContext[chatId]) === null || _a === void 0 ? void 0 : _a.isSettingLimit) {
        (0, enterLimit_1.addLimitToDB)(msg, userContext, bot);
        userContext[chatId].isSettingLimit = false;
    }
    if ((_b = userContext[chatId]) === null || _b === void 0 ? void 0 : _b.isDeposit) {
        (0, depositFunctions_1.addDepositToDB)(msg, userContext, bot);
        userContext[chatId].isDeposit = false;
    }
    if ((_c = userContext[chatId]) === null || _c === void 0 ? void 0 : _c.isTransfer) {
        (0, transferOperations_1.addTransferToDB)(msg, userContext, bot);
        userContext[chatId].isTransfer = false;
    }
    if ((_d = userContext[chatId]) === null || _d === void 0 ? void 0 : _d.isSumBuy) {
        (0, calculateButton_1.sumBuy)(msg, userContext, bot, username);
        userContext[chatId].isSumBuy = false;
    }
    if ((_e = userContext[chatId]) === null || _e === void 0 ? void 0 : _e.isCourseBuy) {
        (0, calculateButton_1.courseBuy)(msg, userContext, bot, username);
        userContext[chatId].isCourseBuy = false;
    }
    if ((_f = userContext[chatId]) === null || _f === void 0 ? void 0 : _f.isCourseSell) {
        (0, calculateButton_1.courseSell)(msg, userContext, bot, username);
        userContext[chatId].isCourseSell = false;
    }
    if ((_g = userContext[chatId]) === null || _g === void 0 ? void 0 : _g.isCommission) {
        (0, calculateButton_1.commission)(msg, userContext, bot, username);
        userContext[chatId].isCommission = false;
    }
});
