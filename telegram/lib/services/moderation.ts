import { getKv, hasKv } from '../kv';
import { log } from '../utils/logger';

const RECENT_MSG_TTL_SEC = 5 * 60;
const DUP_THRESHOLD = 3;
const LINK_THRESHOLD = 3;
const EMOJI_THRESHOLD = 12;

const URL_REGEX = /\b(?:https?:\/\/|t\.me\/|www\.)\S+/gi;
const EMOJI_REGEX =
  /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}]/gu;

const SCAM_PATTERNS = [
  /\b(airdrop|free\s*sol|claim\s*your)\b/i,
  /\b(send\s*\d+\s*sol)\b/i,
  /\b(double\s*your\s*(sol|crypto))\b/i,
  /\b(metamask|phantom)\s*(seed|phrase|recovery)\b/i,
  /\b(connect\s*wallet)\b.*\b(claim|airdrop|reward)\b/i,
];

export interface ModerationResult {
  flagged: boolean;
  reason?: string;
  delete?: boolean;
}

// In-memory fallback for local dev without KV.
const memRecent = new Map<number, { text: string; ts: number }[]>();

function memDupCheck(userId: number, text: string): boolean {
  const now = Date.now();
  const arr = memRecent.get(userId) ?? [];
  const fresh = arr.filter((m) => now - m.ts < RECENT_MSG_TTL_SEC * 1000);
  fresh.push({ text, ts: now });
  memRecent.set(userId, fresh);
  return fresh.filter((m) => m.text === text).length >= DUP_THRESHOLD;
}

async function kvDupCheck(userId: number, text: string): Promise<boolean> {
  try {
    const kv = getKv();
    const key = `mod:dup:${userId}`;
    const now = Date.now();
    const cutoff = now - RECENT_MSG_TTL_SEC * 1000;
    // Trim old entries first.
    await kv.zremrangebyscore(key, 0, cutoff);
    // Add this message with timestamp as score, member is "ts:hash"
    const hash = simpleHash(text);
    await kv.zadd(key, { score: now, member: `${now}:${hash}` });
    await kv.expire(key, RECENT_MSG_TTL_SEC);
    // Count entries with this hash in the window
    const all = (await kv.zrange<string[]>(key, cutoff, now, { byScore: true })) ?? [];
    const dupCount = all.filter((m) => m.endsWith(`:${hash}`)).length;
    return dupCount >= DUP_THRESHOLD;
  } catch (e) {
    log.warn('moderation kv failed, falling back to memory', { e: String(e) });
    return memDupCheck(userId, text);
  }
}

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export async function checkMessage(userId: number, text: string): Promise<ModerationResult> {
  if (!text) return { flagged: false };

  for (const p of SCAM_PATTERNS) {
    if (p.test(text)) {
      return { flagged: true, reason: 'scam pattern', delete: true };
    }
  }

  const linkMatches = text.match(URL_REGEX) ?? [];
  if (linkMatches.length >= LINK_THRESHOLD) {
    return { flagged: true, reason: 'link spam', delete: true };
  }

  const emojiMatches = text.match(EMOJI_REGEX) ?? [];
  if (emojiMatches.length >= EMOJI_THRESHOLD) {
    return { flagged: true, reason: 'emoji bomb', delete: true };
  }

  const isDup = hasKv() ? await kvDupCheck(userId, text) : memDupCheck(userId, text);
  if (isDup) {
    return { flagged: true, reason: 'repeated message', delete: true };
  }

  return { flagged: false };
}

export async function isCasBanned(userId: number): Promise<boolean> {
  try {
    const res = await fetch(`https://api.cas.chat/check?user_id=${userId}`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok: boolean; result?: { offenses?: number } };
    return data.ok === true && (data.result?.offenses ?? 0) > 0;
  } catch (e) {
    log.warn('CAS check failed', { userId, e: String(e) });
    return false;
  }
}
