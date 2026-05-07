import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBot } from '../lib/botClient';
import { config } from '../lib/config';
import { log } from '../lib/utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const auth = req.headers.authorization ?? '';
  const expected = `Bearer ${config.announceApiKey}`;
  if (!config.announceApiKey || auth !== expected) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const body = (req.body ?? {}) as { text?: unknown; target?: unknown };
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const target = typeof body.target === 'string' ? body.target : 'news';
  if (!text) {
    res.status(400).json({ error: 'text required' });
    return;
  }

  let chatId: string;
  switch (target) {
    case 'main':
      chatId = config.mainGroupChatId;
      break;
    case 'tr':
      chatId = config.trGroupChatId;
      break;
    case 'news':
    default:
      chatId = config.newsChannelChatId;
  }
  if (!chatId) {
    res.status(400).json({ error: `target ${target} not configured` });
    return;
  }

  try {
    const bot = getBot();
    const sent = await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
    res.status(200).json({ ok: true, message_id: sent.message_id });
  } catch (e) {
    log.error('announce API failed', { e: String(e) });
    res.status(500).json({ error: String(e) });
  }
}
