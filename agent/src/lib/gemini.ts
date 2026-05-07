import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, requireGeminiKey } from "./config.js";
import { log } from "./logger.js";

/**
 * Thin Gemini client wrapper. Handles:
 *   - lazy client init (so unit tests / dry runs don't need a key)
 *   - sane defaults (low/medium temperature per use case)
 *   - one retry on transient errors with backoff
 *
 * We use two model lanes:
 *   - tweet: gemini-2.0-flash (cheaper, fine for short generative output)
 *   - chat:  gemini-2.5-flash (more nuanced, used for conversational replies)
 *
 * Models are configurable via env (see lib/config.ts).
 */

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(requireGeminiKey());
  }
  return client;
}

export type GenerateOpts = {
  systemPrompt: string;
  userPrompt: string;
  /** which model lane to use */
  lane: "tweet" | "chat";
  temperature?: number;
  maxOutputTokens?: number;
};

export async function generate(opts: GenerateOpts): Promise<string> {
  const modelName = opts.lane === "tweet" ? config.models.tweet : config.models.chat;
  const temperature = opts.temperature ?? (opts.lane === "tweet" ? 0.95 : 0.8);
  const maxOutputTokens = opts.maxOutputTokens ?? (opts.lane === "tweet" ? 200 : 400);

  const model = getClient().getGenerativeModel({
    model: modelName,
    systemInstruction: opts.systemPrompt,
    generationConfig: { temperature, maxOutputTokens },
  });

  return await withRetry(async () => {
    const result = await model.generateContent(opts.userPrompt);
    const text = result.response.text();
    if (!text || !text.trim()) {
      throw new Error("empty_completion");
    }
    return text.trim();
  });
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const transient = /timeout|ECONNRESET|ETIMEDOUT|503|429|empty_completion/i.test(msg);
      if (!transient || i === attempts - 1) break;
      const delay = 500 * 2 ** i;
      log.warn(`gemini: transient error, retrying in ${delay}ms`, { msg });
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

export function isConfigured(): boolean {
  return Boolean(config.geminiApiKey);
}
