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
exports.menuBank = exports.statistics = exports.help = exports.getListBank = exports.clickBack = exports.manual = exports.clickMenu = exports.clickStart = void 0;
const user_1 = require("../models/user");
const limit_1 = require("../models/limit");
const listButtons_1 = require("./listButtons");
const takeButtons = (currentKey) => listButtons_1.menu[currentKey];
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
        const userExist = yield user_1.User.findOne({ where: { username } });
        const chatId = msg.chat.id;
        const currentKey = "mainMenu";
        setKey(currentKey, userContext, chatId);
        const buttons = takeButtons(currentKey);
        const keyboard = buttons.map((row) => row.map((text) => ({ text })));
        if (!userExist) {
            yield user_1.User.create({
                name: msg.chat.first_name,
                username,
            });
        }
        const message = `Вітаємо вас у нашому боті Crypto Stratagems P2P 💼\n
  Він був створений зусиллями нашої невеликої команди для покращення ваших результатів та фінансової грамотності 🎒\n
  В ньому ви можете розрахувати дохідність своїх звʼязок , добавити баланс до кожного українського банку ( поповнення , витрати , ліміт , тощо ) і завжди знати скільки коштів , залишку ліміту у вас залишилось ✨\n
  Для вас був створений мануал , система підтримки , а із найприємнішого загальна статистика 📊 - в ній ви можете побачити ліміти банків 🏦\n
  Приємного користування , з найкращими побажаннями команда  <a href="https://t.me/cryptostratagems">Crypto Stratagems</a> 📈.`;
        bot.sendMessage(chatId, `${message}`, {
            parse_mode: "HTML",
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
function manual(msg, bot) {
    const chatId = msg.chat.id;
    const message = `Все просто , розберетесь з легкістю з <a href="https://t.me/cryptostratagems">Crypto Stratagems</a>`;
    bot.sendMessage(chatId, message, { parse_mode: "HTML" });
}
exports.manual = manual;
function clickBack(msg, bot, userContext) {
    const chatId = msg.chat.id;
    const currentKey = back(userContext[chatId].currentKey);
    setKey(currentKey, userContext, chatId);
    const buttons = takeButtons(currentKey);
    const keyboard = buttons.map((row) => row.map((text) => ({ text })));
    userContext[chatId].isSettingLimit = false;
    userContext[chatId].isDeposit = false;
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
function getListBank(msg, bot) {
    const chatId = msg.chat.id;
    const keyboardMarkup = {
        inline_keyboard: listButtons_1.bankMenuKeyboard,
    };
    bot.sendMessage(chatId, "Виберіть банк:", {
        reply_markup: keyboardMarkup,
    });
}
exports.getListBank = getListBank;
function help(msg, bot) {
    const chatId = msg.chat.id;
    const message = `Наші хелпери готові відповісти на ваші запитання та надати допомогу щодо телеграм боту. 

  Будь ласка, будьте готові до конкретних та чітких запитань, щоб ми могли краще вам допомогти.
  
  Звертатись до: <a href="https://t.me/cryptostratagems">CRYPTO STRATAGEMS</a>
  
  ⚡️⚡️@kiewermassiv⚡️⚡️
  🗽🗽@Djdudhwrb 🗽🗽
  
  ‼️ Працюємо з 8.00 - 2.00 ‼️`;
    bot.sendMessage(chatId, message, { parse_mode: "HTML" });
}
exports.help = help;
function statistics(msg, bot) {
    const chatId = msg.chat.id;
    const message = `PrivatBank 🌝:
  Не дуже дружелюбний до кріпти, з комісією 0.5% (максимум 50 UAH). Наша рекомендація: не більше 100.000₴ на місяць. ✨
  
  Monobank 🌞:
  Останнім часом показує себе не найкраще. Ліміт на картку 400,000₴, але дохід з P2P не підтверджується, тільки довідки ОК або ФОП. Рекомендація: не більше 150,000₴ на місяць.
  
  Abank 🌓:
  Чудовий банк з комісією 0%. Рекомендація: до 130.000₴ на місяць.
  
  PUMB 🔥:
  Золота середина з комісією 0%. Рекомендація: до 125.000₴ на місяць.
  
  Novapay 🤯:
  Пишуть про ліміт до 400,000₴, але фактично до 100-150+. При перевищенні починаються питання та запит багатьох документів, а при відмові блокують фінанси на 45 календарних днів. 🫥
  
  RWSbank 🌓: не дуже популярний банк , але дає змогу заводити великі суми , на підтримку банку в випадку чого можна навіть не сподіватись . Це щось типу маленького ломбарду біля ЖД 😅. 
  
  Наша рекомендація: 1.000.000₴ 🔥
  
  Всі ці суми розраховані на місяць , якщо ви заведете їх за день , на позитивний результат можна навіть не сподіватись 💶`;
    bot.sendMessage(chatId, message);
}
exports.statistics = statistics;
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
            inline_keyboard: listButtons_1.bankOperations,
        };
        const limit = (yield limit_1.Limit.findOne({
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
