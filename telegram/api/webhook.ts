import type { VercelRequest, VercelResponse } from '@vercel/node';
import type TelegramBot from 'node-telegram-bot-api';
import { getBot } from '../lib/botClient';
import { config } from '../lib/config';
import { routeUpdate } from '../lib/router';
import { log } from '../lib/utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  // Telegram webhook secret_token verification
  if (config.webhookSecret) {
    const header = req.headers['x-telegram-bot-api-secret-token'];
    if (header !== config.webhookSecret) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
  }

  const update = req.body as TelegramBot.Update | undefined;
  if (!update || typeof update !== 'object') {
    res.status(400).json({ error: 'invalid update' });
    return;
  }

  // Acknowledge Telegram immediately to avoid retries; process asynchronously.
  // On Vercel serverless, the function still keeps running until the response settles
  // and the request body is parsed, so we do the work before responding for correctness.
  try {
    const bot = getBot();
    await routeUpdate(bot, update);
    res.status(200).json({ ok: true });
  } catch (e) {
    log.error('webhook routing failed', { e: String(e) });
    // Still 200 so Telegram doesn't retry — log + drop
    res.status(200).json({ ok: false, error: String(e) });
  }
}
