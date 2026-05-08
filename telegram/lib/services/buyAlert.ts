import TelegramBot from 'node-telegram-bot-api';
import { config, TOKEN_TICKER } from '../config';
import { fetchPairsByToken, jupiterSwapUrl } from './dexscreener';
import { getKv, hasKv } from '../kv';
import { log } from '../utils/logger';
import { formatUsd } from '../utils/format';

interface PairState {
  lastBuyCount: number;
  lastH1Volume: number;
  lastChecked: number;
}

const STATE_TTL_SEC = 6 * 60 * 60; // 6h — pair gone for 6h, treat as new

export async function buyAlertTick(bot: TelegramBot): Promise<{ alerts: number; pairs: number }> {
  if (!config.contractAddress) {
    log.warn('buyAlert disabled — no CONTRACT_ADDRESS');
    return { alerts: 0, pairs: 0 };
  }
  if (!config.mainGroupChatId) {
    log.warn('buyAlert disabled — no MAIN_GROUP_CHAT_ID');
    return { alerts: 0, pairs: 0 };
  }

  const pairs = await fetchPairsByToken(config.contractAddress);
  const solPairs = pairs.filter((p) => p.chainId === 'solana');
  if (solPairs.length === 0) return { alerts: 0, pairs: 0 };

  let alerts = 0;
  for (const pair of solPairs) {
    const buyCount = pair.txns?.h1?.buys ?? 0;
    const h1Vol = pair.volume?.h1 ?? 0;
    const priceUsd = Number.parseFloat(pair.priceUsd ?? '0');

    const prev = await loadPairState(pair.pairAddress);

    if (!prev) {
      await savePairState(pair.pairAddress, {
        lastBuyCount: buyCount,
        lastH1Volume: h1Vol,
        lastChecked: Date.now(),
      });
      continue;
    }

    const newBuys = Math.max(0, buyCount - prev.lastBuyCount);
    const newVolume = Math.max(0, h1Vol - prev.lastH1Volume);
    const avgPerBuy = newBuys > 0 ? newVolume / newBuys / 2 : 0;

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
        const video = pickBuyVideo(avgPerBuy);
        if (video) {
          await bot.sendVideo(config.mainGroupChatId, video, {
            caption: text,
            parse_mode: 'Markdown',
          });
        } else {
          await bot.sendMessage(config.mainGroupChatId, text, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          });
        }
        alerts += 1;
      } catch (e) {
        log.warn('buyAlert primary send failed, trying text fallback', { e: String(e) });
        try {
          await bot.sendMessage(config.mainGroupChatId, text, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          });
          alerts += 1;
        } catch (e2) {
          log.warn('buyAlert text fallback also failed', { e: String(e2) });
        }
      }
    }

    await savePairState(pair.pairAddress, {
      lastBuyCount: buyCount,
      lastH1Volume: h1Vol,
      lastChecked: Date.now(),
    });
  }

  return { alerts, pairs: solPairs.length };
}

async function loadPairState(pairAddress: string): Promise<PairState | null> {
  if (!hasKv()) return memState.get(pairAddress) ?? null;
  try {
    const raw = await getKv().get<PairState>(`buyalert:pair:${pairAddress}`);
    return raw ?? null;
  } catch (e) {
    log.warn('buyAlert kv load failed', { e: String(e) });
    return memState.get(pairAddress) ?? null;
  }
}

async function savePairState(pairAddress: string, state: PairState): Promise<void> {
  memState.set(pairAddress, state);
  if (!hasKv()) return;
  try {
    await getKv().set(`buyalert:pair:${pairAddress}`, state, { ex: STATE_TTL_SEC });
  } catch (e) {
    log.warn('buyAlert kv save failed', { e: String(e) });
  }
}

const memState = new Map<string, PairState>();

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

// Tier-based buy video selector
// EVERY buy alert ($5+) gets a video. Bigger buys = bigger video.
function pickBuyVideo(approxUsd: number): string | null {
  const base = 'https://raw.githubusercontent.com/dijigo99/404agi/main/branding/assets';
  if (approxUsd >= 2000) return `${base}/video-launch.mp4`; // 🐋 whale
  if (approxUsd >= 500) return `${base}/video-post.mp4`;     // chunky buy
  return `${base}/video-buy.mp4`;                            // every buy gets video-buy
}
