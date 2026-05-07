import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: npm run webhook:set <https://your-vercel-url/api/webhook>');
    process.exit(1);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set in .env');
    process.exit(1);
  }

  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.warn(
      '⚠️  WEBHOOK_SECRET not set — webhook will be unauthenticated. Set one for production.',
    );
  }

  const bot = new TelegramBot(token);
  // `drop_pending_updates` is a valid Telegram API field but missing from this version's typings.
  const opts = {
    secret_token: secret || undefined,
    allowed_updates: ['message', 'edited_message', 'channel_post', 'callback_query'],
    drop_pending_updates: true,
  } as Parameters<typeof bot.setWebHook>[1];
  const result = await bot.setWebHook(url, opts);
  console.log('setWebhook result:', result);

  const info = await bot.getWebHookInfo();
  console.log('webhookInfo:', JSON.stringify(info, null, 2));

  const me = await bot.getMe();
  console.log(`bot @${me.username} (id=${me.id}) — webhook → ${url}`);
}

main().catch((e) => {
  console.error('failed:', e);
  process.exit(1);
});
