import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { log } from '../utils/logger';

export function isAdmin(userId: number | undefined): boolean {
  if (!userId) return false;
  return config.adminUserIds.includes(userId);
}

export async function handleAnnounce(bot: TelegramBot, msg: TelegramBot.Message, text: string) {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '🚫 Admin only.');
    return;
  }
  if (!text.trim()) {
    await bot.sendMessage(chatId, 'Usage: /announce <message>');
    return;
  }
  if (!config.newsChannelChatId) {
    await bot.sendMessage(chatId, '🚫 NEWS_CHANNEL_CHAT_ID not configured.');
    return;
  }

  try {
    await bot.sendMessage(config.newsChannelChatId, text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
    await bot.sendMessage(chatId, '📡 Posted to news channel.');
  } catch (e) {
    log.error('handleAnnounce failed', { e: String(e) });
    await bot.sendMessage(chatId, `🚫 Failed: ${String(e)}`);
  }
}
