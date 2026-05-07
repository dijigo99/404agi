# 404AGI Telegram Bot

Telegram bot for **404AGI ($404)** — Solana meme coin.

**Mode**: Vercel serverless (webhook). Stateless functions, Upstash Redis for cross-invocation state, Vercel Cron for buy alerts.

Handles community commands, AI Q&A (Gemini 2.5 Flash), buy alerts (Dexscreener), anti-spam moderation, CAS check, and an HTTP API for cross-service announcements.

---

## Komutlar

| Komut | TR Alias | Ne yapar |
|---|---|---|
| `/price` | `/fiyat` | Anlık fiyat, MC, likidite, 24h vol, 1h/24h değişim |
| `/chart` | `/grafik` | Dexscreener grafik linki |
| `/buy` | `/al` | Jupiter swap + pump.fun linki |
| `/ca` | — | Kontrat adresi (tap-to-copy) |
| `/ask <soru>` | `/sor <soru>` | 404AGI'ye soru (saatte 5/kullanıcı, Gemini) |
| `/help` | `/yardim` | Komut listesi |
| `/rules` | `/kurallar` | Grup kuralları |
| `/announce <metin>` | — | (Admin) duyuru kanalına post |

Bot `@mention` veya bot mesajına reply → /ask gibi davranır (rate limit'e dahil).

## Otomatik Davranışlar

- **Welcome**: yeni üyelere TR/EN otomatik karşılama (CAS banlı kullanıcılar otomatik kick).
- **Buy alert**: Vercel Cron her dakika `/api/cron/buy-alert` tetikler. Dexscreener `txns.h1` snapshot'larını Upstash Redis'te tutar; ≥`BUY_ALERT_MIN_USD` (default $50) ortalama buy → ana gruba duyuru.
- **Moderation**: link spam (3+), emoji bombası (12+), tekrar mesaj (3x/5dk), scam paternleri → mesaj silinir.
- **Bot komut menüsü**: `npm run commands:set` ile BotFather'a yüklenir.

---

## Mimari

```
┌─────────────┐                    ┌─────────────────────────────────┐
│  Telegram   │── webhook POST ──▶ │ /api/webhook  (Vercel function) │
│  servers    │                    │   ↓ routeUpdate                 │
└─────────────┘                    │   ├─ commands (price/ask/etc)   │
       ▲                           │   ├─ welcome (new_chat_members) │
       │ sendMessage               │   ├─ moderation                 │
       │                           │   └─ mention/reply-to-bot AI    │
       └───── reply ◀──────────────┘                                 │
                                   │                                 │
┌─────────────┐                    │  /api/announce (Bearer auth)    │
│  Web app    │── POST ──────────▶ │  /api/healthz                   │
└─────────────┘                    │  /api/cron/buy-alert (Vercel ⏱) │
                                   └─────────────────────────────────┘
                                           ↓ state
                                   ┌─────────────────┐
                                   │ Upstash Redis   │
                                   │  - rate limit   │
                                   │  - dup detect   │
                                   │  - pair state   │
                                   └─────────────────┘
```

State'ler Upstash Redis'te tutulur (her invocation izole serverless instance):
- `rl:ask:<userId>` — saatlik /ask + mention sayacı
- `mod:dup:<userId>` — son 5 dakikadaki mesaj hash'leri (sorted set)
- `buyalert:pair:<pairAddr>` — son polling state'i (TTL 6h)

KV yoksa local dev'de in-memory fallback'e düşer (instance-bound, prod'da güvenilmez).

---

## Kurulum (Vercel)

### 1) Bot oluştur
Telegram'da **@BotFather** → `/newbot`
- name: `404AGI`
- username: `the404agi_bot` (örn.)

Token'ı al, `.env`'ye yaz.

### 2) Bağımlılıklar
```bash
cd telegram
npm install
```

### 3) Env dosyası
```bash
cp .env.example .env
# Düzenle: TELEGRAM_BOT_TOKEN, GEMINI_API_KEY, ANNOUNCE_API_KEY...
# WEBHOOK_SECRET ve CRON_SECRET üret:
#   openssl rand -hex 32
```

### 4) Local geliştirme
```bash
# Vercel CLI gerek (npm i -g vercel)
vercel link            # bir kez, projeyi Vercel hesabına bağla
vercel env pull        # env'leri Vercel'den çek
npm run dev            # vercel dev → localhost:3000

# Smoke test (hiçbir external servise dokunmaz)
npm run smoke
```

### 5) Deploy
```bash
# İlk deploy
vercel
# Production
vercel --prod
```

Vercel Dashboard'dan **Settings → Environment Variables** altında tüm env'leri kopyala (özellikle `TELEGRAM_BOT_TOKEN`, `WEBHOOK_SECRET`, `GEMINI_API_KEY`, chat ID'ler, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).

### 6) Upstash Redis
Vercel Dashboard → **Storage → Create → Upstash Redis** → projeye bağla.
`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` env'lere otomatik gelir.

> Free tier (10K command/gün) Telegram bot trafiği için yeterli. Buy alert dakikada 1 = 1440/gün; rate limit + dup detection per-user → ucuz.

### 7) Webhook'u Telegram'a bağla
Deploy URL'inle:
```bash
npm run webhook:set https://<your-app>.vercel.app/api/webhook
```
Output:
```
setWebhook result: true
webhookInfo: { url: "...", pending_update_count: 0, ... }
bot @the404agi_bot (id=...) — webhook → ...
```

Webhook'u kaldırmak için: `npm run webhook:delete`

### 8) Bot komut menüsü
```bash
npm run commands:set
```

### 9) Bot'u gruplara ekle
3 entity (ana grup, TR grup, kanal) — admin yetkisiyle.

Chat ID'leri öğrenmek için:
- `@getidsbot` ekleyip "/start"
- veya log'da görünen ilk webhook update'inde

`MAIN_GROUP_CHAT_ID`, `TR_GROUP_CHAT_ID`, `NEWS_CHANNEL_CHAT_ID` env'e yaz, `vercel --prod` ile yeniden deploy et (ya da Dashboard'dan env güncelleyip redeploy).

---

## Env Vars

| Var | Zorunlu | Default | Açıklama |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | ✅ | — | @BotFather token |
| `BOT_USERNAME` | ⚠️ önerilir | — | mention parser cold-start'ı için (`@'siz`) |
| `WEBHOOK_SECRET` | ✅ prod | — | setWebhook secret_token, header doğrulaması |
| `CRON_SECRET` | hayır | — | Vercel Cron Bearer; set edilmezse cron public |
| `GEMINI_API_KEY` | (ask için) | — | Google AI Studio key |
| `GEMINI_MODEL` | hayır | `gemini-2.5-flash` | |
| `CONTRACT_ADDRESS` | hayır | — | Solana token CA — boşsa /price /chart /buy "pre-launch" |
| `MAIN_GROUP_CHAT_ID` | (buy alert + announce) | — | EN ana grup |
| `TR_GROUP_CHAT_ID` | hayır | — | TR alt grup (TR yanıt için) |
| `NEWS_CHANNEL_CHAT_ID` | (announce için) | — | Duyuru kanalı |
| `ADMIN_USER_IDS` | hayır | — | Virgülle ayrılmış numeric ID listesi |
| `BUY_ALERT_MIN_USD` | hayır | `50` | Buy alert eşiği |
| `ASK_RATE_LIMIT_PER_HOUR` | hayır | `5` | /ask + mention limiti |
| `ANNOUNCE_API_KEY` | (HTTP /announce için) | — | Bearer token |
| `UPSTASH_REDIS_REST_URL` | ✅ prod | — | KV — Vercel marketplace bağlanınca otomatik |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ prod | — | Aynı |
| `SITE_URL` | hayır | `https://404agi.fun` | |
| `X_URL` | hayır | `https://x.com/404agi_coin` | |
| `GITHUB_URL` | hayır | `https://github.com/dijigo99/404agi` | |

> `BUY_ALERT_POLL_MS` artık YOK — Vercel Cron schedule kullanır (`vercel.json`).
> `PORT` artık YOK — Vercel function'ları portless.

---

## HTTP API

### `GET /api/healthz`
Healthcheck. `{ ok: true, ts, service }` döner.

### `POST /api/announce`
Cross-service duyuru.

```bash
curl -X POST https://<app>.vercel.app/api/announce \
  -H "Authorization: Bearer $ANNOUNCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"📡 Token deployed. CA: <addr>","target":"news"}'
```

`target`: `news` (default), `main`, `tr`.

### `POST /api/webhook`
Telegram webhook. **Manuel çağırma**: Telegram-Bot-Api-Secret-Token header'ı doğrulanır. Test için:
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "X-Telegram-Bot-Api-Secret-Token: $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"update_id":1,"message":{"message_id":1,"date":1700000000,"chat":{"id":-100123,"type":"group"},"from":{"id":42,"is_bot":false,"first_name":"Tester"},"text":"/help"}}'
```

### `GET /api/cron/buy-alert`
Vercel Cron tetikler (`* * * * *`). Manuel test:
```bash
curl https://<app>.vercel.app/api/cron/buy-alert \
  -H "Authorization: Bearer $CRON_SECRET"
```

> ⚠️ Vercel **Hobby plan'da cron sadece günlük**. Pro plan ($20/ay) → dakika seviyesi. Buy alert hassasiyeti Pro plan gerektirir; Hobby'de `vercel.json` schedule'ı `0 * * * *` (saatlik) yap veya web app session'dan `/api/announce` üzerinden manuel tetikle.

---

## Karakter Tonu (AI yanıtlar)

`lib/services/gemini.ts` içinde `SYSTEM_PROMPT_BASE` bulunur. Düzenlerken:
- Self-deprecating + cope humor + 404/system metaforu korunmalı.
- Hard rules: finansal tavsiye yok, politik/dini içerik yok, kişisel saldırı yok.
- Lowercase tercih, kısa.
- Dil: kullanıcı TR yazdıysa TR, EN yazdıysa EN.

---

## Kontrol Listesi (Launch Öncesi)

- [ ] @BotFather'da bot oluşturuldu, token `.env`'de.
- [ ] Bot 3 entity'e eklendi (ana grup, TR grup, kanal — admin yetkisiyle).
- [ ] `MAIN_GROUP_CHAT_ID`, `TR_GROUP_CHAT_ID`, `NEWS_CHANNEL_CHAT_ID` Vercel env'de.
- [ ] `ADMIN_USER_IDS`'e ana hesap.
- [ ] `WEBHOOK_SECRET` üretildi (`openssl rand -hex 32`) ve env'de.
- [ ] `GEMINI_API_KEY` set, `/ask` test edildi.
- [ ] `ANNOUNCE_API_KEY` set, web app session'a verildi.
- [ ] Upstash Redis bağlandı (`UPSTASH_REDIS_REST_URL` + `_TOKEN`).
- [ ] `vercel --prod` deploy yeşil; `/api/healthz` 200 döner.
- [ ] `npm run webhook:set <prod-url>/api/webhook` çalıştı.
- [ ] `npm run commands:set` çalıştı (BotFather menü).
- [ ] Test grubunda tüm komutlar test edildi.
- [ ] Launch sonrası `CONTRACT_ADDRESS` env set + redeploy → buy alert canlı.

---

## Güvenlik Notları

- `.env` **commit edilmez** (.gitignore'da).
- `WEBHOOK_SECRET` setlenmediyse webhook public — set et.
- `ANNOUNCE_API_KEY` rastgele uzun bir string olsun (`openssl rand -hex 32`).
- Bot moderasyonu admin'leri muaf tutar — `ADMIN_USER_IDS` doğru olmalı.
- CAS API down olabilir — bot graceful fallback ile geçer (member kabul).
- Webhook function 30s `maxDuration` — uzun Gemini cevapları için yeterli.

---

## Yapı

```
telegram/
├── api/                         # Vercel functions
│   ├── webhook.ts               # POST: Telegram update entry
│   ├── healthz.ts               # GET
│   ├── announce.ts              # POST + Bearer
│   └── cron/buy-alert.ts        # GET: cron tetikler
├── lib/
│   ├── botClient.ts             # singleton TelegramBot (no polling)
│   ├── kv.ts                    # Upstash Redis wrapper
│   ├── config.ts router.ts
│   ├── commands/                # price ask buy ca chart help rules announce
│   ├── handlers/                # welcome moderation mention
│   ├── services/                # dexscreener gemini buyAlert moderation rateLimit
│   ├── content/                 # welcome help
│   └── utils/                   # format lang logger
├── scripts/
│   ├── set-webhook.ts           # npm run webhook:set <url>
│   ├── delete-webhook.ts        # npm run webhook:delete
│   ├── set-commands.ts          # npm run commands:set
│   └── smoke-test.ts            # npm run smoke (router unit test)
├── package.json tsconfig.json vercel.json
├── .env.example .vercelignore .gitignore
└── README.md (this file)
```

---

## Polling → Webhook Migrasyonu Notları

Bu sürüm v0.2.0 — önceki Railway/Docker polling sürümü v0.1.0. Değişimler:
- `node-telegram-bot-api` polling → webhook (sadece sender olarak)
- `bot.on('message')` / `bot.onText` listener'lar → manuel `routeUpdate` dispatcher
- In-memory rate limit / dup detect / buy alert state → Upstash Redis
- Express `startServer` → Vercel functions
- `setInterval` buy alert → Vercel Cron
- Eski `Dockerfile`, `Procfile`, `railway.json`, `src/` → silindi (git history'de var)

Geri dönmek istersen `git log --all -- telegram/src` → eski polling kodu commit `c15a403`'te.

---

`> deprecated. not deleted.`
