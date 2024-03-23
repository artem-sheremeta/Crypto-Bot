import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
} from "node-telegram-bot-api";
import { Deposit, DepositInstance } from "../models/deposit";
import { User, UserInstance } from "../models/user";
import { Limit, LimitInstance } from "../models/limit";
import { Transfer, TransferInstance } from "../models/transfer";
import { UserContext, bankOperations } from "../mainHandlers/listButtons";
import { ignoreListButton } from "../mainHandlers/listButtons";

export async function addDepositToDB(
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
      userContext[chatId].isDeposit = false;
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

          if (limit) {
            const newLimitBalance = limit.limit_balance - Number(text);
            const newAccountBalance =
              Number(limit.account_balance) + (text ? parseInt(text) : 0);
            await Limit.update(
              {
                limit_balance: newLimitBalance,
                account_balance: newAccountBalance,
              },
              {
                where: {
                  userId: user.id,
                  username: username,
                  bankName: bankName,
                },
              }
            );
            await Deposit.create({
              userId: user.id,
              username: username,
              bankName: bankName,
              deposit: text,
              limit_balance: newLimitBalance,
              account_balance: text,
            });

            bot.editMessageText(
              `Ви обрали банк ${bankName}. Оберіть опцію: \nВаш поточний ліміт: ${newLimitBalance}грн.\nВаш поточний баланс карти: ${newAccountBalance} грн.`,
              {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: keyboardMarkup,
              }
            );
          }
        } else {
          bot.sendMessage(chatId, "Користувач не знайдений у базі даних.");
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function setDeposit(
  chatId: number,
  messageId: number,
  bot: TelegramBot
) {
  bot
    .sendMessage(chatId, "Будь ласка, введіть суму поповнення:")
    .then((sentMessage) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMessage.message_id);
      }, 5000);
    });
}

export async function getListTransactions(
  chatId: number,
  username: string,
  userContext: UserContext,
  bot: TelegramBot
) {
  const bankName = userContext[chatId].bankName;

  try {
    const user = (await User.findOne({
      where: { username },
    })) as UserInstance | null;

    if (user) {
      const transactions = (await Deposit.findAll({
        where: {
          userId: user.id,
          bankName: bankName,
        },
        order: [["createdAt", "DESC"]],
      })) as DepositInstance[];

      const transfers = (await Transfer.findAll({
        where: {
          userId: user.id,
          bankName: bankName,
        },
        order: [["createdAt", "DESC"]],
      })) as TransferInstance[];

      let messageText = `Історія транзакцій для банку ${bankName}:\n`;
      transactions.forEach((transaction) => {
        const formattedDate = transaction.createdAt.toLocaleString();
        messageText += `${formattedDate} - Поповнення: ${transaction.deposit} грн\n`;
      });

      transfers.forEach((transfer) => {
        const formattedDate = transfer.createdAt.toLocaleString();
        messageText += `${formattedDate} - Переказ: ${transfer.transfer} грн\n`;
      });

      bot.sendMessage(chatId, messageText, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(chatId, "Користувач не знайдений у базі даних.");
    }
  } catch (error) {
    console.error(error);
  }
}
