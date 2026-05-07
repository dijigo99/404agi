/**
 * Lightweight TR/EN detection. Pure heuristic — we don't need ML for two
 * languages with very different character distributions.
 *
 * Rules in order:
 *   1. Turkish-only chars (ç ğ ı ş ü, plus İ-mapping for "i with dot")
 *      → strong TR signal.
 *   2. High-frequency Turkish stopwords (bir, ve, için, çok, ama, ben, sen,
 *      mi, mı, değil, evet, hayır, naber, selam, kanka, kardeş, hocam) →
 *      TR signal.
 *   3. Otherwise → EN.
 *
 * Mixed input falls through to whichever signal accumulates more weight; ties
 * go to English (the default voice). Empty / very short input → EN.
 */

const TURKISH_CHARS = /[çğıöşüÇĞİÖŞÜ]/;

const TR_STOPWORDS = new Set([
  "bir",
  "ve",
  "için",
  "çok",
  "ama",
  "ben",
  "sen",
  "biz",
  "siz",
  "mi",
  "mı",
  "mu",
  "mü",
  "değil",
  "evet",
  "hayır",
  "naber",
  "selam",
  "merhaba",
  "kanka",
  "kardeş",
  "hocam",
  "abi",
  "abla",
  "lan",
  "ya",
  "yani",
  "neden",
  "nasıl",
  "nerede",
  "kim",
  "ne",
  "nedir",
  "olur",
  "olmaz",
  "tamam",
  "şimdi",
  "şu",
  "bu",
  "şey",
  "bence",
]);

export type Lang = "tr" | "en";

export function detectLang(input: string): Lang {
  const text = (input ?? "").trim();
  if (text.length < 2) return "en";

  let score = 0;
  if (TURKISH_CHARS.test(text)) score += 3;

  const tokens = text
    .toLowerCase()
    .split(/[\s.,!?;:()"'/\\\-—]+/)
    .filter(Boolean);

  for (const t of tokens) {
    if (TR_STOPWORDS.has(t)) score += 1;
  }

  // suffix patterns: -lar/-ler, -dir, -dim, -mış/-miş, -yor
  const suffixHits = (text.match(/\b\w+(lar|ler|dir|dım|dim|dum|düm|mış|miş|muş|müş|yor)\b/gi) ?? []).length;
  score += Math.min(suffixHits, 3);

  return score >= 2 ? "tr" : "en";
}
