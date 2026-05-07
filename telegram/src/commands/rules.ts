import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { rulesEn, rulesTr } from '../content/welcome';
import { isTrChat } from '../utils/lang';

export async function handleRules(bot: TelegramBot, msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const text = isTrChat(chatId, config.trGroupChatId) ? rulesTr() : rulesEn();
  await bot.sendMessage(chatId, text);
}
