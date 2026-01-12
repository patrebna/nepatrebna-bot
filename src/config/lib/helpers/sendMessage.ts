import { bot } from "bot";
import type TelegramBot from "node-telegram-bot-api";
import {
  type ReplyKeyboardMarkup,
  type InlineKeyboardMarkup,
  type ForceReply,
} from "node-telegram-bot-api";

export async function sendMessage(
  id: number,
  message: string,
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ForceReply,
): Promise<TelegramBot.Message | undefined> {
  try {
    return await bot.sendMessage(id, message, {
      reply_markup,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
  }
}
