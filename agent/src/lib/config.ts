import "dotenv/config";
import path from "node:path";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optional(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.length > 0 ? v : fallback;
}

function int(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function bool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v == null) return fallback;
  return v === "1" || v.toLowerCase() === "true";
}

export const config = {
  geminiApiKey: optional("GEMINI_API_KEY", ""),
  models: {
    tweet: optional("GEMINI_MODEL_TWEET", "gemini-2.0-flash"),
    chat: optional("GEMINI_MODEL_CHAT", "gemini-2.5-flash"),
  },
  server: {
    host: optional("HOST", "0.0.0.0"),
    port: int("PORT", 8787),
  },
  sharedSecret: optional("AGENT_SHARED_SECRET", ""),
  killSwitch: bool("AGENT_KILL_SWITCH", false),
  rate: {
    tweetsPerHour: int("RATE_LIMIT_TWEET_PER_HOUR", 4),
    responsesPerHour: int("RATE_LIMIT_RESPONSE_PER_HOUR", 10),
  },
  paths: {
    memory: optional(
      "MEMORY_STORE_PATH",
      path.resolve(process.cwd(), ".memory/store.json"),
    ),
    tweetLog: optional(
      "TWEET_LOG_PATH",
      path.resolve(process.cwd(), ".logs/tweets.jsonl"),
    ),
  },
  logLevel: optional("LOG_LEVEL", "info"),
};

export function requireGeminiKey(): string {
  if (!config.geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Copy .env.example to .env and fill it in.",
    );
  }
  return config.geminiApiKey;
}

export type Config = typeof config;
