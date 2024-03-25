import { Message } from "node-telegram-bot-api";
import {
  clickStart,
  clickMenu,
  menuBank,
} from "../src/mainHandlers/buttonHandlers";
import { User } from "../src/models/user";
import { Limit } from "../src/models/limit";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../src/models/user", () => ({
  User: {
    findOne: jest.fn<Promise<typeof User | null>, [any]>(),
    create: jest.fn<Promise<typeof User>, [any]>(),
  },
}));

jest.mock("../src/models/limit", () => ({
  Limit: {
    findOne: jest.fn<Promise<typeof Limit | null>, [any]>(),
  },
}));

describe("clickStart function", () => {
  it("should send a welcome message and create a new user if not exists", async () => {
    const bot = {
      sendMessage: jest.fn(),
    } as any;

    const msg: Message = {
      chat: { id: 1, username: "testuser", first_name: "Test" },
    } as any;

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({});

    await clickStart(msg, bot, {});

    expect(User.create).toHaveBeenCalledWith({
      name: "Test",
      username: "testuser",
    });

    expect(bot.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining("Вітаємо"),
      expect.objectContaining({
        parse_mode: "HTML",
        reply_markup: expect.objectContaining({
          resize_keyboard: true,
          keyboard: expect.any(Array),
        }),
      })
    );
  });

  it("should send a welcome message without creating a new user if exists", async () => {
    const bot = {
      sendMessage: jest.fn(),
    } as any;

    const msg: Message = {
      chat: { id: 1, username: "existinguser", first_name: "Existing" },
    } as any;

    (User.findOne as jest.Mock).mockResolvedValue({ username: "existinguser" });

    await clickStart(msg, bot, {});

    expect(User.create).not.toHaveBeenCalled();
    expect(bot.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining("Вітаємо"),
      expect.objectContaining({
        parse_mode: "HTML",
        reply_markup: expect.objectContaining({
          resize_keyboard: true,
          keyboard: expect.any(Array),
        }),
      })
    );
  });
});

describe("clickMenu function", () => {
  it("should send a message with the main menu keyboard", () => {
    const bot = {
      sendMessage: jest.fn(),
    } as any;

    const msg: Message = {
      chat: { id: 1 },
    } as any;

    clickMenu(msg, bot, {});
    expect(bot.sendMessage).toHaveBeenCalledWith(
      1,
      "Ви в головному меню ⏯",
      expect.objectContaining({
        reply_markup: expect.objectContaining({
          resize_keyboard: true,
          keyboard: expect.any(Array),
        }),
      })
    );
  });
});

describe("menuBank function", () => {
  it("should send an error message for and invalid bank name", async () => {
    const bot = {
      sendMessage: jest.fn(),
      editMessageText: jest.fn(),
    } as any;

    const chatId = 1;
    const messageId = 2;
    const invalidBankName = "unknownbank";
    const username = "testuser";

    await menuBank(chatId, messageId, bot, invalidBankName, {}, username);

    expect(bot.sendMessage).toHaveBeenCalledWith(
      chatId,
      "Не вдалося знайти відповідний банк."
    );

    expect(bot.editMessageText).not.toHaveBeenCalled();
  });

  it("should send a message with bank options", async () => {
    const bot = {
      sendMessage: jest.fn(),
      editMessageText: jest.fn(),
    } as any;

    const chatId = 1;
    const messageId = 2;
    const bankName = "monobank";
    const username = "testuser";

    (Limit.findOne as jest.Mock).mockResolvedValue({
      account_balance: 100,
      limit_balance: 500,
    });

    await menuBank(chatId, messageId, bot, bankName, {}, username);
    expect(bot.editMessageText).toHaveBeenCalledWith(
      expect.stringContaining(`Ви обрали банк ${bankName}. Оберіть опцію:`),
      expect.objectContaining({
        chat_id: chatId,
        message_id: messageId,
        reply_markup: expect.any(Object),
      })
    );
  });
});
