import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { welcomeEn, welcomeTr } from '../content/welcome';
import { isCasBanned } from '../services/moderation';
import { isTrChat } from '../utils/lang';
import { log } from '../utils/logger';

export async function handleNewMembers(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
  const newMembers = msg.new_chat_members ?? [];
  if (newMembers.length === 0) return;

  const chatId = msg.chat.id;
  const tr = isTrChat(chatId, config.trGroupChatId);

  for (const member of newMembers) {
    if (member.is_bot) continue;

    const casBanned = await isCasBanned(member.id);
    if (casBanned) {
      try {
        await bot.banChatMember(chatId, member.id);
        await bot.unbanChatMember(chatId, member.id);
        log.info('CAS banned member kicked', { chatId, userId: member.id });
      } catch (e) {
        log.warn('CAS kick failed', { e: String(e) });
      }
      continue;
    }

    const name = member.first_name || member.username || 'human';
    const greeting = tr ? `👋 hoş geldin ${name}\n\n` : `👋 welcome ${name}\n\n`;
    const body = tr ? welcomeTr() : welcomeEn();
    try {
      await bot.sendMessage(chatId, greeting + body, {
        disable_web_page_preview: true,
      });
    } catch (e) {
      log.warn('welcome send failed', { e: String(e) });
    }
  }
}
