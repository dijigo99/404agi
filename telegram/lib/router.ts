import TelegramBot from 'node-telegram-bot-api';
import { handlePrice } from './commands/price';
import { handleChart } from './commands/chart';
import { handleBuy } from './commands/buy';
import { handleCa } from './commands/ca';
import { handleHelp } from './commands/help';
import { handleAsk } from './commands/ask';
import { handleAnnounce } from './commands/announce';
import { handleRules } from './commands/rules';
import { handleNewMembers } from './handlers/welcome';
import { runModeration } from './handlers/moderation';
import { tryHandleMention } from './handlers/mention';
import { getBotInfo } from './botClient';
import { log } from './utils/logger';

type CommandFn = (bot: TelegramBot, msg: TelegramBot.Message) => Promise<void>;
type CommandWithArgFn = (bot: TelegramBot, msg: TelegramBot.Message, arg: string) => Promise<void>;

const SIMPLE_COMMANDS: Record<string, CommandFn> = {
  price: handlePrice,
  fiyat: handlePrice,
  chart: handleChart,
  grafik: handleChart,
  buy: handleBuy,
  al: handleBuy,
  ca: handleCa,
  help: handleHelp,
  yardim: handleHelp,
  start: handleHelp,
  rules: handleRules,
  kurallar: handleRules,
};

const ARG_COMMANDS: Record<string, CommandWithArgFn> = {
  ask: handleAsk,
  sor: handleAsk,
  announce: handleAnnounce,
};

interface ParsedCommand {
  name: string;
  rest: string;
}

function parseCommand(text: string): ParsedCommand | null {
  if (!text.startsWith('/')) return null;
  const m = text.match(/^\/([A-Za-z0-9_]+)(?:@([A-Za-z0-9_]+))?(?:\s+([\s\S]*))?$/);
  if (!m) return null;
  return { name: m[1].toLowerCase(), rest: (m[3] ?? '').trim() };
}

export async function routeUpdate(bot: TelegramBot, update: TelegramBot.Update): Promise<void> {
  const msg = update.message ?? update.edited_message ?? update.channel_post;
  if (!msg) return;

  // 1) New member welcome
  if (msg.new_chat_members && msg.new_chat_members.length > 0) {
    await handleNewMembers(bot, msg);
    return;
  }

  const text = msg.text ?? msg.caption ?? '';

  // 2) Commands (skip moderation for these — admins/users issuing commands shouldn't be moderated for the command itself)
  const parsed = parseCommand(text);
  if (parsed) {
    const simple = SIMPLE_COMMANDS[parsed.name];
    if (simple) {
      try {
        await simple(bot, msg);
      } catch (e) {
        log.error(`command ${parsed.name} failed`, { e: String(e) });
      }
      return;
    }
    const argCmd = ARG_COMMANDS[parsed.name];
    if (argCmd) {
      try {
        await argCmd(bot, msg, parsed.rest);
      } catch (e) {
        log.error(`command ${parsed.name} failed`, { e: String(e) });
      }
      return;
    }
    // unknown /command — fall through to moderation/mention handling
  }

  // 3) Moderation (group messages only — handler self-filters)
  await runModeration(bot, msg).catch((e) => log.error('moderation failed', { e: String(e) }));

  // 4) @mention or reply-to-bot AI handler
  try {
    const botInfo = await getBotInfo(bot);
    await tryHandleMention(bot, msg, botInfo);
  } catch (e) {
    log.error('mention handler failed', { e: String(e) });
  }
}
