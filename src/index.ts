import "dotenv/config";
import TelegramBot, { Message, CallbackQuery } from "node-telegram-bot-api";
import { sequelize } from "./configs/sequelize";
import { User } from "./models/user";
import { Deposit } from "./models/deposit";
import { Transfer } from "./models/transfer";
import { Limit } from "./models/limit";
import { Calculate } from "./models/calculate";
import { createTable } from "./configs/createTable";
// createTable(sequelize, User, Deposit, Transfer, Limit, Calculate);
import {
  clickBack,
  clickMenu,
  clickStart,
  getListBank,
  help,
  manual,
  statistics,
  menuBank,
} from "./mainHandlers/buttonHandlers";
import {
  addDepositToDB,
  getListTransactions,
  setDeposit,
} from "./bankOperations/depositFunctions";
import {
  addLimitToDB,
  setLimit,
  updateBankMenu,
} from "./bankOperations/enterLimit";
import {
  addTransferToDB,
  setTransfer,
} from "./bankOperations/transferOperations";
import { UserContext } from "./mainHandlers/listButtons";
import {
  calculateProfit,
  commission,
  courseBuy,
  courseSell,
  menuCalculator,
  sendQuestion,
  sumBuy,
  updateCalculate,
} from "./buttonClick/calculateButton";

const bot = new TelegramBot(process.env.TOKEN!, { polling: true });

const userContext: UserContext = {};

bot.onText(/\/start/, (msg: Message) => clickStart(msg, bot, userContext));
bot.onText(/menu/, (msg) => clickMenu(msg, bot, userContext));
bot.onText(/manual/, (msg) => manual(msg, bot));
bot.onText(/back/, (msg) => clickBack(msg, bot, userContext));
bot.onText(/limits/, (msg) => statistics(msg, bot));
bot.onText(/manual/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `https://t.me/cryptostratagems`);
});
bot.onText(/\/calculate/, (msg: Message) =>
  menuCalculator(msg, bot, userContext)
);
bot.onText(/calculator/, (msg) => menuCalculator(msg, bot, userContext));

bot.onText(/\/banks/, (msg: Message) => getListBank(msg, bot));
bot.onText(/transaction manager/, (msg: Message) => getListBank(msg, bot));

bot.onText(/\/help/, (msg: Message) => help(msg, bot));
bot.onText(/help/, (msg) => help(msg, bot));

const callbackHandlersForCalculate: {
  [key: string]: (
    chatId: number,
    messageId: number,
    bot: TelegramBot,
    username: any
  ) => void;
} = {
  sum_buy: (chatId, messageId, bot) => {
    userContext[chatId].isSumBuy = true;
    sendQuestion(
      chatId,
      messageId,
      bot,
      userContext,
      "На яку суму ви купляєте USDT?"
    );
  },
  course_buy: (chatId, messageId, bot) => {
    userContext[chatId].isCourseBuy = true;
    sendQuestion(chatId, messageId, bot, userContext, "Курс покупкі?");
  },
  course_sell: (chatId, messageId, bot) => {
    userContext[chatId].isCourseSell = true;
    sendQuestion(chatId, messageId, bot, userContext, "Курс продажі?");
  },
  commission: (chatId, bot, messageId) => {
    userContext[chatId].isCommission = true;
    sendQuestion(
      chatId,
      bot,
      messageId,
      userContext,
      "Яка комісія за всі транзакції?"
    );
  },
  calculate: (chatId, messageId, bot, username) =>
    calculateProfit(chatId, bot, userContext, username),
  refresher: (chatId, messageId, bot, username) =>
    updateCalculate(chatId, messageId, bot, username),
};

const callbackHandlers: {
  [key: string]: (
    chatId: number,
    messageId: number,
    bot: TelegramBot,
    bankName: string,
    username: any
  ) => void;
} = {
  monobank: (chatId, messageId, bot, bankName, username) =>
    menuBank(chatId, messageId, bot, bankName, userContext, username),
  privat: (chatId, messageId, bot, bankName, username) =>
    menuBank(chatId, messageId, bot, bankName, userContext, username),
  pumb: (chatId, messageId, bot, bankName, username) =>
    menuBank(chatId, messageId, bot, bankName, userContext, username),
  abank: (chatId, messageId, bot, bankName, username) =>
    menuBank(chatId, messageId, bot, bankName, userContext, username),
  novapay: (chatId, messageId, bot, bankName, username) =>
    menuBank(chatId, messageId, bot, bankName, userContext, username),
  sportbank: (chatId, messageId, bot, bankName, username) =>
    menuBank(chatId, messageId, bot, bankName, userContext, username),
  back_to_banks: (chatId, messageId, bot) =>
    updateBankMenu(chatId, messageId, bot, userContext),
  set_limit: (chatId, messageId, bot) => {
    userContext[chatId].isSettingLimit = true;
    setLimit(chatId, messageId, bot);
  },
  transactions: (chatId, messageId, bot) => {
    userContext[chatId].isDeposit = true;
    setDeposit(chatId, messageId, bot);
  },
  history_transactions: (chatId, messageId, bot, bankName, username) => {
    getListTransactions(chatId, username, userContext, bot);
  },
  transfer: (chatId, messageId, bot) => {
    userContext[chatId].isTransfer = true;
    setTransfer(chatId, messageId, bot);
  },
};

bot.on("callback_query", (query: CallbackQuery) => {
  const username: any = query.from.username;
  const data: string = query.data as string;
  const bankName: string = query.data as string;
  const chatId = query.message!.chat.id;
  const messageId = query.message!.message_id;
  const handlerForBank = callbackHandlers[data];
  const handlerForCalculate = callbackHandlersForCalculate[data];
  if (handlerForBank) {
    handlerForBank(chatId, messageId, bot, bankName, username);
  } else if (handlerForCalculate) {
    handlerForCalculate(chatId, messageId, bot, username);
  } else {
    bot.sendMessage(chatId, "Невідома команда.");
  }
});

bot.on("message", (msg: Message) => {
  const chatId: number = msg.chat.id;
  const username = msg.chat.username;
  if (userContext[chatId]?.isSettingLimit) {
    addLimitToDB(msg, userContext, bot);
    userContext[chatId].isSettingLimit = false;
  }
  if (userContext[chatId]?.isDeposit) {
    addDepositToDB(msg, userContext, bot);
    userContext[chatId].isDeposit = false;
  }
  if (userContext[chatId]?.isTransfer) {
    addTransferToDB(msg, userContext, bot);
    userContext[chatId].isTransfer = false;
  }
  if (userContext[chatId]?.isSumBuy) {
    sumBuy(msg, userContext, bot, username);
    userContext[chatId].isSumBuy = false;
  }
  if (userContext[chatId]?.isCourseBuy) {
    courseBuy(msg, userContext, bot, username);
    userContext[chatId].isCourseBuy = false;
  }
  if (userContext[chatId]?.isCourseSell) {
    courseSell(msg, userContext, bot, username);
    userContext[chatId].isCourseSell = false;
  }
  if (userContext[chatId]?.isCommission) {
    commission(msg, userContext, bot, username);
    userContext[chatId].isCommission = false;
  }
});
