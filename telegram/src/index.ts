import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { log } from './utils/logger';
import { handlePrice } from './commands/price';
import { handleChart } from './commands/chart';
import { handleBuy } from './commands/buy';
import { handleCa } from './commands/ca';
import { handleHelp } from './commands/help';
import { handleAsk } from './commands/ask';
import { handleAnnounce } from './commands/announce';
import { handleRules } from './commands/rules';
import { attachWelcome } from './handlers/welcome';
import { attachModeration } from './handlers/moderation';
import { attachMentionHandler, setBotUsername } from './handlers/mention';
import { startBuyAlert } from './services/buyAlert';
import { startServer } from './server';

async function main() {
  const bot = new TelegramBot(config.botToken, { polling: true });

  const me = await bot.getMe();
  log.info('bot online', { username: me.username, id: me.id });
  if (me.username) setBotUsername(me.username);

  // === Commands ===
  // EN
  bot.onText(/^\/price(?:@\w+)?$/, (msg) => void handlePrice(bot, msg));
  bot.onText(/^\/chart(?:@\w+)?$/, (msg) => void handleChart(bot, msg));
  bot.onText(/^\/buy(?:@\w+)?$/, (msg) => void handleBuy(bot, msg));
  bot.onText(/^\/ca(?:@\w+)?$/, (msg) => void handleCa(bot, msg));
  bot.onText(/^\/help(?:@\w+)?$/, (msg) => void handleHelp(bot, msg));
  bot.onText(/^\/start(?:@\w+)?$/, (msg) => void handleHelp(bot, msg));
  bot.onText(/^\/rules(?:@\w+)?$/, (msg) => void handleRules(bot, msg));

  // TR aliases
  bot.onText(/^\/fiyat(?:@\w+)?$/, (msg) => void handlePrice(bot, msg));
  bot.onText(/^\/grafik(?:@\w+)?$/, (msg) => void handleChart(bot, msg));
  bot.onText(/^\/al(?:@\w+)?$/, (msg) => void handleBuy(bot, msg));
  bot.onText(/^\/yardim(?:@\w+)?$/, (msg) => void handleHelp(bot, msg));
  bot.onText(/^\/kurallar(?:@\w+)?$/, (msg) => void handleRules(bot, msg));

  // /ask <text>
  bot.onText(/^\/ask(?:@\w+)?\s*(.*)$/s, (msg, match) => {
    const prompt = (match?.[1] ?? '').trim();
    void handleAsk(bot, msg, prompt);
  });
  bot.onText(/^\/sor(?:@\w+)?\s*(.*)$/s, (msg, match) => {
    const prompt = (match?.[1] ?? '').trim();
    void handleAsk(bot, msg, prompt);
  });

  // /announce <text>  (admin only)
  bot.onText(/^\/announce(?:@\w+)?\s*([\s\S]*)$/, (msg, match) => {
    const text = (match?.[1] ?? '').trim();
    void handleAnnounce(bot, msg, text);
  });

  // === Handlers ===
  attachWelcome(bot);
  attachModeration(bot);
  attachMentionHandler(bot, me.id);

  // === Background ===
  startBuyAlert(bot);

  // === HTTP server (healthcheck + announce API) ===
  startServer(bot);

  // Set bot commands menu
  await bot
    .setMyCommands([
      { command: 'price', description: 'Current price & market cap' },
      { command: 'chart', description: 'Dexscreener chart link' },
      { command: 'buy', description: 'Jupiter swap link' },
      { command: 'ca', description: 'Contract address' },
      { command: 'ask', description: 'Talk to 404AGI (rate-limited)' },
      { command: 'help', description: 'Command list' },
      { command: 'rules', description: 'Group rules' },
    ])
    .catch((e) => log.warn('setMyCommands failed', { e: String(e) }));

  // Polling errors
  bot.on('polling_error', (e) => log.error('polling error', { e: String(e) }));
  bot.on('webhook_error', (e) => log.error('webhook error', { e: String(e) }));

  // Graceful shutdown
  const shutdown = (sig: string) => {
    log.info(`received ${sig}, shutting down`);
    void bot.stopPolling().finally(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((e) => {
  log.error('fatal', { e: String(e) });
  process.exit(1);
});
