import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { helpEn, helpTr } from '../content/help';
import { isTrChat } from '../utils/lang';

export async function handleHelp(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const text = isTrChat(chatId, config.trGroupChatId) ? helpTr() : helpEn();
  await bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
}
