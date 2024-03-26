import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
  KeyboardButton,
} from "node-telegram-bot-api";
import { User } from "../models/user";
import { LimitInstance, Limit } from "../models/limit";

import {
  UserContext,
  bankOperations,
  bankMenuKeyboard,
  menu,
} from "./listButtons";

const takeButtons = (currentKey: string): string[][] => menu[currentKey];

const setKey = (value: string, userContext: UserContext, chatId: number) => {
  if (!userContext[chatId]) {
    userContext[chatId] = {};
  }
  userContext[chatId].currentKey = value;
};

export function back(currentKey: string): string {
  switch (currentKey) {
    case "menuButton":
      return "mainMenu";
    default:
      return "mainMenu";
  }
}

export async function clickStart(
  msg: Message,
  bot: TelegramBot,
  userContext: UserContext
) {
  const username = msg.chat.username;
  if (!username) {
    bot.sendMessage(
      msg.chat.id,
      "Ваш обліковий запис Telegram не має імені користувача."
    );
    return;
  }
  const userExist = await User.findOne({ where: { username } });
  const chatId: number = msg.chat.id;
  const currentKey = "mainMenu";
  setKey(currentKey, userContext, chatId);
  const buttons = takeButtons(currentKey);

  const keyboard: KeyboardButton[][] = buttons.map((row) =>
    row.map((text) => ({ text }))
  );

  if (!userExist) {
    await User.create({
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
}

export function clickMenu(
  msg: Message,
  bot: TelegramBot,
  userContext: UserContext
) {
  const chatId = msg.chat.id;
  const currentKey = "menuButton";
  setKey(currentKey, userContext, chatId);
  const buttons = takeButtons(currentKey);
  const keyboard: KeyboardButton[][] = buttons.map((row) =>
    row.map((text) => ({ text }))
  );
  bot.sendMessage(chatId, "Ви в головному меню ⏯", {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
    },
  });
}

export function manual(msg: Message, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const message = `Все просто , розберетесь з легкістю з <a href="https://t.me/cryptostratagems">Crypto Stratagems</a>`;
  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
}

export function clickBack(
  msg: Message,
  bot: TelegramBot,
  userContext: UserContext
) {
  const chatId = msg.chat.id;
  const currentKey = back(userContext[chatId].currentKey);
  setKey(currentKey, userContext, chatId);
  const buttons = takeButtons(currentKey);
  const keyboard: KeyboardButton[][] = buttons.map((row) =>
    row.map((text) => ({ text }))
  );
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

export function getListBank(msg: Message, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: bankMenuKeyboard,
  };

  bot.sendMessage(chatId, "Виберіть банк:", {
    reply_markup: keyboardMarkup,
  });
}

export function help(msg: Message, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const message = `Наші хелпери готові відповісти на ваші запитання та надати допомогу щодо телеграм боту. 

  Будь ласка, будьте готові до конкретних та чітких запитань, щоб ми могли краще вам допомогти.
  
  Звертатись до: <a href="https://t.me/cryptostratagems">CRYPTO STRATAGEMS</a>
  
  ⚡️⚡️@kiewermassiv⚡️⚡️
  🗽🗽@Djdudhwrb 🗽🗽
  
  ‼️ Працюємо з 8.00 - 2.00 ‼️`;

  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
}

export function statistics(msg: Message, bot: TelegramBot) {
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

export async function menuBank(
  chatId: number,
  messageId: number,
  bot: TelegramBot,
  bankName: string,
  userContext: UserContext,
  username: any
) {
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

  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: bankOperations,
  };

  const limit = (await Limit.findOne({
    where: {
      username: username,
      bankName: bankName,
    },
  })) as LimitInstance | null;

  const currentBalance = limit ? limit.account_balance : 0;
  const currentLimit = limit ? limit.limit_balance : 0;
  userContext[chatId].currentLimit = currentLimit;
  bot.editMessageText(
    `Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${currentLimit} грн.\nВаш поточний баланс карти: ${currentBalance} грн.`,
    {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboardMarkup,
    }
  );
}
