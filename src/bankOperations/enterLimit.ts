import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
} from "node-telegram-bot-api";
import { User, UserInstance } from "../models/user";
import { Limit, LimitInstance } from "../models/limit";
import {
  UserContext,
  bankMenuKeyboard,
  bankOperations,
} from "../mainHandlers/listButtons";
import { ignoreListButton } from "../mainHandlers/listButtons";

export function updateBankMenu(
  chatId: number,
  messageId: number | undefined,
  bot: TelegramBot,
  userContext: UserContext
) {
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: bankMenuKeyboard,
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
  } else {
    bot.editMessageText("Виберіть банк:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboardMarkup,
    });
  }
}

export function setLimit(chatId: number, messageId: number, bot: TelegramBot) {
  bot
    .sendMessage(chatId, "Будь ласка, введіть новий ліміт:")
    .then((sentMessage) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMessage.message_id);
      }, 5000);
    });
}

export async function addLimitToDB(
  msg: Message,
  userContext: UserContext,
  bot: TelegramBot
) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const username = msg.chat.username;
  const bankName = userContext[chatId].bankName;
  const messageId = userContext[chatId].messageId;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: bankOperations,
  };
  try {
    if (text && ignoreListButton?.includes(text)) {
      userContext[chatId].isSettingLimit = false;
      return;
    } else if (text === undefined) {
      bot.sendMessage(
        chatId,
        "Вибачте, я приймаю тільки текстові повідомлення."
      );
      return;
    } else {
      const number = parseFloat(text);
      if (isNaN(number)) {
        bot.sendMessage(chatId, "Будь ласка, введіть число.");
      } else {
        const user = (await User.findOne({
          where: { username },
        })) as UserInstance | null;

        if (user) {
          const limit = (await Limit.findOne({
            where: {
              userId: user.id,
              username: username,
              bankName: bankName,
            },
          })) as LimitInstance | null;

          userContext[chatId].currentBalance = limit?.account_balance;
          if (limit) {
            await Limit.update(
              { limit_balance: text },
              {
                where: {
                  userId: user.id,
                  username: username,
                  bankName: bankName,
                },
              }
            );
          } else {
            const limit = (await Limit.create({
              userId: user.id,
              username: username,
              bankName: bankName,
              limit_balance: text,
              account_balance: 0,
            })) as LimitInstance | null;
            userContext[chatId].currentBalance = limit?.account_balance;
          }

          bot.editMessageText(
            `Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${text}грн.\nВаш поточний баланс карти: ${userContext[chatId].currentBalance} грн.`,
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: keyboardMarkup,
            }
          );
        } else {
          bot.sendMessage(chatId, "Користувач не знайдений у базі даних.");
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}
