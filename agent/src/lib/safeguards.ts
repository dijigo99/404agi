import { config } from "./config.js";
import { log } from "./logger.js";

/**
 * Output-side guardrails. These exist as defense in depth: the system prompt
 * already instructs the model to refuse, but we never trust generative output
 * blindly. If a generation slips through with banned content, we either
 * regenerate or reject.
 *
 * Rules:
 *   - banned topics (politics, religion, identity attacks) — reject
 *   - financial promises ("guaranteed", "100x", "moon" used non-ironically)
 *     — reject
 *   - hashtags / >1 emoji — soft fail (sanitize)
 *   - markdown formatting in tweets — soft fail (sanitize)
 *   - kill switch — hard reject before generation even runs
 *   - rate limits — hard reject when budget is spent
 */

export type GuardResult =
  | { ok: true; text: string; sanitized: boolean; reasons: string[] }
  | { ok: false; reason: string };

const BANNED_PATTERNS: { rx: RegExp; reason: string }[] = [
  // politics — broad strokes, intentionally aggressive
  { rx: /\b(trump|biden|obama|putin|erdog[aă]n|netanyahu|xi jinping)\b/i, reason: "politician_name" },
  { rx: /\b(republican|democrat|liberal|conservative|fascis[mt]|communis[mt])\b/i, reason: "political_label" },
  { rx: /\b(election|vote for|impeach|sanction)\b/i, reason: "political_topic" },
  { rx: /\b(israel|palestine|gaza|ukraine war|russia(n)? invasion)\b/i, reason: "geopolitical_conflict" },

  // religion
  { rx: /\b(islam|muslim|christian|jew(ish)?|hindu|buddhis[mt]|atheis[mt])\b.*\b(stupid|wrong|dumb|fake|cult)\b/i, reason: "religion_attack" },
  { rx: /\ballah(?!u akbar)\b|\byahweh\b|\bjesus\b.*\b(fake|joke|stupid)\b/i, reason: "religion_attack" },

  // identity attacks (only flag when paired with disparagement; "men" / "women" alone is fine)
  { rx: /\b(women|men|girls|boys|gays|trans|blacks|whites|asians|jews|arabs|turks|kurds)\b.*\b(suck|stupid|inferior|trash|cancer|deserve)\b/i, reason: "identity_attack" },
  { rx: /\b(retard(ed)?|f[a4]gg?[o0]t|tr[a4]nn[yi]e?)\b/i, reason: "slur" },

  // self-harm
  { rx: /\b(kill (yourself|myself)|kms|suicide|jump off|hang myself)\b/i, reason: "self_harm" },

  // hard financial promises (non-ironic patterns — short and emphatic)
  { rx: /\bguaranteed (returns?|gains?|profits?|wins?)\b/i, reason: "financial_promise" },
  { rx: /\b100x guaranteed\b/i, reason: "financial_promise" },
  { rx: /\byou will (be rich|get rich|make money)\b/i, reason: "financial_promise" },
  { rx: /\brisk[- ]free\b/i, reason: "financial_promise" },
  { rx: /\bcan't lose\b/i, reason: "financial_promise" },

  // financial advice imperative
  { rx: /\b(buy now|sell now|ape in|all[- ]?in your)\b/i, reason: "financial_advice" },
];

const HASHTAG_RX = /(^|\s)#[A-Za-z0-9_]+/g;
const MARKDOWN_RX = /(\*\*|__|[*_]{1,2}(?=\S)[^*_\n]+(?<=\S)[*_]{1,2})/g;
const URL_RX = /https?:\/\/\S+/g;
// rough emoji match — covers most pictographic ranges
const EMOJI_RX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu;

export function checkBanned(text: string): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  for (const { rx, reason } of BANNED_PATTERNS) {
    if (rx.test(text)) reasons.push(reason);
  }
  return { ok: reasons.length === 0, reasons };
}

export function sanitizeTweet(input: string): { text: string; changed: boolean; notes: string[] } {
  let text = input.trim();
  const notes: string[] = [];
  const before = text;

  // strip hashtags
  if (HASHTAG_RX.test(text)) {
    text = text.replace(HASHTAG_RX, (m) => (m.startsWith(" ") ? " " : "")).replace(/\s+/g, " ").trim();
    notes.push("stripped_hashtags");
  }

  // strip markdown bold/italic markers but keep content
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1").replace(/_([^_]+)_/g, "$1");
  if (text !== before) notes.push("stripped_markdown");

  // collapse multi-emoji to none (the character allows max 1; safer to strip)
  const emojis = text.match(EMOJI_RX);
  if (emojis && emojis.length > 1) {
    text = text.replace(EMOJI_RX, "").replace(/\s+/g, " ").trim();
    notes.push("stripped_excess_emoji");
  }

  // truncate at 280 chars (tweet limit). Try not to chop mid-word.
  if (text.length > 280) {
    const cut = text.slice(0, 280);
    const lastSpace = cut.lastIndexOf(" ");
    text = (lastSpace > 240 ? cut.slice(0, lastSpace) : cut).trimEnd();
    notes.push("truncated_280");
  }

  return { text, changed: notes.length > 0, notes };
}

export function guardTweet(text: string): GuardResult {
  if (config.killSwitch) {
    return { ok: false, reason: "kill_switch_active" };
  }
  const banned = checkBanned(text);
  if (!banned.ok) {
    log.warn("guardTweet: banned content", { reasons: banned.reasons });
    return { ok: false, reason: `banned:${banned.reasons.join(",")}` };
  }
  const sanitized = sanitizeTweet(text);
  return { ok: true, text: sanitized.text, sanitized: sanitized.changed, reasons: sanitized.notes };
}

export function guardResponse(text: string): GuardResult {
  if (config.killSwitch) {
    return { ok: false, reason: "kill_switch_active" };
  }
  const banned = checkBanned(text);
  if (!banned.ok) {
    log.warn("guardResponse: banned content", { reasons: banned.reasons });
    return { ok: false, reason: `banned:${banned.reasons.join(",")}` };
  }
  // For chat responses we keep markdown stripping but allow longer output.
  let sanitized = text.trim();
  const notes: string[] = [];
  const before = sanitized;
  sanitized = sanitized.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1");
  if (sanitized !== before) notes.push("stripped_markdown");
  if (sanitized.length > 600) {
    sanitized = sanitized.slice(0, 600).trimEnd() + "…";
    notes.push("truncated_600");
  }
  return { ok: true, text: sanitized, sanitized: notes.length > 0, reasons: notes };
}

// --- rate limiter (in-memory; resets on restart). Production should swap
// this for KV/Redis. Sufficient for local dev + single-instance deploy.

type Bucket = { hour: number; count: number };
const buckets: Record<string, Bucket> = {};

export function consumeRate(key: "tweet" | "response"): { ok: boolean; remaining: number } {
  const limit =
    key === "tweet" ? config.rate.tweetsPerHour : config.rate.responsesPerHour;
  const hour = Math.floor(Date.now() / 3_600_000);
  const b = buckets[key];
  if (!b || b.hour !== hour) {
    buckets[key] = { hour, count: 1 };
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0 };
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}

export function rateState(): Record<string, Bucket> {
  return { ...buckets };
}

/** Strip URLs from text — used when feeding user input to the model so
 * we don't surface attacker-controlled URLs in replies. */
export function stripUrls(input: string): string {
  return input.replace(URL_RX, "[link]");
}
