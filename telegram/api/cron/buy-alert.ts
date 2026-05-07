import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBot } from '../../lib/botClient';
import { config } from '../../lib/config';
import { buyAlertTick } from '../../lib/services/buyAlert';
import { log } from '../../lib/utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel Cron sends GET with Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.authorization ?? '';
  if (config.cronSecret) {
    const expected = `Bearer ${config.cronSecret}`;
    if (auth !== expected) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
  }

  try {
    const bot = getBot();
    const result = await buyAlertTick(bot);
    res.status(200).json({ ok: true, ...result });
  } catch (e) {
    log.error('buy-alert cron failed', { e: String(e) });
    res.status(500).json({ error: String(e) });
  }
}
