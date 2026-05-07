import { getKv, hasKv } from '../kv';
import { log } from '../utils/logger';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSec: number;
}

const HOUR_SEC = 60 * 60;

// In-memory fallback for `vercel dev` without KV configured.
const memBuckets = new Map<string, { count: number; windowStart: number }>();

function memCheck(userId: number, limit: number): RateLimitResult {
  const key = String(userId);
  const now = Date.now();
  let b = memBuckets.get(key);
  if (!b || now - b.windowStart >= HOUR_SEC * 1000) {
    b = { count: 0, windowStart: now };
    memBuckets.set(key, b);
  }
  if (b.count >= limit) {
    const resetInSec = Math.max(0, Math.ceil((b.windowStart + HOUR_SEC * 1000 - now) / 1000));
    return { allowed: false, remaining: 0, resetInSec };
  }
  b.count += 1;
  const resetInSec = Math.max(0, Math.ceil((b.windowStart + HOUR_SEC * 1000 - now) / 1000));
  return { allowed: true, remaining: limit - b.count, resetInSec };
}

export async function checkAndConsume(userId: number, limit: number): Promise<RateLimitResult> {
  if (!hasKv()) return memCheck(userId, limit);
  const key = `rl:ask:${userId}`;
  try {
    const kv = getKv();
    const count = await kv.incr(key);
    let ttl = await kv.ttl(key);
    if (count === 1 || ttl < 0) {
      await kv.expire(key, HOUR_SEC);
      ttl = HOUR_SEC;
    }
    if (count > limit) {
      return { allowed: false, remaining: 0, resetInSec: Math.max(1, ttl) };
    }
    return {
      allowed: true,
      remaining: Math.max(0, limit - count),
      resetInSec: Math.max(1, ttl),
    };
  } catch (e) {
    log.warn('rateLimit kv failed, falling back to memory', { e: String(e) });
    return memCheck(userId, limit);
  }
}
