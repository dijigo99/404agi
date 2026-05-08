import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTokenBalance } from "@/lib/solana/balance";
import { tierFor, TIER_LIMITS, CONTRACT_ADDRESS } from "@/lib/config";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";
import { getRateLimiter, loadMemory, pushMemory } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  message: string;
  wallet?: string;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  const wallet = (body.wallet ?? "").trim();

  if (!message || message.length > 1000) {
    return NextResponse.json(
      { error: "Message must be 1–1000 chars" },
      { status: 400 }
    );
  }
  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet required" },
      { status: 401 }
    );
  }

  // Resolve tier from on-chain balance (skip if no CA yet — pre-launch demo)
  let tier: ReturnType<typeof tierFor> = "locked";
  let balance = 0;
  if (CONTRACT_ADDRESS) {
    try {
      balance = await getTokenBalance(wallet);
      tier = tierFor(balance);
    } catch {
      tier = "locked";
    }
  } else {
    // Pre-launch: anyone connected gets BASIC for demo purposes
    tier = "basic";
  }

  if (tier === "locked") {
    return NextResponse.json(
      {
        error: "TOKEN_REQUIRED",
        message: `you need to hold ${"$404"} to talk. buy first. cope later.`,
        tier,
      },
      { status: 402 }
    );
  }

  // Rate limit per wallet, per-tier daily quota
  const limit = TIER_LIMITS[tier].dailyMessages;
  const limiter = getRateLimiter(limit);
  if (limiter) {
    const r = await limiter.limit(wallet);
    if (!r.success) {
      return NextResponse.json(
        {
          error: "RATE_LIMITED",
          message: "you've hit your daily quota. hold more, talk more.",
          tier,
          reset: r.reset,
        },
        { status: 429 }
      );
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini key not configured" },
      { status: 500 }
    );
  }

  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  const history = await loadMemory(wallet);
  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let full = "";
      try {
        const result = await chat.sendMessageStream(message);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            full += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        // persist memory (fire and forget)
        await pushMemory(wallet, { role: "user", text: message });
        await pushMemory(wallet, { role: "model", text: full });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "agent took a break";
        controller.enqueue(encoder.encode(`\n[error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Tier": tier,
      "X-Balance": String(balance),
    },
  });
}
