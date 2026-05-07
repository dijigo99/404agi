# PROGRESS — Canlı Durum

**Son güncelleme**: 2026-05-08 00:11 (TG Vercel webhook conversion bitti — typecheck + smoke test PASS, deploy hazır)

---

## Aktif Session'lar

| Session | Worktree | Durum | Sahibi |
|---|---|---|---|
| Ana Beyin | flamboyant-boyd-c5acf4 | 🟢 Aktif | — |
| Branding | flamboyant-boyd-c5acf4 | ✅ Bitti | branding session |
| Web App | flamboyant-boyd-c5acf4 | ✅ Bitti (build geçti, Vercel deploy beklemede) | web session |
| Telegram Bot | flamboyant-boyd-c5acf4 | ✅ Bitti (polling) | telegram session |
| TG Vercel Conv | flamboyant-boyd-c5acf4 | ✅ Bitti (webhook hazır, deploy edilebilir) | tg vercel session |
| AI Agent | flamboyant-boyd-c5acf4 | ✅ Bitti (kod commit'li) | agent session |
| Marketing | flamboyant-boyd-c5acf4 | ✅ Bitti | marketing session |

---

## Tamamlanan (Ana Beyin — kullanıcı uyurken)

- [x] Master plan yazıldı
- [x] Session yapısı kuruldu
- [x] Paylaşılan dosyalar (MASTER_PLAN, PROGRESS, DECISIONS)
- [x] **İsim + Ticker**: 404AGI / $404
- [x] **Karakter**: Failed AGI (deprecated, depresif, meme trader)
- [x] **LAUNCH_TIMELINE.md** — saat saat detaylı plan (Faz 0-7)
- [x] **WEBSITE_SPEC.md** — profesyonel site tam spec (tasarım, bölümler, tech stack, kalite gereksinimleri)
- [x] **PRE_LAUNCH_CHECKLIST.md** — kritik / yüksek / orta öncelik kalemler + senaryo planları
- [x] **5 işçi session brief'i hazır**:
  - BRANDING_BRIEF.md
  - WEB_APP_BRIEF.md
  - AGENT_BRIEF.md
  - TELEGRAM_BRIEF.md
  - MARKETING_BRIEF.md

---

## Devam Eden

### Branding ✅ (2026-05-07 22:20)
- [x] Logo prompt'ları (5 varyant) → `branding/LOGO_PROMPTS.md`
- [x] Renk paleti onay (değişiklik yok) → `branding/COLOR_PALETTE.md`
- [x] Tagline final: "AGI not found. Cope deployed." + ikincil: "deprecated. not deleted." → `branding/TAGLINE.md`
- [x] Lore / Origin Story (103 kelime, EN) → `branding/LORE.md`
- [x] X bio + 3 pinned tweet varyantı + 5 tweet planı → `branding/X_CONTENT.md`
- [x] TG içerikleri (ana/TR/kanal desc + welcome msg + kurallar) → `branding/TELEGRAM_CONTENT.md`
- [x] Meme prompt kütüphanesi (15 prompt + tweet metni) → `branding/MEME_PROMPTS.md`

### Marketing ✅ (2026-05-07 22:46)
- [x] KOL listesi (10 EN + 10 TR mikro arketip + filtre kriterleri + DM sıra stratejisi) → `marketing/kol_list.md`
- [x] DM template'leri (EN soft + EN paid + TR soft + TR paid + post-launch momentum + yanıt cevapları) → `marketing/dm_templates.md`
- [x] Build-in-public thread (5 tweet EN + Versiyon A/B sonuca göre + devam template) → `marketing/build_in_public_thread.md`
- [x] Raid metinleri (TG kısa/uzun EN+TR + Reddit yorum + 4chan OP 3 varyant) → `marketing/raid_messages.md`
- [x] Launch günü tweet planı (T-6h ila T+24h, 22 tweet, zamanlı + meme refs + stats placeholder) → `marketing/launch_day_tweets.md`
- [x] Reddit/platform postları (r/CryptoMoonShots + r/SatoshiStreetBets + 4chan + DexTools/Screener desc + CoinGecko/CMC + Show HN) → `marketing/reddit_posts.md`
- [x] FAQ (10 EN + 3 TR kritik soru, karakter tonunda) → `marketing/faq.md`
- [x] Reactive replies (rug/team/$404/AI/buy/FUD/skeptik/bug/rakam/exchange + 10 silahlı meme one-liner, EN+TR) → `marketing/reactive_replies.md`
- [x] **Strateji**: ORGANİC ONLY — paid KOL yok, build-in-public, $200 bütçe disiplini, transparency-first
- [ ] **Manuel adım** (kullanıcı): KOL keyword araması yap, gerçek 20 handle topla → `kol_list.md`'deki arketipleri değiştir
- [ ] **Manuel adım** (kullanıcı): T-6h'de DM kampanyası başlat
- [ ] **Launch öncesi**: tüm `[CA]` placeholder'lar gerçek contract adresi ile değiştir
- [ ] **Launch günü**: `launch_day_tweets.md` saatlerine göre tweet zamanlama

### AI Agent ✅ (2026-05-07 22:55)
- [x] Node.js + TypeScript skeleton (`/agent`)
- [x] Stack: `@google/generative-ai` + `fastify` + `dotenv` + `tsx`
- [x] **Sistem promptu** (`agent/src/prompts/system.ts`) — Failed AGI karakteri, lore canon, hard rules (politik/dini/identity/financial promise/self-harm yasak), tonal guide, TR/EN dil kuralı, output constraints
- [x] **Tweet generator** (`agent/src/generators/tweet.ts`) — kategoriler: meme(35%) / trade(25%) / lore(15%) / holder(15%) / observation(10%); `gemini-2.0-flash`; **log-only**, asla post etmiyor (`.logs/tweets.jsonl`)
- [x] **Response engine** (`agent/src/engines/response.ts`) — TR/EN auto-detect (`lib/lang.ts`), memory inject (last 8), safeguards, in-character fallback; `gemini-2.5-flash`
- [x] **HTTP server** (`agent/src/server.ts`) — Fastify, endpoints: `POST /respond`, `POST /tweet/preview`, `POST /wallet/event`, `GET /health`. `X-Agent-Token` shared-secret auth (prod), open in dev
- [x] **Wallet activity hook** (`agent/src/hooks/wallet.ts`) — `self_buy` / `tip_received` / `milestone` / `balance_low` event'leri → in-character tweet
- [x] **Memory** (`agent/src/lib/memory.ts`) — JSON-backed last-50 interactions + milestones, swap-ready (KV/Redis için tek dosya)
- [x] **Safeguards** (`agent/src/lib/safeguards.ts`) — banned topics regex (politika/din/identity/slur/self-harm/financial promise/financial advice), output sanitizer (hashtag/markdown/emoji/280-char strip), rate limit (4 tweet + 10 response/saat), kill switch (`AGENT_KILL_SWITCH=1`)
- [x] **CLI scripts**: `npm run tweet:gen`, `npm run wallet:tweet`, `npm run test:prompts`
- [x] **Sample outputs** — el-yazımı kanonik kalibrasyon (`agent/samples/test_outputs.md`, 15+ örnek: 8 tweet + 5 response + 2 wallet event); script `samples/live_run.md`'ye yazıyor (gitignored)
- [x] `npm run typecheck` PASS, safeguards smoke test PASS
- [x] Comprehensive `agent/README.md` (kurulum, env vars, HTTP API, safety model, deploy)
- [ ] **Manuel adım** (kullanıcı): `GEMINI_API_KEY` `.env`'e koy → `npm run test:prompts` ile live çıktıları gör
- [ ] **Web app session'a ver**: response endpoint URL → `/api/chat` proxy ile çağıracak
- [ ] **Launch sonrası**: tweet log → manuel queue veya X API publisher (bu service kapsamı dışı)

### Web App ✅ (2026-05-07 23:45)
- [x] Next.js 14 (App Router) + TypeScript skeleton (`/web`)
- [x] Stack: Tailwind + shadcn-style primitives + lucide-react + Framer Motion alternatif (CSS keyframes ile glitch/scanline/typewriter)
- [x] **Solana**: `@solana/wallet-adapter-react` + Phantom + WalletModal, `ConnectionProvider` ile
- [x] **AI**: `@google/generative-ai` (Gemini 2.5 Flash, streaming) — `app/api/chat/route.ts`
- [x] **Memory + rate-limit**: `@upstash/redis` + `@upstash/ratelimit` (sliding-window per wallet, last-20 msg memory, 7d TTL)
- [x] **Live data**: Dexscreener public API client (10s polling, fallback "AWAITING DEPLOYMENT")
- [x] **SPL balance**: `lib/solana/balance.ts` — server-side `getParsedTokenAccountsByOwner`, tier resolution (LOCKED/BASIC/POWER/WHALE)
- [x] **Design system** — bg `#0a0a0a` / accent `#00ff41` / error `#ff3b30` / glitch `#ff00ff`/`#00ffff`, JetBrains Mono + Inter + Space Grotesk (next/font, self-hosted), CRT scanlines + dot-grid + caret blink + glitch-skew utilities
- [x] **10 bölüm landing** (single-page): Top Bar (sticky, CA copy, mini ticker) → Hero (404 ASCII art + glitch + typewriter tagline + CTA) → Live Ticker (4 metric, 10s refresh) → Manifesto (lore typewriter, on-scroll reveal) → Agent Feed (5 placeholder tweet) → **Token-Gated Chat** (tier'lar, streaming, Quick prompts) → Tokenomics (BURNED rozetleri, public wallet'lar) → How To Buy (3 step → Jupiter) → Roadmap (parodi + hover real) → Community (X/TG/GitHub) → Footer + disclaimer
- [x] **Sub-routes**: `/chat` (fullscreen) + `/not-found` (on-brand 404 ASCII)
- [x] **SEO**: `app/opengraph-image.tsx` (dinamik 1200x630 Vercel OG, edge runtime), `sitemap.ts`, `robots.ts`, full metadata + Twitter card
- [x] **A11y**: ARIA labels, keyboard nav, focus-visible accent ring, `prefers-reduced-motion` tüm animasyonları kesiyor, decorative ASCII `aria-label`
- [x] **Mobile-first**: Container responsive, 375px hedefli, Top Bar collapse, grid breakpoints (sm/md/lg)
- [x] `npm run build` PASS — Landing First Load 197 kB / chat 192 kB / static prerendered
- [x] `.env.example` + comprehensive `web/README.md` (kurulum, env, Vercel deploy + GoDaddy DNS adımları)
- [x] **Pre-launch davranış**: `NEXT_PUBLIC_CONTRACT_ADDRESS` empty → ticker "AWAITING DEPLOYMENT", chat connected wallet'lara BASIC tier verir (demo)
- [x] **Post-launch davranış**: CA env set + Vercel redeploy → ticker live, gerçek SPL balance ile tier resolve
- [ ] **Manuel adım** (kullanıcı): Vercel'e import (root: `web/`) + Upstash Redis Marketplace integration ekle
- [ ] **Manuel adım** (kullanıcı): Env vars set (`GEMINI_API_KEY`, `NEXT_PUBLIC_HELIUS_RPC`, 3 wallet adresi)
- [ ] **Manuel adım** (kullanıcı): GoDaddy DNS → A `@ → 76.76.21.21`, CNAME `www → cname.vercel-dns.com`
- [ ] **Launch anı**: `NEXT_PUBLIC_CONTRACT_ADDRESS` set + redeploy (~30s)
- [ ] **Agent session entegrasyonu**: web şu an Gemini'yi direct çağırıyor (`/api/chat`); agent worker `/respond` endpoint'i hazırsa ileride proxy edilebilir

### Telegram Bot ✅ (2026-05-07 22:36)
- [x] Node.js + TypeScript skeleton (`/telegram`)
- [x] Stack: `node-telegram-bot-api` + `@google/generative-ai` + `express`
- [x] EN komutlar: `/price` `/chart` `/buy` `/ask` `/ca` `/help` `/rules` `/announce`
- [x] TR aliasları: `/fiyat` `/grafik` `/al` `/sor` `/yardim` `/kurallar`
- [x] Bot komut menüsü (`setMyCommands`) auto-yüklenir
- [x] Dexscreener servisi (fiyat snapshot + multi-pair fetch)
- [x] Gemini servisi (sistem promptu — failed AGI karakteri, hard rules, TR/EN otomatik dil)
- [x] Rate limit (per-user saatte 5 ask + mention, in-memory bucket)
- [x] Buy alert (Dexscreener `txns.h1` polling, $50+ ortalama → ana grup)
- [x] Anti-spam (link/emoji bombası/dup detection + scam pattern + CAS protection)
- [x] Welcome handler (TR/EN chat-based, CAS banlı kullanıcı kick)
- [x] @mention + reply-to-bot AI handler (rate limit dahil)
- [x] HTTP server: `GET /healthz` + `POST /announce` (Bearer auth, target main/tr/news)
- [x] Dockerfile + Procfile + railway.json + comprehensive README
- [x] `npm run build` temiz (typecheck PASS, no errors)
- [ ] **Manuel adım** (kullanıcı): @BotFather'da bot oluştur, token + chat ID'ler env'e
- [x] **REFACTOR (2026-05-08 00:11)**: Vercel webhook moduna çevrildi (aşağı bak)
- [ ] **Launch sonrası**: `CONTRACT_ADDRESS` env set → buy alert canlı

### TG Vercel Webhook Conversion ✅ (2026-05-08 00:11)
- [x] Yeni yapı: `telegram/api/` (Vercel functions) + `telegram/lib/` (saf fonksiyonlar)
- [x] **Endpoints**:
  - `POST /api/webhook` — Telegram update entry, `secret_token` header doğrulaması
  - `GET /api/healthz` — health check
  - `POST /api/announce` — cross-service Bearer auth (mevcut davranış aynen)
  - `GET /api/cron/buy-alert` — Vercel Cron (her dakika, Pro plan), Bearer `CRON_SECRET`
- [x] **Router** (`lib/router.ts`) — manuel command parse + dispatch (ask/price/chart/buy/ca/help/rules/announce + TR aliases), welcome / moderation / mention handler'larını sırayla çağırır
- [x] **Polling kaldırıldı** — `node-telegram-bot-api` sadece sender (no-polling singleton)
- [x] **State stateless'e taşındı** — Upstash Redis backed:
  - `rl:ask:<userId>` (saatlik counter, INCR + EXPIRE)
  - `mod:dup:<userId>` (sorted set, son 5dk hash'leri)
  - `buyalert:pair:<addr>` (TTL 6h pair state)
  - KV yoksa local in-memory fallback
- [x] **Webhook setup script'leri**: `npm run webhook:set <url>`, `npm run webhook:delete`, `npm run commands:set`
- [x] **Smoke test** (`npm run smoke`) — 13 senaryo geçer (commands, mention, scam, welcome, moderation), Telegram'a hiç dokunmadan router unit-tests
- [x] **Eski dosyalar silindi** — `src/`, `Dockerfile`, `Procfile`, `railway.json` (git history'de var: commit `c15a403`)
- [x] **Yeni env'ler**: `WEBHOOK_SECRET`, `CRON_SECRET`, `BOT_USERNAME`, `UPSTASH_REDIS_REST_URL`, `_TOKEN`
- [x] **Kaldırılan env'ler**: `PORT`, `BUY_ALERT_POLL_MS` (cron schedule'ı `vercel.json`'da)
- [x] `npm run typecheck` PASS, `npm run smoke` PASS
- [x] `README.md` Vercel deploy adımlarıyla yeniden yazıldı (mimari diagram + checklist)
- [ ] **Manuel adım** (kullanıcı): `vercel link` + `vercel --prod`, env'leri Dashboard'da set et
- [ ] **Manuel adım** (kullanıcı): Upstash Redis Marketplace'ten bağla
- [ ] **Manuel adım** (kullanıcı): `npm run webhook:set <prod-url>/api/webhook`
- [ ] **Manuel adım** (kullanıcı): Vercel Pro plan gerek (Hobby cron sadece günlük) — yoksa cron schedule `0 * * * *` yap

---

## Sıradaki (kullanıcı uyandığında)

### Önce kullanıcı (1-2 saat manuel)
1. Domain al — `404agi.fun`
2. X hesabı aç — `@404agi`
3. Telegram 3 entity (ana, TR, kanal)
4. Phantom + 0.5 SOL
5. Anthropic API key + $50 kredi
6. GitHub repo — public

### Sonra paralel session'lar başlar
- **Branding session** → BRANDING_BRIEF.md ile
- **Web App session** → WEB_APP_BRIEF.md ile
- **AI Agent session** → AGENT_BRIEF.md ile
- **Telegram Bot session** → TELEGRAM_BRIEF.md ile
- **Marketing session** → MARKETING_BRIEF.md ile

Bağımlılık: Web App → Branding (lore + logo bekler). Diğerleri paralel.

---

## Bloker'lar

- ✅ Domain alındı: **404agi.fun** (GoDaddy)
- ✅ Telegram duyuru kanalı: `@the404agi_news`
- ✅ Telegram ana grup: **`@the404agi`** (https://t.me/the404agi)
- ✅ X hesabı: **`@404agi_coin`**
- ✅ GitHub repo: **`github.com/dijigo99/404agi`** (public)
- ✅ Phantom cüzdan: `@404agiwallet` — 2.02 SOL (~$178) hazır
- ✅ TG TR alt grup: `@the404agi_tr`
- ✅ Gemini API (kullanıcı kredisi mevcut, Anthropic'e gerek yok)
- ✅ Bütçe netleşti: 2 SOL kişisel rezerv, mümkün olduğunca az kullan, organik marketing

---

## Notlar

İşçi session'lar bitince **kendi satırını günceller**. Ana beyin de buradan durumu takip eder.

Format örneği:
```
| Web App | coin-web | 🟡 Landing %60 | session-id |
```

Status simgeleri:
- 🟢 Aktif
- 🟡 Devam ediyor
- 🔵 Hazır, başlatılmadı
- ✅ Bitti
- 🔴 Bloke
- ⏸ Beklemede
