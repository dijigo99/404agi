import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { log } from './utils/logger';

export function startServer(bot: TelegramBot) {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  app.get('/', (_req, res) => {
    res.json({ name: '404agi-telegram-bot', status: 'online' });
  });

  // POST /announce  Authorization: Bearer <ANNOUNCE_API_KEY>
  // body: { text: string, target?: 'news' | 'main' | 'tr' }
  app.post('/announce', async (req, res) => {
    const auth = req.headers.authorization ?? '';
    const expected = `Bearer ${config.announceApiKey}`;
    if (!config.announceApiKey || auth !== expected) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const body = req.body as { text?: unknown; target?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const target = typeof body.target === 'string' ? body.target : 'news';
    if (!text) return res.status(400).json({ error: 'text required' });

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
    if (!chatId) return res.status(400).json({ error: `target ${target} not configured` });

    try {
      const sent = await bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
      return res.json({ ok: true, message_id: sent.message_id });
    } catch (e) {
      log.error('announce API failed', { e: String(e) });
      return res.status(500).json({ error: String(e) });
    }
  });

  app.listen(config.port, () => {
    log.info(`server listening on :${config.port}`);
  });
}
