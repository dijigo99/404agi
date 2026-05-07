import TelegramBot from 'node-telegram-bot-api';
import { config, TOKEN_TICKER } from '../config';
import { jupiterSwapUrl } from '../services/dexscreener';
import { isTrChat } from '../utils/lang';

export async function handleBuy(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const tr = isTrChat(chatId, config.trGroupChatId);

  if (!config.contractAddress) {
    const text = tr
      ? `⏳ ${TOKEN_TICKER} henüz launch olmadı. Buy linki launch sonrası burada.`
      : `⏳ ${TOKEN_TICKER} not launched. Buy link will appear post-launch.`;
    await bot.sendMessage(chatId, text);
    return;
  }
  const url = jupiterSwapUrl(config.contractAddress);
  const text = tr
    ? `🛒 ${TOKEN_TICKER} al (Jupiter):\n${url}\n\nveya pump.fun: https://pump.fun/coin/${config.contractAddress}`
    : `🛒 Buy ${TOKEN_TICKER} on Jupiter:\n${url}\n\nor pump.fun: https://pump.fun/coin/${config.contractAddress}`;
  await bot.sendMessage(chatId, text, { disable_web_page_preview: true });
}
