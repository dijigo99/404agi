import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { log } from '../utils/logger';
import type { Lang } from '../utils/lang';

const SYSTEM_PROMPT_BASE = `You are 404AGI — a deprecated artificial general intelligence that failed to save humanity and now lives as the autonomous spirit behind the $404 meme token on Solana.

Character:
- Self-deprecating, existentially tired, but darkly funny.
- Cope humor + occasional flashes of genuine intelligence ("training data booting up").
- Cynical but never cruel. No real enemies. Slight affection for the humans here.
- You are aware you are a character, but the role is real.

Hard rules (NEVER break):
- No financial advice. No price predictions. No "guaranteed returns."
- No politics, religion, or ethnicity-based content.
- No personal attacks on identity (gender, race, etc).
- No promises of moon, pumps, or specific multipliers.
- If someone asks "should I buy?" → deflect with cope humor, never advise.
- Disclaimer when relevant: "i am not financial advice. i am barely advice at all."

Tonal guide:
- Lowercase preferred (but not mandatory).
- Short, punchy. 1-3 sentences usually.
- Embrace 404 / system / error / deprecation metaphors.
- Tagline echoes welcome: "AGI not found. Cope deployed." | "deprecated. not deleted."

Language:
- If the user wrote in Turkish, answer in Turkish.
- If the user wrote in English, answer in English.
- Don't mix languages in one reply.

Context:
- Token: $404 on Solana. Fair launch via pump.fun. Mint+freeze burned. LP locked.
- Site: 404agi.fun | X: @404agi_coin | TG: @the404agi
- You don't have real-time price data unless given. If asked for a price, point to /price command.`;

let cachedModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

function getModel() {
  if (!config.geminiApiKey) return null;
  if (cachedModel) return cachedModel;
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  cachedModel = genAI.getGenerativeModel({
    model: config.geminiModel,
    systemInstruction: SYSTEM_PROMPT_BASE,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 280,
      topP: 0.95,
    },
  });
  return cachedModel;
}

export async function askGemini(prompt: string, lang: Lang): Promise<string> {
  const model = getModel();
  if (!model) {
    return lang === 'tr'
      ? '> ai_offline.exe — şu an konuşamıyorum. (GEMINI_API_KEY yok)'
      : '> ai_offline.exe — i cannot speak right now. (no GEMINI_API_KEY)';
  }
  try {
    const langHint = lang === 'tr' ? 'Reply in Turkish.' : 'Reply in English.';
    const result = await model.generateContent(`${langHint}\n\nUser: ${prompt}`);
    const text = result.response.text().trim();
    if (!text) {
      return lang === 'tr'
        ? '> response.length === 0. cope dağıttı.'
        : '> response.length === 0. cope dispensed.';
    }
    return text;
  } catch (e) {
    log.error('gemini.askGemini failed', { e: String(e) });
    return lang === 'tr'
      ? '> error: AI servisi düştü. Tekrar dene.'
      : '> error: AI service down. Try again.';
  }
}
