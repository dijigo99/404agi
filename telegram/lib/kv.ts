import { Redis } from '@upstash/redis';

let cached: Redis | null = null;

export function getKv(): Redis {
  if (cached) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
  }
  cached = new Redis({ url, token });
  return cached;
}

export function hasKv(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
