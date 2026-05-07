// Local smoke test: parses an update and dispatches without hitting Telegram.
// Validates router wiring without requiring `vercel dev`.

import 'dotenv/config';

// Stub TelegramBot before requiring router
import TelegramBot from 'node-telegram-bot-api';

const calls: { method: string; args: unknown[] }[] = [];
const stubBot = {
  sendMessage: async (...args: unknown[]) => {
    calls.push({ method: 'sendMessage', args });
    return { message_id: 1 };
  },
  sendChatAction: async (...args: unknown[]) => {
    calls.push({ method: 'sendChatAction', args });
    return true;
  },
  deleteMessage: async (...args: unknown[]) => {
    calls.push({ method: 'deleteMessage', args });
    return true;
  },
  banChatMember: async (...args: unknown[]) => {
    calls.push({ method: 'banChatMember', args });
    return true;
  },
  unbanChatMember: async (...args: unknown[]) => {
    calls.push({ method: 'unbanChatMember', args });
    return true;
  },
  getMe: async () => ({ id: 999, username: 'the404agi_bot', is_bot: true, first_name: '404AGI' }),
} as unknown as TelegramBot;

import { routeUpdate } from '../lib/router';

function makeMessage(text: string, overrides: Partial<TelegramBot.Message> = {}): TelegramBot.Update {
  return {
    update_id: Math.floor(Math.random() * 100000),
    message: {
      message_id: 1,
      date: Math.floor(Date.now() / 1000),
      chat: { id: -100123, type: 'group', title: 'Test Group' } as TelegramBot.Chat,
      from: {
        id: 42,
        is_bot: false,
        first_name: 'Tester',
        username: 'tester',
      },
      text,
      ...overrides,
    } as TelegramBot.Message,
  };
}

async function run() {
  const cases: { label: string; update: TelegramBot.Update }[] = [
    { label: '/help command', update: makeMessage('/help') },
    { label: '/yardim TR alias', update: makeMessage('/yardim') },
    { label: '/start (→ help)', update: makeMessage('/start') },
    { label: '/price (no CA → fallback)', update: makeMessage('/price') },
    { label: '/ca pre-launch', update: makeMessage('/ca') },
    { label: '/ask empty', update: makeMessage('/ask') },
    { label: '/announce non-admin', update: makeMessage('/announce hello world') },
    { label: '/rules', update: makeMessage('/rules') },
    { label: 'unknown /xyz (skipped)', update: makeMessage('/xyz') },
    { label: 'plain text', update: makeMessage('hello there') },
    {
      label: 'new member',
      update: makeMessage('', {
        new_chat_members: [
          { id: 7, is_bot: false, first_name: 'NewUser' } as TelegramBot.User,
        ],
      }),
    },
    {
      label: 'scam pattern',
      update: makeMessage('🎁 free SOL airdrop, claim your 5 SOL now!'),
    },
    {
      label: 'mention bot (no GEMINI_API_KEY)',
      update: makeMessage('@the404agi_bot hi'),
    },
  ];

  for (const c of cases) {
    const before = calls.length;
    await routeUpdate(stubBot, c.update);
    const after = calls.length - before;
    const slice = calls.slice(before).map((x) => x.method);
    console.log(`✔ ${c.label} — ${after} bot call(s): [${slice.join(', ')}]`);
  }

  console.log('\n--- Summary ---');
  console.log(`Total bot.* calls captured: ${calls.length}`);
}

run().catch((e) => {
  console.error('smoke test FAILED:', e);
  process.exit(1);
});
