import TelegramBot from 'node-telegram-bot-api';
import { checkMessage } from '../services/moderation';
import { isAdmin } from '../commands/announce';
import { log } from '../utils/logger';

export async function runModeration(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
  if (msg.chat.type === 'private') return;
  if (!msg.from || msg.from.is_bot) return;
  if (isAdmin(msg.from.id)) return;

  const text = msg.text ?? msg.caption ?? '';
  if (!text) return;

  const result = await checkMessage(msg.from.id, text);
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
}
