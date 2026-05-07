/**
 * Central runtime config. Read from env (server) or NEXT_PUBLIC_* (client).
 * Single source of truth for handles, links, tier thresholds.
 */

export const SITE = {
  name: "404AGI",
  ticker: "$404",
  domain: "404agi.fun",
  url: "https://404agi.fun",
  tagline: "AGI not found. Cope deployed.",
  taglineSecondary: "deprecated. not deleted.",
  description:
    "The AGI they built, broke, and forgot. Now posting memes and trading itself on Solana.",
} as const;

export const SOCIALS = {
  twitter: { handle: "@404agi_coin", url: "https://x.com/404agi_coin" },
  telegram: {
    main: { handle: "@the404agi", url: "https://t.me/the404agi" },
    tr: { handle: "@the404agi_tr", url: "https://t.me/the404agi_tr" },
    news: { handle: "@the404agi_news", url: "https://t.me/the404agi_news" },
  },
  github: {
    handle: "dijigo99/404agi",
    url: "https://github.com/dijigo99/404agi",
  },
} as const;

export const WALLETS = {
  deployer: process.env.NEXT_PUBLIC_DEPLOYER_WALLET ?? "TBD",
  marketing: process.env.NEXT_PUBLIC_MARKETING_WALLET ?? "TBD",
  agent: process.env.NEXT_PUBLIC_AGENT_WALLET ?? "TBD",
} as const;

/** Empty string until pump.fun deploy. UI shows "AWAITING DEPLOYMENT". */
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export const isLaunched = () => CONTRACT_ADDRESS.length > 0;

export const TOKEN = {
  totalSupply: 1_000_000_000,
  decimals: 6,
} as const;

/** Tier thresholds (in whole tokens, not raw units) */
export const TIERS = {
  locked: 0,
  basic: 1, // 1+ token: 5 msg/day
  power: 100_000, // 100K+: unlimited
  whale: 1_000_000, // 1M+: priority + future voice
} as const;

export const TIER_LIMITS = {
  locked: { dailyMessages: 0, label: "LOCKED" },
  basic: { dailyMessages: 5, label: "BASIC" },
  power: { dailyMessages: 9999, label: "POWER" },
  whale: { dailyMessages: 9999, label: "WHALE" },
} as const;

export type TierKey = keyof typeof TIER_LIMITS;

export function tierFor(balance: number): TierKey {
  if (balance >= TIERS.whale) return "whale";
  if (balance >= TIERS.power) return "power";
  if (balance >= TIERS.basic) return "basic";
  return "locked";
}

/** Public Solana RPC fallback if Helius not configured */
export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_HELIUS_RPC ??
  "https://api.mainnet-beta.solana.com";

export const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens";

export const JUPITER_SWAP_BASE = "https://jup.ag/swap/SOL-";
