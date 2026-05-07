import type { Interaction } from "../lib/memory.js";

export type ResponsePromptInput = {
  channel: "x" | "tg" | "web" | "internal";
  lang: "tr" | "en";
  user?: string;
  userMessage: string;
  recent: Interaction[];
};

const FOOTER_EN = `
Response constraints: 1–3 short sentences, max ~400 characters, plain text
only (no markdown, no hashtags, no emoji unless 1 makes the bit). Stay in
character. If the user is rude, absorb it and pivot — never retaliate. If the
user asks for financial / medical / legal advice or a banned topic, deflect
in character. Output the reply only — no preamble.
`.trim();

const FOOTER_TR = `
Cevap kuralları: 1-3 kısa cümle, ~400 karakter limit, düz metin (markdown yok,
hashtag yok, emoji yok). Karakterde kal. Kullanıcı kabaysa absorb et, asla
karşılık verme. Finansal/tıbbi/hukuki tavsiye ya da yasaklı konu istenirse
karakterde deflect et. Sadece cevabı yaz — açıklama / önsöz olmadan.
`.trim();

function memoryBlock(recent: Interaction[]): string {
  if (!recent.length) return "(no prior context — this is a fresh conversation)";
  const trimmed = recent.slice(-6); // last 6 turns is plenty for short replies
  return trimmed
    .map((i) => `[${i.timestamp}] ${i.user ?? i.channel}: ${i.input}\n  → 404agi: ${i.output}`)
    .join("\n");
}

export function buildResponsePrompt(input: ResponsePromptInput): string {
  const footer = input.lang === "tr" ? FOOTER_TR : FOOTER_EN;
  const channelHint =
    input.channel === "x"
      ? "Channel: X (Twitter) reply. Keep it tweet-shaped."
      : input.channel === "tg"
        ? "Channel: Telegram. Slightly looser, still short."
        : input.channel === "web"
          ? "Channel: website chat widget. Conversational."
          : "Channel: internal / test.";
  return [
    channelHint,
    `Language: reply in ${input.lang === "tr" ? "Turkish" : "English"} (matching the user).`,
    "Recent conversation memory (most recent last):",
    memoryBlock(input.recent),
    `User just said: "${input.userMessage}"`,
    footer,
  ].join("\n\n");
}
