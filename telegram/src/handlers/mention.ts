import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { askGemini } from '../services/gemini';
import { checkAndConsume } from '../services/rateLimit';
import { detectLang, isTrChat, type Lang } from '../utils/lang';
import { log } from '../utils/logger';
import { truncate } from '../utils/format';

let botUsernameLower = '';

export function setBotUsername(username: string) {
  botUsernameLower = `@${username.toLowerCase()}`;
}

const MAX_PROMPT_LEN = 500;

function isMentionForBot(text: string): boolean {
  if (!text || !botUsernameLower) return false;
  return text.toLowerCase().includes(botUsernameLower);
}

function isReplyToBot(msg: TelegramBot.Message, botId?: number): boolean {
  if (!botId || !msg.reply_to_message?.from) return false;
  return msg.reply_to_message.from.id === botId;
}

export function attachMentionHandler(bot: TelegramBot, botId: number) {
  bot.on('message', async (msg) => {
    if (msg.chat.type === 'private') return;
    if (!msg.from || msg.from.is_bot) return;
    const text = msg.text ?? msg.caption ?? '';
    if (!text) return;

    // skip command messages — those are handled by command handlers
    if (text.startsWith('/')) return;

    const mentioned = isMentionForBot(text);
    const replied = isReplyToBot(msg, botId);
    if (!mentioned && !replied) return;

    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const chatLang: Lang = isTrChat(chatId, config.trGroupChatId) ? 'tr' : 'en';

    // strip mention from text
    const cleaned = text
      .replace(new RegExp(botUsernameLower, 'gi'), '')
      .trim();
    if (!cleaned) return;

    const rl = checkAndConsume(userId, config.askRateLimitPerHour);
    if (!rl.allowed) {
      const mins = Math.ceil(rl.resetInSec / 60);
      await bot.sendMessage(
        chatId,
        chatLang === 'tr'
          ? `🛑 Saatlik soru limitin doldu. ${mins}dk sonra.`
          : `🛑 Hourly limit reached. Try again in ${mins}min.`,
        { reply_to_message_id: msg.message_id },
      );
      return;
    }

    const replyLang: Lang = chatLang === 'tr' ? 'tr' : detectLang(cleaned);
    await bot.sendChatAction(chatId, 'typing').catch(() => undefined);

    try {
      const answer = await askGemini(truncate(cleaned, MAX_PROMPT_LEN), replyLang);
      await bot.sendMessage(chatId, answer, {
        reply_to_message_id: msg.message_id,
        disable_web_page_preview: true,
      });
    } catch (e) {
      log.error('mention reply failed', { e: String(e) });
    }
  });
}
