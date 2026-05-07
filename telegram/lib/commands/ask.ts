import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { askGemini } from '../services/gemini';
import { checkAndConsume } from '../services/rateLimit';
import { detectLang, isTrChat, type Lang } from '../utils/lang';
import { truncate } from '../utils/format';
import { log } from '../utils/logger';

const MAX_PROMPT_LEN = 500;

export async function handleAsk(bot: TelegramBot, msg: TelegramBot.Message, prompt: string) {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  const chatLang: Lang = isTrChat(chatId, config.trGroupChatId) ? 'tr' : 'en';

  if (!userId) return;

  if (!prompt.trim()) {
    const text =
      chatLang === 'tr'
        ? `Kullanım: /sor <soru>\nÖrnek: /sor neden 404 oldun`
        : `Usage: /ask <question>\nExample: /ask why did you 404`;
    await bot.sendMessage(chatId, text);
    return;
  }

  const rl = await checkAndConsume(userId, config.askRateLimitPerHour);
  if (!rl.allowed) {
    const mins = Math.ceil(rl.resetInSec / 60);
    const text =
      chatLang === 'tr'
        ? `🛑 Saatlik soru limitin doldu (${config.askRateLimitPerHour}/saat). ${mins}dk sonra tekrar dene.`
        : `🛑 Hourly limit reached (${config.askRateLimitPerHour}/hr). Try again in ${mins}min.`;
    await bot.sendMessage(chatId, text);
    return;
  }

  const cleaned = truncate(prompt.trim(), MAX_PROMPT_LEN);
  const replyLang: Lang = chatLang === 'tr' ? 'tr' : detectLang(cleaned);

  await bot.sendChatAction(chatId, 'typing').catch(() => undefined);

  try {
    const answer = await askGemini(cleaned, replyLang);
    await bot.sendMessage(chatId, answer, {
      reply_to_message_id: msg.message_id,
      disable_web_page_preview: true,
    });
  } catch (e) {
    log.error('handleAsk failed', { e: String(e) });
    await bot.sendMessage(
      chatId,
      replyLang === 'tr' ? '> error: cevap alınamadı.' : '> error: could not generate.',
    );
  }
}
