import { CONTRACT_ADDRESS, DEXSCREENER_API } from "@/lib/config";

export type TokenStats = {
  priceUsd: number | null;
  marketCap: number | null;
  volume24h: number | null;
  change24h: number | null;
  liquidity: number | null;
  pairAddress: string | null;
  isLive: boolean;
};

const EMPTY: TokenStats = {
  priceUsd: null,
  marketCap: null,
  volume24h: null,
  change24h: null,
  liquidity: null,
  pairAddress: null,
  isLive: false,
};

/**
 * Client-friendly fetch (CORS-allowed). Returns nulls pre-launch.
 */
export async function fetchTokenStats(
  ca = CONTRACT_ADDRESS
): Promise<TokenStats> {
  if (!ca) return EMPTY;
  try {
    const res = await fetch(`${DEXSCREENER_API}/${ca}`, {
      cache: "no-store",
    });
    if (!res.ok) return EMPTY;
    const data = await res.json();
    type DexPair = {
      priceUsd?: string | number;
      marketCap?: number;
      fdv?: number;
      volume?: { h24?: number };
      priceChange?: { h24?: number };
      liquidity?: { usd?: number };
      pairAddress?: string;
    };
    const pairs: DexPair[] = data?.pairs ?? [];
    if (!pairs.length) return EMPTY;
    // Pick the pair with highest liquidity
    const top = pairs.reduce((best, p) =>
      (p.liquidity?.usd ?? 0) > (best.liquidity?.usd ?? 0) ? p : best
    );
    return {
      priceUsd: Number(top.priceUsd) || null,
      marketCap: Number(top.marketCap ?? top.fdv) || null,
      volume24h: Number(top.volume?.h24) || null,
      change24h: Number(top.priceChange?.h24) || null,
      liquidity: Number(top.liquidity?.usd) || null,
      pairAddress: top.pairAddress ?? null,
      isLive: true,
    };
  } catch {
    return EMPTY;
  }
}

export type Holder = { address: string; amount: number };

/**
 * Holder count is not on Dexscreener. We rely on a placeholder for now
 * (real count later via Helius getProgramAccounts or token-metadata API).
 */
export async function fetchHolderCount(): Promise<number | null> {
  return null;
}
