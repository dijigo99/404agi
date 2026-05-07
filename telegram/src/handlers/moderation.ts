import TelegramBot from 'node-telegram-bot-api';
import { checkMessage } from '../services/moderation';
import { log } from '../utils/logger';
import { isAdmin } from '../commands/announce';

export function attachModeration(bot: TelegramBot) {
  bot.on('message', async (msg) => {
    // skip private chats and channel posts
    if (msg.chat.type === 'private') return;
    if (!msg.from || msg.from.is_bot) return;
    if (isAdmin(msg.from.id)) return; // admins exempt

    const text = msg.text ?? msg.caption ?? '';
    if (!text) return;

    const result = checkMessage(msg.from.id, text);
    if (!result.flagged) return;

    log.info('moderation flagged', {
      chatId: msg.chat.id,
      userId: msg.from.id,
      reason: result.reason,
    });

    if (result.delete) {
      try {
        await bot.deleteMessage(msg.chat.id, msg.message_id);
      } catch (e) {
        log.warn('delete failed', { e: String(e) });
      }
    }
  });
}
