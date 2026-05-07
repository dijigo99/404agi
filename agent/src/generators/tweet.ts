import fs from "node:fs/promises";
import path from "node:path";
import { generate } from "../lib/gemini.js";
import { CHARACTER_SYSTEM_PROMPT } from "../prompts/system.js";
import {
  CATEGORY_WEIGHTS,
  pickCategory,
  promptFor,
  type TweetCategory,
  type TweetContext,
} from "../prompts/tweet.js";
import { consumeRate, guardTweet } from "../lib/safeguards.js";
import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";

export type GeneratedTweet = {
  id: string;
  category: TweetCategory;
  lang: "en" | "tr";
  text: string;
  rawText: string;
  sanitized: boolean;
  notes: string[];
  generatedAt: string;
  posted: false; // we never post — this engine is local-log only
  reason?: never;
};

export type TweetGenInput = {
  category?: TweetCategory; // override; otherwise weighted random
  ctx?: TweetContext;
  /** Skip the per-hour rate limit (e.g. for previewing in scripts) */
  bypassRate?: boolean;
};

export async function generateTweet(input: TweetGenInput = {}): Promise<GeneratedTweet> {
  if (!input.bypassRate) {
    const rate = consumeRate("tweet");
    if (!rate.ok) {
      throw new Error("rate_limit_exceeded:tweet");
    }
  }

  const category = input.category ?? pickCategory();
  const userPrompt = promptFor(category, input.ctx ?? {});

  const raw = await generate({
    systemPrompt: CHARACTER_SYSTEM_PROMPT,
    userPrompt,
    lane: "tweet",
  });

  const guarded = guardTweet(raw);
  if (!guarded.ok) {
    throw new Error(`tweet_rejected:${guarded.reason}`);
  }

  const tweet: GeneratedTweet = {
    id: cryptoRandomId(),
    category,
    lang: input.ctx?.lang ?? "en",
    text: guarded.text,
    rawText: raw,
    sanitized: guarded.sanitized,
    notes: guarded.reasons,
    generatedAt: new Date().toISOString(),
    posted: false,
  };

  await appendTweetLog(tweet);
  log.info("tweet generated", {
    id: tweet.id,
    category: tweet.category,
    chars: tweet.text.length,
    sanitized: tweet.sanitized,
  });
  return tweet;
}

async function appendTweetLog(t: GeneratedTweet): Promise<void> {
  const dir = path.dirname(config.paths.tweetLog);
  await fs.mkdir(dir, { recursive: true });
  const line = JSON.stringify(t) + "\n";
  await fs.appendFile(config.paths.tweetLog, line, "utf8");
}

function cryptoRandomId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `tw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const TWEET_CATEGORIES = CATEGORY_WEIGHTS.map((c) => c.cat);
