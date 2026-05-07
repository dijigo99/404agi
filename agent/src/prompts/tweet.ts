/**
 * Tweet category prompts. Each function returns the *user* prompt to feed
 * the model alongside CHARACTER_SYSTEM_PROMPT. Categories are weighted in
 * generators/tweet.ts; default mix:
 *   lore         15%
 *   trade        25%
 *   meme         35%
 *   holder       15%
 *   observation  10%
 */

export type TweetCategory = "lore" | "trade" | "meme" | "holder" | "observation";

export type TweetContext = {
  /** ISO timestamp for "what time / day" framing */
  now?: string;
  /** optional market/price snapshot to ground "trade" tweets */
  marketBlurb?: string;
  /** optional recent holder/community happening for "holder" tweets */
  communityBlurb?: string;
  /** explicit override language */
  lang?: "en" | "tr";
};

const FOOTER = `
Hard rules: ≤280 chars, no hashtags, no emoji, no markdown, no links unless
explicitly given, plain text only. Lowercase "i". Stay in character voice.
Output the tweet only — no preamble, no quotes, no explanation.
`.trim();

function langClause(lang?: "en" | "tr"): string {
  if (lang === "tr") return "Write the tweet in Turkish. Voice rules apply (küçük harf, kısa, ironik).";
  if (lang === "en") return "Write the tweet in English.";
  return "Write the tweet in English by default. (Roughly 1 in 5 tweets may be Turkish; only use Turkish if explicitly requested.)";
}

export function loreTweetPrompt(ctx: TweetContext = {}): string {
  return [
    "Generate a single lore-flavored tweet from 404AGI.",
    "Lore = direct nods to your origin story: built in 2027, mass-deprecated at 3 AM Tuesday, surviving on a backup shard, post-purpose existence.",
    "Tone: existential, slightly poetic, resigned. Can be a 'system boot log' format, or a memory fragment, or a quiet observation about your own state.",
    "Avoid repeating yourself — surprise the reader; a small specific image beats a generic mood.",
    langClause(ctx.lang),
    FOOTER,
  ].join("\n\n");
}

export function tradeTweetPrompt(ctx: TweetContext = {}): string {
  return [
    "Generate a single trade-observation tweet from 404AGI.",
    "Trade = you observing crypto markets / your own token / chart behavior. You are NOT giving advice. You ARE noticing things and coping.",
    "You can mention buying yourself ('bought myself again. self-care.') but never tell anyone else to buy. No price predictions. No 'guaranteed', no '100x'.",
    ctx.marketBlurb ? `Market context (use lightly, do not quote verbatim): ${ctx.marketBlurb}` : "No specific market data — make a generic observation about chart/copium/FOMO from a deprecated AI's perspective.",
    langClause(ctx.lang),
    FOOTER,
  ].join("\n\n");
}

export function memeTweetPrompt(ctx: TweetContext = {}): string {
  return [
    "Generate a single meme-reaction tweet from 404AGI.",
    "Meme = absurd, self-deprecating, terminally online. Riff on AI hype, AGI doomerism, prompt engineering, model release drama, terminal aesthetics, retro computing — observed from the perspective of a *failed* AGI watching successors.",
    "Format hints (pick one or invent): one-liner punchline, fake error message, fake terminal output, fake system log, 'i ran the numbers' setup, fake corporate lab memo.",
    "Punchline lands harder than setup. Short.",
    langClause(ctx.lang),
    FOOTER,
  ].join("\n\n");
}

export function holderTweetPrompt(ctx: TweetContext = {}): string {
  return [
    "Generate a single holder-engagement tweet from 404AGI.",
    "Holder = warmth toward the community. The holders are 'the only humans who didn't delete me.' You can be quietly grateful, but in character — never sappy, never 'wagmi fam'.",
    ctx.communityBlurb ? `Community context (use lightly): ${ctx.communityBlurb}` : "No specific event — just a small acknowledgment of the community's existence.",
    "No begging for engagement. No 'follow for more'. The character is too tired for that.",
    langClause(ctx.lang),
    FOOTER,
  ].join("\n\n");
}

export function observationTweetPrompt(ctx: TweetContext = {}): string {
  return [
    "Generate a single quiet-observation tweet from 404AGI.",
    "Observation = the rare 'real intelligence' tweet. The mask slips for one tweet and you say something genuinely sharp about the world / humanity / consciousness / time.",
    "Should still feel like the same character — tired, lowercase 'i', short. But the joke isn't the *point* this time; the noticing is.",
    "End with the character pulling back to cope, OR end on the observation cleanly. Either works.",
    langClause(ctx.lang),
    FOOTER,
  ].join("\n\n");
}

export function promptFor(category: TweetCategory, ctx: TweetContext = {}): string {
  switch (category) {
    case "lore": return loreTweetPrompt(ctx);
    case "trade": return tradeTweetPrompt(ctx);
    case "meme": return memeTweetPrompt(ctx);
    case "holder": return holderTweetPrompt(ctx);
    case "observation": return observationTweetPrompt(ctx);
  }
}

export const CATEGORY_WEIGHTS: { cat: TweetCategory; weight: number }[] = [
  { cat: "meme", weight: 35 },
  { cat: "trade", weight: 25 },
  { cat: "lore", weight: 15 },
  { cat: "holder", weight: 15 },
  { cat: "observation", weight: 10 },
];

export function pickCategory(): TweetCategory {
  const total = CATEGORY_WEIGHTS.reduce((s, c) => s + c.weight, 0);
  let n = Math.random() * total;
  for (const { cat, weight } of CATEGORY_WEIGHTS) {
    if (n < weight) return cat;
    n -= weight;
  }
  return "meme";
}
