"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreListButton = exports.menu = exports.bankMenuKeyboard = exports.calculateOperations = exports.bankOperations = void 0;
exports.bankOperations = [
    [
        { text: "💰 Set Limit", callback_data: "set_limit" },
        { text: "💳 Deposit ", callback_data: "transactions" },
    ],
    [
        { text: "📜 Transaction History ", callback_data: "history_transactions" },
        { text: "💸 Transfer", callback_data: "transfer" },
    ],
    [{ text: "⬅️ back", callback_data: "back_to_banks" }],
];
exports.calculateOperations = [
    [
        { text: "💰 Сума купівлі", callback_data: "sum_buy" },
        { text: "💹 Курс купівлі", callback_data: "course_buy" },
    ],
    [
        { text: "📉 Курс продажу", callback_data: "course_sell" },
        { text: "💸 Комісія", callback_data: "commission" },
    ],
    [
        { text: "🧮 Розрахунок", callback_data: "calculate" },
        { text: "🔄 Оновлення", callback_data: "refresher" },
    ],
];
exports.bankMenuKeyboard = [
    [
        {
            text: "MonoBank 💻",
            callback_data: "monobank",
        },
        {
            text: "PrivatBank 🏪",
            callback_data: "privat",
        },
    ],
    [
        { text: "Pumb 🏦", callback_data: "pumb" },
        { text: "ABank 🗽", callback_data: "abank" },
    ],
    [
        { text: "NovaPay💵", callback_data: "novapay" },
        { text: "SportBank 💳", callback_data: "sportbank" },
    ],
];
exports.menu = {
    mainMenu: [["📚 menu", "📖 manual"]],
    menuButton: [
        ["🧮 calculator", "📊 limits"],
        ["💼 transaction manager", "❓ help"],
        ["⬅️ back"],
    ],
};
exports.ignoreListButton = [
    "/start",
    "📚 menu",
    "📖 manual",
    "📊 limits",
    "/calculate",
    "🧮 calculator",
    "/banks",
    "💼 transaction manager",
    "/help",
    "❓ help",
    "⬅️ back",
];
