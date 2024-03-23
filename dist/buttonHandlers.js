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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuBank = exports.getListBank = exports.clickBack = exports.clickMenu = exports.clickStart = void 0;
const user_1 = __importDefault(require("./model/user"));
const limit_1 = __importDefault(require("./model/limit"));
const interface_1 = require("./interface");
const takeButtons = (currentKey) => interface_1.menu[currentKey];
const setKey = (value, userContext, chatId) => {
    if (!userContext[chatId]) {
        userContext[chatId] = {};
    }
    userContext[chatId].currentKey = value;
};
function back(currentKey) {
    switch (currentKey) {
        case "menuButton":
            return "mainMenu";
        default:
            return "mainMenu";
    }
}
function clickStart(msg, bot, userContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = msg.chat.username;
        if (!username) {
            bot.sendMessage(msg.chat.id, "Ваш обліковий запис Telegram не має імені користувача.");
            return;
        }
        const userExist = yield user_1.default.findOne({ where: { username } });
        const chatId = msg.chat.id;
        const currentKey = "mainMenu";
        setKey(currentKey, userContext, chatId);
        const buttons = takeButtons(currentKey);
        const keyboard = buttons.map((row) => row.map((text) => ({ text })));
        if (!userExist) {
            yield user_1.default.create({
                name: msg.chat.first_name,
                username,
            });
        }
        const message = `Вітаємо вас у нашому боті Crypto Stratagems P2P 💼

  Він був створений зусиллями нашої невеликої команди для покращення ваших результатів та фінансової грамотності 🎒
  
  В ньому ви можете розрахувати дохідність своїх звʼязок , добавити баланс до кожного українського банку ( поповнення , витрати , ліміт , тощо ) і завжди знати скільки коштів , залишку ліміту у вас залишилось ✨
  
  Для вас був створений мануал , система підтримки , а із найприємнішого загальна статистика 📊 - в ній ви можете побачити кількість переказів , суму , чиста дохідність за місяць , рік і так далі 🏦
  
  Приємного користування , з найкращими побажаннями команда Crypto Stratagems (https://t.me/cryptostratagems) 📈.`;
        bot.sendMessage(chatId, `${message}`, {
            reply_markup: {
                keyboard,
                resize_keyboard: true,
            },
        });
    });
}
exports.clickStart = clickStart;
function clickMenu(msg, bot, userContext) {
    const chatId = msg.chat.id;
    const currentKey = "menuButton";
    setKey(currentKey, userContext, chatId);
    const buttons = takeButtons(currentKey);
    const keyboard = buttons.map((row) => row.map((text) => ({ text })));
    bot.sendMessage(chatId, "Ви в головному меню ⏯", {
        reply_markup: {
            keyboard,
            resize_keyboard: true,
        },
    });
}
exports.clickMenu = clickMenu;
function clickBack(msg, bot, userContext) {
    const chatId = msg.chat.id;
    const currentKey = back(userContext[chatId].currentKey);
    setKey(currentKey, userContext, chatId);
    const buttons = takeButtons(currentKey);
    const keyboard = buttons.map((row) => row.map((text) => ({ text })));
    userContext[chatId].isSettingLimit = false;
    userContext[chatId].isProfit = false;
    userContext[chatId].isTransactions = false;
    userContext[chatId].isTransfer = false;
    userContext[chatId].isSumBuy = false;
    userContext[chatId].isCourseBuy = false;
    userContext[chatId].isCourseSell = false;
    userContext[chatId].isCommission = false;
    bot.sendMessage(chatId, "⬅️ Повернення до попереднього меню... ⬅️", {
        reply_markup: {
            keyboard,
            resize_keyboard: true,
        },
    });
}
exports.clickBack = clickBack;
function getListBank(chatId, bot) {
    const keyboardMarkup = {
        inline_keyboard: interface_1.bankMenuKeyboard,
    };
    bot.sendMessage(chatId, "Виберіть банк:", {
        reply_markup: keyboardMarkup,
    });
}
exports.getListBank = getListBank;
function menuBank(chatId, messageId, bot, bankName, userContext, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const bankNames = [
            "monobank",
            "privat",
            "pumb",
            "abank",
            "novapay",
            "sportbank",
        ];
        if (!bankNames.includes(bankName)) {
            bot.sendMessage(chatId, "Не вдалося знайти відповідний банк.");
            return;
        }
        if (!userContext[chatId]) {
            userContext[chatId] = {};
        }
        userContext[chatId].bankName = bankName;
        userContext[chatId].messageId = messageId;
        const keyboardMarkup = {
            inline_keyboard: interface_1.bankOperations,
        };
        const limit = (yield limit_1.default.findOne({
            where: {
                username: username,
                bankName: bankName,
            },
        }));
        const currentBalance = limit ? limit.account_balance : 0;
        const currentLimit = limit ? limit.limit_balance : 0;
        userContext[chatId].currentLimit = currentLimit;
        bot.editMessageText(`Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${currentLimit} грн.\nВаш поточний баланс карти: ${currentBalance} грн.`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: keyboardMarkup,
        });
    });
}
exports.menuBank = menuBank;
