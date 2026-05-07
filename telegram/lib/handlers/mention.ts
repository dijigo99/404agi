import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { askGemini } from '../services/gemini';
import { checkAndConsume } from '../services/rateLimit';
import { detectLang, isTrChat, type Lang } from '../utils/lang';
import { log } from '../utils/logger';
import { truncate } from '../utils/format';

const MAX_PROMPT_LEN = 500;

function isMentionForBot(text: string, botUsernameLower: string): boolean {
  if (!text || !botUsernameLower) return false;
  return text.toLowerCase().includes(botUsernameLower);
}

function isReplyToBot(msg: TelegramBot.Message, botId: number): boolean {
  if (!msg.reply_to_message?.from) return false;
  return msg.reply_to_message.from.id === botId;
}

export async function tryHandleMention(
  bot: TelegramBot,
  msg: TelegramBot.Message,
  botInfo: { id: number; username: string },
): Promise<boolean> {
  if (msg.chat.type === 'private') return false;
  if (!msg.from || msg.from.is_bot) return false;
  const text = msg.text ?? msg.caption ?? '';
  if (!text) return false;
  if (text.startsWith('/')) return false;

  const botUsernameLower = botInfo.username ? `@${botInfo.username.toLowerCase()}` : '';
  const mentioned = isMentionForBot(text, botUsernameLower);
  const replied = isReplyToBot(msg, botInfo.id);
  if (!mentioned && !replied) return false;

  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const chatLang: Lang = isTrChat(chatId, config.trGroupChatId) ? 'tr' : 'en';

  const cleaned = botUsernameLower
    ? text.replace(new RegExp(botUsernameLower, 'gi'), '').trim()
    : text.trim();
  if (!cleaned) return true;

  const rl = await checkAndConsume(userId, config.askRateLimitPerHour);
  if (!rl.allowed) {
    const mins = Math.ceil(rl.resetInSec / 60);
    await bot.sendMessage(
      chatId,
      chatLang === 'tr'
        ? `🛑 Saatlik soru limitin doldu. ${mins}dk sonra.`
        : `🛑 Hourly limit reached. Try again in ${mins}min.`,
      { reply_to_message_id: msg.message_id },
    );
    return true;
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
  return true;
}
