import { log } from '../utils/logger';

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd?: string;
  priceNative?: string;
  fdv?: number;
  marketCap?: number;
  liquidity?: { usd?: number };
  volume?: { h24?: number; h6?: number; h1?: number; m5?: number };
  priceChange?: { h24?: number; h6?: number; h1?: number; m5?: number };
  txns?: {
    h24?: { buys?: number; sells?: number };
    h1?: { buys?: number; sells?: number };
  };
  pairCreatedAt?: number;
}

export interface PriceSnapshot {
  pair: DexPair;
  priceUsd: number;
  marketCap: number;
  liquidityUsd: number;
  volume24h: number;
  change24h: number;
  change1h: number;
  url: string;
}

const BASE_URL = 'https://api.dexscreener.com';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'User-Agent': '404agi-tg-bot/0.1' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Dexscreener ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

export async function fetchPairsByToken(tokenAddress: string): Promise<DexPair[]> {
  if (!tokenAddress) return [];
  const data = await fetchJson<{ pairs: DexPair[] | null }>(
    `${BASE_URL}/latest/dex/tokens/${tokenAddress}`,
  );
  return data.pairs ?? [];
}

export async function fetchBestPair(tokenAddress: string): Promise<DexPair | null> {
  const pairs = await fetchPairsByToken(tokenAddress);
  if (pairs.length === 0) return null;
  // pick by highest 24h volume on solana
  const solanaPairs = pairs.filter((p) => p.chainId === 'solana');
  const list = solanaPairs.length > 0 ? solanaPairs : pairs;
  list.sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));
  return list[0] ?? null;
}

export async function getPriceSnapshot(tokenAddress: string): Promise<PriceSnapshot | null> {
  try {
    const pair = await fetchBestPair(tokenAddress);
    if (!pair) return null;
    const priceUsd = Number.parseFloat(pair.priceUsd ?? '0');
    return {
      pair,
      priceUsd,
      marketCap: pair.marketCap ?? pair.fdv ?? 0,
      liquidityUsd: pair.liquidity?.usd ?? 0,
      volume24h: pair.volume?.h24 ?? 0,
      change24h: pair.priceChange?.h24 ?? 0,
      change1h: pair.priceChange?.h1 ?? 0,
      url: pair.url,
    };
  } catch (e) {
    log.error('dexscreener.getPriceSnapshot failed', { e: String(e) });
    return null;
  }
}

export function dexscreenerUrl(tokenAddress: string): string {
  return `https://dexscreener.com/solana/${tokenAddress}`;
}

export function jupiterSwapUrl(tokenAddress: string): string {
  return `https://jup.ag/swap/SOL-${tokenAddress}`;
}
