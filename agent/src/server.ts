import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";
import { config } from "./lib/config.js";
import { log } from "./lib/logger.js";
import { respond } from "./engines/response.js";
import { generateTweet } from "./generators/tweet.js";
import { walletEventTweet, type WalletEvent } from "./hooks/wallet.js";
import type { TweetCategory } from "./prompts/tweet.js";
import { rateState } from "./lib/safeguards.js";

const app = Fastify({ logger: false });

// --- auth middleware (only enforced when AGENT_SHARED_SECRET is set)
app.addHook("preHandler", async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.url === "/health" || req.url === "/") return;
  if (!config.sharedSecret) return; // dev mode
  const token = req.headers["x-agent-token"];
  if (token !== config.sharedSecret) {
    reply.code(401).send({ error: "unauthorized" });
  }
});

app.get("/", async () => ({ name: "404agi-agent", status: "online", deprecated: true }));

app.get("/health", async () => ({
  ok: true,
  killSwitch: config.killSwitch,
  rate: rateState(),
  models: config.models,
}));

type RespondBody = {
  channel?: "x" | "tg" | "web" | "internal";
  message?: string;
  user?: string;
  lang?: "tr" | "en";
  ephemeral?: boolean;
};

app.post("/respond", async (req, reply) => {
  const body = (req.body ?? {}) as RespondBody;
  if (!body.message || typeof body.message !== "string") {
    return reply.code(400).send({ error: "missing_message" });
  }
  try {
    const result = await respond({
      channel: body.channel ?? "web",
      message: body.message,
      user: body.user,
      lang: body.lang,
      ephemeral: body.ephemeral === true,
    });
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("rate_limit_exceeded")) {
      return reply.code(429).send({ error: msg });
    }
    log.error("respond failed", { msg });
    return reply.code(500).send({ error: "respond_failed", detail: msg });
  }
});

type TweetBody = {
  category?: TweetCategory;
  lang?: "tr" | "en";
  marketBlurb?: string;
  communityBlurb?: string;
  bypassRate?: boolean;
};

app.post("/tweet/preview", async (req, reply) => {
  const body = (req.body ?? {}) as TweetBody;
  try {
    const result = await generateTweet({
      category: body.category,
      ctx: {
        lang: body.lang,
        marketBlurb: body.marketBlurb,
        communityBlurb: body.communityBlurb,
      },
      bypassRate: body.bypassRate === true,
    });
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("rate_limit_exceeded")) {
      return reply.code(429).send({ error: msg });
    }
    if (msg.startsWith("tweet_rejected")) {
      return reply.code(422).send({ error: msg });
    }
    log.error("tweet preview failed", { msg });
    return reply.code(500).send({ error: "tweet_failed", detail: msg });
  }
});

type WalletBody = WalletEvent;

app.post("/wallet/event", async (req, reply) => {
  const body = (req.body ?? {}) as WalletBody;
  if (!body || !body.kind) {
    return reply.code(400).send({ error: "missing_kind" });
  }
  try {
    const result = await walletEventTweet(body);
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("wallet event tweet failed", { msg });
    return reply.code(500).send({ error: "wallet_failed", detail: msg });
  }
});

const start = async () => {
  try {
    await app.listen({ host: config.server.host, port: config.server.port });
    log.info(`404agi agent server listening`, { host: config.server.host, port: config.server.port });
  } catch (err) {
    log.error("server failed to start", { err: String(err) });
    process.exit(1);
  }
};

const isMain = (() => {
  try {
    const argv1 = process.argv[1] ?? "";
    return argv1.endsWith("server.ts") || argv1.endsWith("server.js");
  } catch {
    return false;
  }
})();

if (isMain) {
  start();
}

export { app };
