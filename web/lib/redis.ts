import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  // Accept both naming conventions:
  // - UPSTASH_REDIS_REST_* (manual / direct Upstash)
  // - KV_REST_API_* (Vercel Marketplace integration)
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!_redis) _redis = new Redis({ url, token });
  return _redis;
}

/** Sliding-window rate limiter, scoped per identifier (wallet pubkey). */
export function getRateLimiter(maxPerDay: number) {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxPerDay, "1 d"),
    analytics: false,
    prefix: "404agi:rl",
  });
}

/** Append a chat turn to the user's rolling memory (last 20 messages). */
export async function pushMemory(
  userId: string,
  msg: { role: "user" | "model"; text: string }
) {
  const redis = getRedis();
  if (!redis) return;
  const key = `404agi:mem:${userId}`;
  await redis.lpush(key, JSON.stringify(msg));
  await redis.ltrim(key, 0, 19);
  await redis.expire(key, 60 * 60 * 24 * 7); // 7d TTL
}

export async function loadMemory(userId: string) {
  const redis = getRedis();
  if (!redis) return [] as Array<{ role: "user" | "model"; text: string }>;
  const key = `404agi:mem:${userId}`;
  const raw = (await redis.lrange(key, 0, 19)) as string[];
  return raw
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .reverse() as Array<{ role: "user" | "model"; text: string }>;
}
