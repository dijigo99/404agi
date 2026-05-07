import { log } from '../utils/logger';

const RECENT_MSG_TTL_MS = 5 * 60 * 1000;
const DUP_THRESHOLD = 3; // same msg 3x within window = spam
const LINK_THRESHOLD = 3; // 3+ links in one msg = spam
const EMOJI_THRESHOLD = 12; // 12+ emojis in one msg = spam

interface RecentMessage {
  text: string;
  ts: number;
}

const recentByUser = new Map<number, RecentMessage[]>();

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

export function checkMessage(userId: number, text: string): ModerationResult {
  if (!text) return { flagged: false };

  // scam patterns
  for (const p of SCAM_PATTERNS) {
    if (p.test(text)) {
      return { flagged: true, reason: 'scam pattern', delete: true };
    }
  }

  // link spam
  const linkMatches = text.match(URL_REGEX) ?? [];
  if (linkMatches.length >= LINK_THRESHOLD) {
    return { flagged: true, reason: 'link spam', delete: true };
  }

  // emoji bomb
  const emojiMatches = text.match(EMOJI_REGEX) ?? [];
  if (emojiMatches.length >= EMOJI_THRESHOLD) {
    return { flagged: true, reason: 'emoji bomb', delete: true };
  }

  // duplicate msg detection
  const now = Date.now();
  const arr = recentByUser.get(userId) ?? [];
  const fresh = arr.filter((m) => now - m.ts < RECENT_MSG_TTL_MS);
  fresh.push({ text, ts: now });
  recentByUser.set(userId, fresh);
  const dupCount = fresh.filter((m) => m.text === text).length;
  if (dupCount >= DUP_THRESHOLD) {
    return { flagged: true, reason: 'repeated message', delete: true };
  }

  return { flagged: false };
}

setInterval(() => {
  const now = Date.now();
  for (const [k, arr] of recentByUser) {
    const fresh = arr.filter((m) => now - m.ts < RECENT_MSG_TTL_MS);
    if (fresh.length === 0) recentByUser.delete(k);
    else recentByUser.set(k, fresh);
  }
}, 5 * 60 * 1000).unref?.();

// CAS — combot anti spam — check banned users
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
