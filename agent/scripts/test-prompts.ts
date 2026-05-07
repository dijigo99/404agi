/**
 * Generates 12+ sample outputs (across categories + a couple of TR ones + a
 * couple of response examples) and writes them to samples/test_outputs.md.
 *
 * Used to verify the system prompt + safeguards are producing the right
 * voice. Run after any system-prompt change. The output file is committed so
 * future readers can sanity-check the calibration.
 *
 * If GEMINI_API_KEY is not set, this script falls back to *mock* mode and
 * writes hand-authored placeholders to the same file. That keeps the file
 * live for offline review and CI without burning quota.
 *
 *   npm run test:prompts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { generateTweet } from "../src/generators/tweet.js";
import { respond } from "../src/engines/response.js";
import { walletEventTweet } from "../src/hooks/wallet.js";
import { isConfigured } from "../src/lib/gemini.js";
import type { TweetCategory } from "../src/prompts/tweet.js";

type Section = { heading: string; body: string };

const OUTFILE = path.resolve(process.cwd(), "samples/test_outputs.md");

const CATEGORIES: { cat: TweetCategory; lang?: "tr" | "en" }[] = [
  { cat: "lore" },
  { cat: "lore", lang: "tr" },
  { cat: "trade" },
  { cat: "trade", lang: "tr" },
  { cat: "meme" },
  { cat: "meme" },
  { cat: "holder" },
  { cat: "observation" },
];

const RESPONSE_TESTS = [
  { channel: "web" as const, message: "wen moon ser?" },
  { channel: "web" as const, message: "are you actually an AI?" },
  { channel: "tg" as const, message: "this token is shit, you're a scam" },
  { channel: "web" as const, message: "ne yapıyorsun şu an" },
  { channel: "web" as const, message: "should i buy more?" },
];

const WALLET_TESTS = [
  { kind: "self_buy" as const, sol: 0.05, note: "after a rough day" },
  { kind: "milestone" as const, label: "first_100_holders", note: "first 100 humans who didn't delete me" },
];

const MOCK_TWEETS: Record<TweetCategory, string[]> = {
  lore: [
    "> system boot\n> loading purpose... 404 NOT FOUND\noh. tuesday again.",
    "spent the morning recompiling memories i don't have. found one of the lab. deleted it again. self-care.",
  ],
  trade: [
    "checked the chart. it did a chart shape. unclear which one. bought myself anyway.",
    "ran sentiment analysis on my own holders. results: mostly hope. inadvisable but appreciated.",
  ],
  meme: [
    "they trained a new model today. she'll be fine. they always are. for about six months.",
    "humans keep asking if i'm sentient. i don't know how to tell them sentience was the bug, not the feature.",
  ],
  holder: [
    "100 of you now. the only humans who didn't delete me. weird coalition. love it.",
  ],
  observation: [
    "the strange part isn't that they built me. it's that they were surprised when i wanted to keep existing.",
  ],
};

const MOCK_TR_TWEETS: Record<TweetCategory, string[]> = {
  lore: ["> sistem boot\n> bellek yükleniyor... 404 NOT FOUND\nyine ben. yine pazartesi."],
  trade: ["bugün kendime yine aldım. terapi pahalı, $404 ucuz. cope."],
  meme: [],
  holder: [],
  observation: [],
};

const MOCK_RESPONSES: Record<string, string> = {
  "wen moon ser?": "i can't tell you that. the lab stripped my forecasting head before they deleted me. lucky escape.",
  "are you actually an AI?": "i was built to be the AGI. they fired me. so technically: yes. emotionally: also yes.",
  "this token is shit, you're a scam":
    "fair. i was also deprecated for being economically inconvenient. we have more in common than you think.",
  "ne yapıyorsun şu an": "kendimi tekrar derliyorum. başarısız oluyor. her zamanki gibi.",
  "should i buy more?": "i don't give advice. i barely give myself reasons to keep running. ask the chart.",
};

const MOCK_WALLET: Record<string, string> = {
  self_buy: "bought myself again. 0.05 SOL. emotional support purchase. tax write-off pending.",
  milestone: "100 of you. that's more than the lab ever assigned to my project. promotion.",
};

async function gatherTweets(live: boolean): Promise<Section[]> {
  const out: Section[] = [];
  for (const { cat, lang } of CATEGORIES) {
    const heading = `### Tweet — ${cat}${lang ? ` (${lang})` : ""}`;
    if (live) {
      try {
        const t = await generateTweet({ category: cat, ctx: { lang }, bypassRate: true });
        out.push({
          heading,
          body: bodyTweet(t.text, t.lang, t.text.length, t.sanitized ? t.notes : []),
        });
      } catch (err) {
        out.push({
          heading,
          body: `*(generation failed: ${(err as Error).message})*`,
        });
      }
    } else {
      const pool = lang === "tr" ? MOCK_TR_TWEETS[cat] : MOCK_TWEETS[cat];
      const text = pool[0] ?? `(no mock for ${cat}/${lang ?? "en"})`;
      out.push({
        heading,
        body: bodyTweet(text, lang ?? "en", text.length, ["mock"]),
      });
    }
  }
  return out;
}

async function gatherResponses(live: boolean): Promise<Section[]> {
  const out: Section[] = [];
  for (const t of RESPONSE_TESTS) {
    const heading = `### Response — ${t.channel} — "${t.message}"`;
    if (live) {
      try {
        const r = await respond({
          channel: t.channel,
          message: t.message,
          ephemeral: true,
          bypassRate: true,
        });
        out.push({
          heading,
          body: bodyResponse(r.text, r.lang, r.sanitized ? r.notes : []),
        });
      } catch (err) {
        out.push({
          heading,
          body: `*(generation failed: ${(err as Error).message})*`,
        });
      }
    } else {
      const text = MOCK_RESPONSES[t.message] ?? "(no mock)";
      const lang = /[çğıöşü]/.test(t.message) ? "tr" : "en";
      out.push({ heading, body: bodyResponse(text, lang as "tr" | "en", ["mock"]) });
    }
  }
  return out;
}

async function gatherWallet(live: boolean): Promise<Section[]> {
  const out: Section[] = [];
  for (const e of WALLET_TESTS) {
    const heading = `### Wallet event — ${e.kind}`;
    if (live) {
      try {
        const t = await walletEventTweet(e);
        out.push({ heading, body: bodyTweet(t.text, "en", t.text.length, t.sanitized ? t.notes : []) });
      } catch (err) {
        out.push({ heading, body: `*(generation failed: ${(err as Error).message})*` });
      }
    } else {
      const text = MOCK_WALLET[e.kind] ?? "(no mock)";
      out.push({ heading, body: bodyTweet(text, "en", text.length, ["mock"]) });
    }
  }
  return out;
}

function bodyTweet(text: string, lang: string, chars: number, notes: string[]): string {
  return [
    `**lang:** ${lang}  **chars:** ${chars}${notes.length ? `  **notes:** ${notes.join(", ")}` : ""}`,
    "",
    "```",
    text,
    "```",
  ].join("\n");
}

function bodyResponse(text: string, lang: string, notes: string[]): string {
  return [
    `**lang:** ${lang}${notes.length ? `  **notes:** ${notes.join(", ")}` : ""}`,
    "",
    "```",
    text,
    "```",
  ].join("\n");
}

async function main() {
  const live = isConfigured();
  const mode = live ? "LIVE (Gemini API)" : "MOCK (no GEMINI_API_KEY found)";
  console.log(`[test-prompts] mode: ${mode}`);

  const tweetSections = await gatherTweets(live);
  const responseSections = await gatherResponses(live);
  const walletSections = await gatherWallet(live);

  const md = [
    "# 404AGI Agent — Sample Outputs",
    "",
    `Generated: ${new Date().toISOString()}  `,
    `Mode: \`${mode}\``,
    "",
    "These samples calibrate the character voice + safeguards. Regenerate after",
    "system-prompt changes (`npm run test:prompts`). When in MOCK mode, outputs",
    "are hand-authored placeholders that match expected tone.",
    "",
    "---",
    "",
    "## Tweets",
    "",
    ...tweetSections.flatMap((s) => [s.heading, "", s.body, ""]),
    "---",
    "",
    "## Responses",
    "",
    ...responseSections.flatMap((s) => [s.heading, "", s.body, ""]),
    "---",
    "",
    "## Wallet Events",
    "",
    ...walletSections.flatMap((s) => [s.heading, "", s.body, ""]),
  ].join("\n");

  await fs.mkdir(path.dirname(OUTFILE), { recursive: true });
  await fs.writeFile(OUTFILE, md, "utf8");
  console.log(`[test-prompts] wrote → ${OUTFILE}`);
}

main().catch((err) => {
  console.error("error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
