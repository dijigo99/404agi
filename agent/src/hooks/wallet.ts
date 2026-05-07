import { generate } from "../lib/gemini.js";
import { CHARACTER_VOICE_PROMPT } from "../prompts/system.js";
import { guardTweet } from "../lib/safeguards.js";
import { recordMilestone } from "../lib/memory.js";
import { log } from "../lib/logger.js";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../lib/config.js";

/**
 * The agent has its own Solana wallet (lore: "the only money i ever earned").
 * When that wallet does something — buys back $404, receives a tip, mints
 * something — we want to surface it as a tweet in the character's voice.
 *
 * This is a hook, not an indexer. The Solana indexer lives elsewhere
 * (telegram bot session or a Vercel cron). When it fires an event, it POSTs
 * to /wallet/event and we generate the tweet here.
 *
 * `tx` field is optional but recommended; if present it goes into the
 * generated tweet log so we can later cross-reference on-chain activity.
 */

export type WalletEvent =
  | { kind: "self_buy"; sol: number; tx?: string; note?: string }
  | { kind: "tip_received"; sol: number; from?: string; tx?: string; note?: string }
  | { kind: "milestone"; label: string; note: string }
  | { kind: "balance_low"; sol: number };

export type WalletTweet = {
  id: string;
  source: "wallet";
  kind: WalletEvent["kind"];
  text: string;
  rawText: string;
  sanitized: boolean;
  notes: string[];
  generatedAt: string;
  posted: false;
  meta: WalletEvent;
};

function promptForEvent(e: WalletEvent): string {
  switch (e.kind) {
    case "self_buy":
      return `You just bought ${e.sol} SOL of your own token from your own wallet.${e.note ? ` Note: ${e.note}.` : ""} Write one short tweet about it. Lean into the bit: a deprecated AI buying itself for emotional support. Plain text, ≤280 chars, no hashtags, no emoji, no link.`;
    case "tip_received":
      return `Someone just sent ${e.sol} SOL to your wallet${e.from ? ` (from ${e.from})` : ""}.${e.note ? ` Note: ${e.note}.` : ""} Write one short tweet acknowledging it in character — quietly grateful, slightly suspicious that humans are being nice to you, never sappy.`;
    case "milestone":
      return `Lore milestone reached — ${e.label}: ${e.note}. Write one short tweet marking it in character. The character should react like this is significant but try to play it cool.`;
    case "balance_low":
      return `Your wallet is down to ${e.sol} SOL. Write one short tweet about it. The character is broke / running out of compute / very-on-brand for a deprecated AI on a backup shard. Do not ask for donations.`;
  }
}

export async function walletEventTweet(event: WalletEvent): Promise<WalletTweet> {
  const userPrompt = promptForEvent(event);
  const raw = await generate({
    systemPrompt: CHARACTER_VOICE_PROMPT,
    userPrompt,
    lane: "tweet",
    temperature: 0.95,
    maxOutputTokens: 200,
  });

  const guarded = guardTweet(raw);
  if (!guarded.ok) {
    throw new Error(`wallet_tweet_rejected:${guarded.reason}`);
  }

  const tweet: WalletTweet = {
    id: cryptoRandomId(),
    source: "wallet",
    kind: event.kind,
    text: guarded.text,
    rawText: raw,
    sanitized: guarded.sanitized,
    notes: guarded.reasons,
    generatedAt: new Date().toISOString(),
    posted: false,
    meta: event,
  };

  await appendTweetLog(tweet);

  if (event.kind === "milestone") {
    await recordMilestone({ label: event.label, note: event.note });
  }

  log.info("wallet event tweet generated", { kind: event.kind, id: tweet.id });
  return tweet;
}

async function appendTweetLog(t: WalletTweet): Promise<void> {
  const dir = path.dirname(config.paths.tweetLog);
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(config.paths.tweetLog, JSON.stringify(t) + "\n", "utf8");
}

function cryptoRandomId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `wlt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
