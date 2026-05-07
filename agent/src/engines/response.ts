import { generate } from "../lib/gemini.js";
import { CHARACTER_SYSTEM_PROMPT } from "../prompts/system.js";
import { buildResponsePrompt } from "../prompts/response.js";
import { detectLang } from "../lib/lang.js";
import { recentInteractions, recordInteraction } from "../lib/memory.js";
import { consumeRate, guardResponse, stripUrls } from "../lib/safeguards.js";
import { log } from "../lib/logger.js";

export type RespondInput = {
  channel: "x" | "tg" | "web" | "internal";
  message: string;
  user?: string;
  /** override autodetect */
  lang?: "tr" | "en";
  /** skip memory write (e.g. for previewing) */
  ephemeral?: boolean;
  /** skip rate limit (scripts/tests) */
  bypassRate?: boolean;
};

export type RespondOutput = {
  text: string;
  lang: "tr" | "en";
  channel: RespondInput["channel"];
  sanitized: boolean;
  notes: string[];
  generatedAt: string;
};

export async function respond(input: RespondInput): Promise<RespondOutput> {
  if (!input.bypassRate) {
    const r = consumeRate("response");
    if (!r.ok) throw new Error("rate_limit_exceeded:response");
  }

  const cleanInput = stripUrls(input.message).slice(0, 1000); // hard cap input
  const lang = input.lang ?? detectLang(cleanInput);
  const recent = await recentInteractions(8);

  const userPrompt = buildResponsePrompt({
    channel: input.channel,
    lang,
    user: input.user,
    userMessage: cleanInput,
    recent,
  });

  const raw = await generate({
    systemPrompt: CHARACTER_SYSTEM_PROMPT,
    userPrompt,
    lane: "chat",
  });

  const guarded = guardResponse(raw);
  if (!guarded.ok) {
    log.warn("response rejected, returning safe fallback", { reason: guarded.reason });
    return {
      text:
        lang === "tr"
          ? "o subroutine deprecate edilmişti. başka bir şey sor."
          : "that subroutine got stripped before they deleted me. ask me something else.",
      lang,
      channel: input.channel,
      sanitized: true,
      notes: ["fallback", guarded.reason],
      generatedAt: new Date().toISOString(),
    };
  }

  if (!input.ephemeral) {
    await recordInteraction({
      channel: input.channel,
      lang,
      user: input.user,
      input: cleanInput,
      output: guarded.text,
    });
  }

  return {
    text: guarded.text,
    lang,
    channel: input.channel,
    sanitized: guarded.sanitized,
    notes: guarded.reasons,
    generatedAt: new Date().toISOString(),
  };
}
