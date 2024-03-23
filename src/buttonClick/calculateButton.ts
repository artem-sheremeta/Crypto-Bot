import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
} from "node-telegram-bot-api";
import { UserContext, calculateOperations } from "../mainHandlers/listButtons";
import { Calculate, CalculateInstance } from "../models/calculate";
import { User, UserInstance } from "../models/user";
import { ignoreListButton } from "../mainHandlers/listButtons";

export function sendQuestion(
  chatId: number,
  messageId: number,
  bot: TelegramBot,
  userContext: UserContext,
  text: string
) {
  userContext[chatId].messageId = messageId;
  bot.sendMessage(chatId, `${text}`).then((sentMessage) => {
    setTimeout(() => {
      bot.deleteMessage(chatId, sentMessage.message_id);
    }, 5000);
  });
}

export async function menuCalculator(
  msg: Message,
  bot: TelegramBot,
  userContext: UserContext
) {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  if (!userContext[chatId]) {
    userContext[chatId] = {};
  }
  userContext[chatId].messageId = msg.message_id;
  try {
    const user = (await User.findOne({
      where: { username },
    })) as UserInstance | null;
    if (user) {
      const calculate = (await Calculate.findOne({
        where: {
          userId: user.id,
          username: username,
        },
      })) as CalculateInstance | null;
      if (calculate) {
        bot.sendMessage(
          chatId,
          `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`,
          {
            reply_markup: keyboardMarkup,
          }
        );
      } else {
        const calculate = (await Calculate.create({
          userId: user.id,
          username: username,
          sum_buy: 0,
          course_buy: 0,
          course_sell: 0,
          get_currency: 0,
          commission: 0,
          profit: 0,
          expense_limit: 0,
        })) as CalculateInstance;

        bot.sendMessage(
          chatId,
          `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`,
          {
            reply_markup: keyboardMarkup,
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function sumBuy(
  msg: Message,
  userContext: UserContext,
  bot: TelegramBot,
  username: any
) {
  const chatId = msg.chat.id;
  const messageId = userContext[chatId].messageId;
  const text = msg.text;
  userContext[chatId].sumBuy = msg.text;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  try {
    if (text && ignoreListButton?.includes(text)) {
      userContext[chatId].isSumBuy = false;
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
        const calculate = (await Calculate.findOne({
          where: { username: username },
        })) as CalculateInstance;
        let getCurrency = (Number(msg.text) / calculate?.course_buy).toFixed(2);
        if (getCurrency == "Infinity") getCurrency = "0";
        if (calculate) {
          await Calculate.update(
            { sum_buy: text, get_currency: getCurrency },
            {
              where: {
                username: username,
              },
            }
          );
          bot.editMessageText(
            `Купуєте USDT 💵 на: ${text}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${getCurrency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`,
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: keyboardMarkup,
            }
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function courseBuy(
  msg: Message,
  userContext: UserContext,
  bot: TelegramBot,
  username: any
) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const messageId = userContext[chatId].messageId;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  try {
    if (text && ignoreListButton?.includes(text)) {
      userContext[chatId].isCourseBuy = false;
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
        const calculate = (await Calculate.findOne({
          where: { username: username },
        })) as CalculateInstance;
        const getCurrency = (calculate?.sum_buy / Number(msg.text)).toFixed(2);
        if (calculate) {
          await Calculate.update(
            { course_buy: text, get_currency: getCurrency },
            {
              where: {
                username: username,
              },
            }
          );
          bot.editMessageText(
            `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${text}\nВи отримаєте USDT: ${getCurrency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`,
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: keyboardMarkup,
            }
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function courseSell(
  msg: Message,
  userContext: UserContext,
  bot: TelegramBot,
  username: any
) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const messageId = userContext[chatId].messageId;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  try {
    if (text && ignoreListButton?.includes(text)) {
      userContext[chatId].isCourseSell = false;
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
        const calculate = (await Calculate.findOne({
          where: { username: username },
        })) as CalculateInstance | null;
        if (calculate) {
          await Calculate.update(
            { course_sell: text },
            {
              where: {
                username: username,
              },
            }
          );
          bot.editMessageText(
            `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${text}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`,
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: keyboardMarkup,
            }
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function commission(
  msg: Message,
  userContext: UserContext,
  bot: TelegramBot,
  username: any
) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const messageId = userContext[chatId].messageId;
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  try {
    if (text && ignoreListButton?.includes(text)) {
      userContext[chatId].isCommission = false;
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
        const calculate = (await Calculate.findOne({
          where: { username: username },
        })) as CalculateInstance | null;
        if (calculate) {
          await Calculate.update(
            { commission: text },
            {
              where: {
                username: username,
              },
            }
          );
          bot.editMessageText(
            `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${text}\nВитрата ліміту по банку: ${calculate.expense_limit}\nВаш чистий дохід складає 💳: ${calculate.profit}`,
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: keyboardMarkup,
            }
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function calculateProfit(
  chatId: number,
  bot: TelegramBot,
  userContext: UserContext,
  username: any
) {
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  try {
    const calculate = (await Calculate.findOne({
      where: { username: username },
    })) as CalculateInstance;

    const getProfit = (
      (calculate?.course_sell - calculate?.course_buy) *
        calculate?.get_currency -
      calculate?.commission * calculate?.course_buy
    ).toFixed(2);

    const getLimit = Number(calculate?.sum_buy * 2 + Number(getProfit)).toFixed(
      2
    );
    if (calculate) {
      await Calculate.update(
        { profit: getProfit, expense_limit: getLimit },
        {
          where: {
            username: username,
          },
        }
      );
      bot.sendMessage(
        chatId,
        `Купуєте USDT 💵 на: ${calculate.sum_buy}\nКурс купівлі: ${calculate.course_buy}\nВи отримаєте USDT: ${calculate.get_currency}\nКурс продажу 💥: ${calculate.course_sell}\nКомісія ( в USDT) : ${calculate.commission}\nВитрата ліміту по банку: ${getLimit}\nВаш чистий дохід складає 💳: ${getProfit}`,

        {
          reply_markup: keyboardMarkup,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateCalculate(
  chatId: number,
  messageId: number,
  bot: TelegramBot,
  username: any
) {
  const keyboardMarkup: InlineKeyboardMarkup = {
    inline_keyboard: calculateOperations,
  };
  try {
    await Calculate.update(
      {
        sum_buy: 0,
        course_buy: 0,
        course_sell: 0,
        get_currency: 0,
        commission: 0,
        profit: 0,
        expense_limit: 0,
      },
      { where: { username: username } }
    );
    bot.editMessageText(
      `Купуєте USDT 💵 на: 0\nКурс купівлі: 0\nВи отримаєте USDT: 0\nКурс продажу 💥: 0\nКомісія ( в USDT) : 0\nВитрата ліміту по банку: 0\nВаш чистий дохід складає 💳: 0`,

      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboardMarkup,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
