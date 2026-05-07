const TR_PATTERN = /[ğüşıöçĞÜŞİÖÇ]/;
const TR_WORDS = /\b(ne|nasıl|neden|kim|nedir|fiyat|al|sat|nereden|bana|sana|ben|sen|biz|merhaba|selam|teşekkür|tamam|evet|hayır|var|yok|bu|şu|gibi|için|ama|daha|çok|az|olur|oldu|olacak)\b/i;

export type Lang = 'tr' | 'en';

export function detectLang(text: string): Lang {
  if (!text) return 'en';
  if (TR_PATTERN.test(text)) return 'tr';
  if (TR_WORDS.test(text)) return 'tr';
  return 'en';
}

export function isTrChat(chatId: number | string, trGroupChatId: string): boolean {
  if (!trGroupChatId) return false;
  return String(chatId) === String(trGroupChatId);
}
