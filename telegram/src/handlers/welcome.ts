import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { welcomeEn, welcomeTr } from '../content/welcome';
import { isCasBanned } from '../services/moderation';
import { isTrChat } from '../utils/lang';
import { log } from '../utils/logger';

export function attachWelcome(bot: TelegramBot) {
  bot.on('new_chat_members', async (msg) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members ?? [];
    const tr = isTrChat(chatId, config.trGroupChatId);

    for (const member of newMembers) {
      if (member.is_bot) continue;

      // CAS ban check — kick if flagged
      const casBanned = await isCasBanned(member.id);
      if (casBanned) {
        try {
          await bot.banChatMember(chatId, member.id);
          await bot.unbanChatMember(chatId, member.id); // unban so they can rejoin if false positive
          log.info('CAS banned member kicked', { chatId, userId: member.id });
        } catch (e) {
          log.warn('CAS kick failed', { e: String(e) });
        }
        continue;
      }

      const name = member.first_name || member.username || 'human';
      const greeting = tr
        ? `👋 hoş geldin ${name}\n\n`
        : `👋 welcome ${name}\n\n`;
      const body = tr ? welcomeTr() : welcomeEn();
      try {
        await bot.sendMessage(chatId, greeting + body, {
          disable_web_page_preview: true,
        });
      } catch (e) {
        log.warn('welcome send failed', { e: String(e) });
      }
    }
  });
}
