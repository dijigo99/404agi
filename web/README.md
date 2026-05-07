# 404AGI / web

Landing site + token-gated AI chat for **404AGI ($404)** on Solana.
Domain: [`404agi.fun`](https://404agi.fun).

> AGI not found. Cope deployed.
> deprecated. not deleted.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + custom shadcn-style primitives + Framer Motion
- **Solana**: `@solana/wallet-adapter-react` + Phantom
- **AI**: `@google/generative-ai` (Gemini 2.5 Flash, streaming)
- **Memory + rate-limit**: Upstash Redis (`@upstash/redis`, `@upstash/ratelimit`)
- **Live data**: Dexscreener public API (10s polling)
- **Hosting**: Vercel + custom domain

## Local dev

```bash
cd web
npm install
cp .env.example .env.local      # fill in keys (see below)
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Var | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes (chat) | <https://aistudio.google.com/apikey> |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | post-launch | Empty pre-launch → UI shows "AWAITING DEPLOYMENT". |
| `NEXT_PUBLIC_HELIUS_RPC` | recommended | Falls back to public RPC if empty (rate-limited). |
| `NEXT_PUBLIC_DEPLOYER_WALLET` | yes | Public — shown in Tokenomics. |
| `NEXT_PUBLIC_MARKETING_WALLET` | yes | Public — shown in Tokenomics. |
| `NEXT_PUBLIC_AGENT_WALLET` | yes | Public — shown in Tokenomics. |
| `UPSTASH_REDIS_REST_URL` | yes (chat) | Auto-set by Vercel Upstash integration. |
| `UPSTASH_REDIS_REST_TOKEN` | yes (chat) | Auto-set by Vercel Upstash integration. |

The chat works without Redis (no memory + no rate-limit), but you'll get
prompt drift and abuse risk in production.

## Project structure

```
app/
  api/chat/route.ts        Gemini streaming endpoint (token-gated)
  chat/page.tsx            Fullscreen chat
  not-found.tsx            On-brand 404
  opengraph-image.tsx      Dynamic 1200x630 OG (Vercel OG)
  sitemap.ts, robots.ts
  page.tsx                 Single-page landing
  layout.tsx               Fonts + metadata + providers
components/
  ui/                      Button, Card, Dialog, Input, ScrollArea
  sections/                Top-bar, Hero, Ticker, Manifesto, Feed,
                           ChatSection, Tokenomics, HowToBuy,
                           Roadmap, Community, Footer
  chat/                    ChatPanel (streaming, tier-aware)
  wallet/                  WalletButton (Phantom modal)
  providers.tsx            ConnectionProvider + WalletProvider
lib/
  config.ts                SITE, SOCIALS, WALLETS, TIERS, CA, RPC
  utils.ts                 cn, shortAddress, formatUsd, formatCompact
  dexscreener.ts           fetchTokenStats (price/MC/vol/liquidity)
  redis.ts                 Upstash client + rate-limiter + chat memory
  agent/system-prompt.ts   Gemini character + placeholder feed
  solana/balance.ts        SPL token balance helper
  solana/use-token-balance Wallet-bound balance hook + tier resolution
```

## Tier system

| Tier | Threshold | Daily messages |
| --- | --- | --- |
| LOCKED | 0 | — (must hold to talk) |
| BASIC | 1+ $404 | 5 |
| POWER | 100K+ | unlimited |
| WHALE | 1M+ | priority |

Resolved server-side via on-chain SPL balance check on every request.
Pre-launch (no `NEXT_PUBLIC_CONTRACT_ADDRESS`), connected wallets get
BASIC for demo purposes.

## Vercel deploy

1. **Import the repo** in Vercel. Set the project root to `web/`.
2. **Add the Upstash Redis integration**
   (`Marketplace → Storage → Upstash Redis`). It populates
   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` automatically.
3. **Set env vars** from the table above (Project Settings → Environment Variables).
   At minimum:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_DEPLOYER_WALLET`, `NEXT_PUBLIC_MARKETING_WALLET`, `NEXT_PUBLIC_AGENT_WALLET`
   - `NEXT_PUBLIC_HELIUS_RPC` (Helius dashboard → free tier endpoint).
4. **Add the custom domain** `404agi.fun`. Vercel will issue DNS instructions.
   On GoDaddy:
   - Delete the parking A/AAAA records.
   - Add **A** record `@ → 76.76.21.21`.
   - Add **CNAME** `www → cname.vercel-dns.com`.
   - TTL: 600s for fast propagation.
5. **At launch** (after pump.fun deploy):
   - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the new mint.
   - Trigger a redeploy (it's a public env var → must rebuild).

The Top Bar and Live Ticker auto-flip from "AWAITING DEPLOYMENT" to live
data once the CA is set and Dexscreener has indexed the pair (~30–60s).

## Performance targets

- **Lighthouse 95+** for Performance, A11y, Best Practices, SEO (mobile + desktop).
- **LCP < 1.5s** on a fast connection.
- Mobile-first; verified at 375px.
- All animations respect `prefers-reduced-motion`.

## What we don't do

- No background music. No autoplay anything.
- No fake "AS SEEN ON" logos. No fake countdowns.
- No rocket emojis. No popup buy-now nags.
- No third-party tracking heavier than Plausible.
- No Discord embed. No Telegram floating widget.

This is a meme coin site that takes itself seriously about everything
*except* the meme.

## License

MIT for the code. The lore is open-source. The cope is mutual.
