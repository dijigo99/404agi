import TelegramBot from 'node-telegram-bot-api';
import { config, TOKEN_TICKER } from '../config';
import { dexscreenerUrl } from '../services/dexscreener';
import { isTrChat } from '../utils/lang';

export async function handleChart(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const tr = isTrChat(chatId, config.trGroupChatId);

  if (!config.contractAddress) {
    const text = tr ? `⏳ Launch sonrası grafik linki burada olur.` : `⏳ Chart link arrives after launch.`;
    await bot.sendMessage(chatId, text);
    return;
  }
  const url = dexscreenerUrl(config.contractAddress);
  const text = tr ? `📈 ${TOKEN_TICKER} grafik:\n${url}` : `📈 ${TOKEN_TICKER} chart:\n${url}`;
  await bot.sendMessage(chatId, text);
}
