import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';

let cached: TelegramBot | null = null;
let cachedBotInfo: { id: number; username: string } | null = null;

export function getBot(): TelegramBot {
  if (cached) return cached;
  cached = new TelegramBot(config.botToken);
  return cached;
}

export async function getBotInfo(bot: TelegramBot): Promise<{ id: number; username: string }> {
  if (cachedBotInfo) return cachedBotInfo;
  if (config.botUsername) {
    // we still need id for reply detection — fetch once, cache for the lifetime of this function instance
    const me = await bot.getMe();
    cachedBotInfo = { id: me.id, username: me.username ?? config.botUsername.replace(/^@/, '') };
    return cachedBotInfo;
  }
  const me = await bot.getMe();
  cachedBotInfo = { id: me.id, username: me.username ?? '' };
  return cachedBotInfo;
}
