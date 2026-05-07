import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set in .env');
    process.exit(1);
  }
  const bot = new TelegramBot(token);
  // Cast: typings don't expose options, but the underlying API accepts `drop_pending_updates`.
  const result = await (bot.deleteWebHook as (opts?: { drop_pending_updates?: boolean }) => Promise<boolean>)({
    drop_pending_updates: true,
  });
  console.log('deleteWebHook result:', result);
  const info = await bot.getWebHookInfo();
  console.log('webhookInfo after delete:', JSON.stringify(info, null, 2));
}

main().catch((e) => {
  console.error('failed:', e);
  process.exit(1);
});
