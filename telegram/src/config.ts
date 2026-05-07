import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

function intEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function numberList(name: string): number[] {
  const v = process.env[name];
  if (!v) return [];
  return v
    .split(',')
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));
}

export const config = {
  botToken: required('TELEGRAM_BOT_TOKEN'),
  contractAddress: optional('CONTRACT_ADDRESS'),
  siteUrl: optional('SITE_URL', 'https://404agi.fun'),
  xUrl: optional('X_URL', 'https://x.com/404agi_coin'),
  githubUrl: optional('GITHUB_URL', 'https://github.com/dijigo99/404agi'),

  mainGroupChatId: optional('MAIN_GROUP_CHAT_ID'),
  trGroupChatId: optional('TR_GROUP_CHAT_ID'),
  newsChannelChatId: optional('NEWS_CHANNEL_CHAT_ID'),

  adminUserIds: numberList('ADMIN_USER_IDS'),

  geminiApiKey: optional('GEMINI_API_KEY'),
  geminiModel: optional('GEMINI_MODEL', 'gemini-2.5-flash'),

  buyAlertMinUsd: intEnv('BUY_ALERT_MIN_USD', 50),
  buyAlertPollMs: intEnv('BUY_ALERT_POLL_MS', 60_000),

  askRateLimitPerHour: intEnv('ASK_RATE_LIMIT_PER_HOUR', 5),

  announceApiKey: optional('ANNOUNCE_API_KEY'),

  port: intEnv('PORT', 3000),
} as const;

export const TOKEN_NAME = '404AGI';
export const TOKEN_TICKER = '$404';
