interface Bucket {
  count: number;
  windowStart: number;
}

const HOUR_MS = 60 * 60 * 1000;

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSec: number;
}

export function checkAndConsume(userId: number, limit: number): RateLimitResult {
  const key = String(userId);
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now - b.windowStart >= HOUR_MS) {
    b = { count: 0, windowStart: now };
    buckets.set(key, b);
  }
  if (b.count >= limit) {
    const resetInSec = Math.max(0, Math.ceil((b.windowStart + HOUR_MS - now) / 1000));
    return { allowed: false, remaining: 0, resetInSec };
  }
  b.count += 1;
  const resetInSec = Math.max(0, Math.ceil((b.windowStart + HOUR_MS - now) / 1000));
  return { allowed: true, remaining: limit - b.count, resetInSec };
}

setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (now - b.windowStart >= HOUR_MS) buckets.delete(k);
  }
}, 10 * 60 * 1000).unref?.();
