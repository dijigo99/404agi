import TelegramBot from 'node-telegram-bot-api';
import { config, TOKEN_NAME, TOKEN_TICKER } from '../config';
import { getPriceSnapshot, jupiterSwapUrl } from '../services/dexscreener';
import { formatPct, formatUsd } from '../utils/format';
import { isTrChat, type Lang } from '../utils/lang';
import { log } from '../utils/logger';

export async function handlePrice(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const lang: Lang = isTrChat(chatId, config.trGroupChatId) ? 'tr' : 'en';

  if (!config.contractAddress) {
    const text =
      lang === 'tr'
        ? `⏳ ${TOKEN_TICKER} henüz launch olmadı. CA pre-launch'tan sonra eklenecek.\n\nLaunch: ${config.siteUrl}`
        : `⏳ ${TOKEN_TICKER} not launched yet. CA will be set after pre-launch.\n\nLaunch: ${config.siteUrl}`;
    await bot.sendMessage(chatId, text, { disable_web_page_preview: true });
    return;
  }

  try {
    const snap = await getPriceSnapshot(config.contractAddress);
    if (!snap) {
      const text =
        lang === 'tr'
          ? `🔍 Henüz Dexscreener'da pair yok. Birazdan tekrar dene.`
          : `🔍 No pair on Dexscreener yet. Try again shortly.`;
      await bot.sendMessage(chatId, text);
      return;
    }
    const lines =
      lang === 'tr'
        ? [
            `*${TOKEN_NAME} ${TOKEN_TICKER}*`,
            ``,
            `💰 Fiyat: \`${formatUsd(snap.priceUsd)}\``,
            `📊 MC: \`${formatUsd(snap.marketCap)}\``,
            `💧 Likidite: \`${formatUsd(snap.liquidityUsd)}\``,
            `📈 24h Vol: \`${formatUsd(snap.volume24h)}\``,
            `⏱ 1h: ${formatPct(snap.change1h)}`,
            `⏱ 24h: ${formatPct(snap.change24h)}`,
            ``,
            `[grafik](${snap.url}) · [al](${jupiterSwapUrl(config.contractAddress)})`,
          ]
        : [
            `*${TOKEN_NAME} ${TOKEN_TICKER}*`,
            ``,
            `💰 Price: \`${formatUsd(snap.priceUsd)}\``,
            `📊 MC: \`${formatUsd(snap.marketCap)}\``,
            `💧 Liquidity: \`${formatUsd(snap.liquidityUsd)}\``,
            `📈 24h Vol: \`${formatUsd(snap.volume24h)}\``,
            `⏱ 1h: ${formatPct(snap.change1h)}`,
            `⏱ 24h: ${formatPct(snap.change24h)}`,
            ``,
            `[chart](${snap.url}) · [buy](${jupiterSwapUrl(config.contractAddress)})`,
          ];
    await bot.sendMessage(chatId, lines.join('\n'), {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (e) {
    log.error('handlePrice failed', { e: String(e) });
    await bot.sendMessage(
      chatId,
      lang === 'tr' ? '> error: fiyat alınamadı.' : '> error: could not fetch price.',
    );
  }
}
