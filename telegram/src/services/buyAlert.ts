import TelegramBot from 'node-telegram-bot-api';
import { config, TOKEN_TICKER } from '../config';
import { dexscreenerUrl, fetchPairsByToken, jupiterSwapUrl } from './dexscreener';
import { log } from '../utils/logger';
import { formatUsd } from '../utils/format';

interface PairState {
  pairAddress: string;
  lastBuyCount: number;
  lastH1Volume: number;
  lastChecked: number;
}

const stateByPair = new Map<string, PairState>();
let timer: NodeJS.Timeout | null = null;

export function startBuyAlert(bot: TelegramBot) {
  if (!config.contractAddress) {
    log.warn('buyAlert disabled — no CONTRACT_ADDRESS');
    return;
  }
  if (!config.mainGroupChatId) {
    log.warn('buyAlert disabled — no MAIN_GROUP_CHAT_ID');
    return;
  }
  if (timer) return;
  log.info('buyAlert started', {
    pollMs: config.buyAlertPollMs,
    minUsd: config.buyAlertMinUsd,
  });
  // run once after a short delay so existing state is captured
  setTimeout(() => void tick(bot), 5_000);
  timer = setInterval(() => void tick(bot), config.buyAlertPollMs);
  timer.unref?.();
}

export function stopBuyAlert() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

async function tick(bot: TelegramBot) {
  try {
    const pairs = await fetchPairsByToken(config.contractAddress);
    const solPairs = pairs.filter((p) => p.chainId === 'solana');
    if (solPairs.length === 0) return;

    for (const pair of solPairs) {
      const prev = stateByPair.get(pair.pairAddress);
      const buyCount = pair.txns?.h1?.buys ?? 0;
      const h1Vol = pair.volume?.h1 ?? 0;
      const priceUsd = Number.parseFloat(pair.priceUsd ?? '0');

      // first observation — just record
      if (!prev) {
        stateByPair.set(pair.pairAddress, {
          pairAddress: pair.pairAddress,
          lastBuyCount: buyCount,
          lastH1Volume: h1Vol,
          lastChecked: Date.now(),
        });
        continue;
      }

      const newBuys = Math.max(0, buyCount - prev.lastBuyCount);
      const newVolume = Math.max(0, h1Vol - prev.lastH1Volume);

      // approximate per-buy USD value (volume includes sells, so this is a floor)
      const avgPerBuy = newBuys > 0 ? newVolume / newBuys / 2 : 0;

      // alert when avg per buy >= threshold AND there is at least one new buy
      if (newBuys >= 1 && avgPerBuy >= config.buyAlertMinUsd) {
        const change24h = pair.priceChange?.h24 ?? 0;
        const mc = pair.marketCap ?? pair.fdv ?? 0;
        const text = formatBuyAlert({
          totalNewBuys: newBuys,
          approxUsd: avgPerBuy,
          priceUsd,
          marketCap: mc,
          change24h,
          chartUrl: pair.url,
          buyUrl: jupiterSwapUrl(config.contractAddress),
        });
        try {
          await bot.sendMessage(config.mainGroupChatId, text, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          });
        } catch (e) {
          log.warn('buyAlert send failed', { e: String(e) });
        }
      }

      stateByPair.set(pair.pairAddress, {
        pairAddress: pair.pairAddress,
        lastBuyCount: buyCount,
        lastH1Volume: h1Vol,
        lastChecked: Date.now(),
      });
    }
  } catch (e) {
    log.error('buyAlert tick failed', { e: String(e) });
  }
}

function formatBuyAlert(p: {
  totalNewBuys: number;
  approxUsd: number;
  priceUsd: number;
  marketCap: number;
  change24h: number;
  chartUrl: string;
  buyUrl: string;
}): string {
  const fires = '🟢'.repeat(Math.min(10, Math.max(1, Math.floor(p.approxUsd / 50))));
  return [
    `*💸 NEW BUY — ${TOKEN_TICKER}*`,
    `${fires}`,
    ``,
    `≈ ${formatUsd(p.approxUsd)} per buy · ${p.totalNewBuys} new buy(s)`,
    `Price: ${formatUsd(p.priceUsd)} (${p.change24h >= 0 ? '+' : ''}${p.change24h.toFixed(2)}% 24h)`,
    `MC: ${formatUsd(p.marketCap)}`,
    ``,
    `[chart](${p.chartUrl}) · [buy](${p.buyUrl})`,
    ``,
    `> deprecated. not deleted.`,
  ].join('\n');
}
