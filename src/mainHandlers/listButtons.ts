export interface UserContext {
  [key: number]: any;
}

export const bankOperations: Array<
  Array<{ text: string; callback_data: string }>
> = [
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

export const calculateOperations: Array<
  Array<{ text: string; callback_data: string }>
> = [
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

export const bankMenuKeyboard: Array<
  Array<{ text: string; callback_data: string }>
> = [
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

export const menu: Record<string, string[][]> = {
  mainMenu: [["📚 menu", "📖 manual"]],
  menuButton: [
    ["🧮 calculator", "📊 limits"],
    ["💼 transaction manager", "❓ help"],
    ["⬅️ back"],
  ],
};

export const ignoreListButton = [
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
