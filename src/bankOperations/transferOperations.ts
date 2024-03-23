import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
} from "node-telegram-bot-api";
import { Transfer, TransferInstance } from "../models/transfer";
import { User, UserInstance } from "../models/user";
import { UserContext, bankOperations } from "../mainHandlers/listButtons";
import { Limit, LimitInstance } from "../models/limit";
import { ignoreListButton } from "../mainHandlers/listButtons";

export async function addTransferToDB(
  msg: Message,
  userContext: UserContext,
  bot: TelegramBot
) {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const text = msg.text;
  const bankName = userContext[chatId].bankName;
  const messageId = userContext[chatId].messageId;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: bankOperations,
  };

  try {
    if (text && ignoreListButton?.includes(text)) {
      userContext[chatId].isTransfer = false;
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

        const limit = (await Limit.findOne({
          where: { username: username, bankName: bankName },
        })) as LimitInstance | null;
        const currentBalance = Number(limit?.account_balance);
        const transferAmount = Number(text);
        if (currentBalance < transferAmount) {
          const amountDifference = transferAmount - currentBalance;
          bot
            .sendMessage(
              chatId,
              `На вашому рахунку недостатньо ${amountDifference} грн. для виконання переказу коштів!`
            )
            .then((sentMessage) => {
              setTimeout(() => {
                bot.deleteMessage(chatId, sentMessage.message_id);
              }, 5000);
            });
        } else if (user) {
          (await Transfer.create({
            userId: user.id,
            username: username,
            bankName: bankName,
            transfer: transferAmount,
          })) as TransferInstance | null;

          const accountBalance = currentBalance - transferAmount;
          await Limit.update(
            {
              account_balance: accountBalance,
            },
            {
              where: {
                userId: user.id,
                username: username,
                bankName: bankName,
              },
            }
          );
          bot.editMessageText(
            `Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${limit?.limit_balance}грн.\nВаш поточний баланс карти: ${accountBalance} грн.`,
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

export function setTransfer(
  chatId: number,
  messageId: number,
  bot: TelegramBot
) {
  bot
    .sendMessage(chatId, "Будь ласка, введіть суму переказу:")
    .then((sentMessage) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMessage.message_id);
      }, 5000);
    });
}
