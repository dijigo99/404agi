import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set in .env');
    process.exit(1);
  }
  const bot = new TelegramBot(token);
  const result = await bot.setMyCommands([
    { command: 'price', description: 'Current price & market cap' },
    { command: 'chart', description: 'Dexscreener chart link' },
    { command: 'buy', description: 'Jupiter swap link' },
    { command: 'ca', description: 'Contract address' },
    { command: 'ask', description: 'Talk to 404AGI (rate-limited)' },
    { command: 'help', description: 'Command list' },
    { command: 'rules', description: 'Group rules' },
  ]);
  console.log('setMyCommands result:', result);
}

main().catch((e) => {
  console.error('failed:', e);
  process.exit(1);
});
