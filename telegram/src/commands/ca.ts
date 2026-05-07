import TelegramBot from 'node-telegram-bot-api';
import { config, TOKEN_TICKER } from '../config';
import { isTrChat } from '../utils/lang';

export async function handleCa(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const tr = isTrChat(chatId, config.trGroupChatId);

  if (!config.contractAddress) {
    const text = tr
      ? `⏳ ${TOKEN_TICKER} kontrat adresi launch sonrası burada olur.`
      : `⏳ ${TOKEN_TICKER} contract address arrives post-launch.`;
    await bot.sendMessage(chatId, text);
    return;
  }
  const text = tr
    ? `🔢 ${TOKEN_TICKER} CA:\n\`${config.contractAddress}\`\n\n(Solana, dokunarak kopyala)`
    : `🔢 ${TOKEN_TICKER} CA:\n\`${config.contractAddress}\`\n\n(Solana, tap to copy)`;
  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}
