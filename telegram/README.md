# 404AGI Telegram Bot

Telegram bot for **404AGI ($404)** — Solana meme coin.

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
- **Buy alert**: Dexscreener `txns.h1` polling. ≥`BUY_ALERT_MIN_USD` (default $50) ortalama buy → ana gruba duyuru.
- **Moderation**: link spam (3+), emoji bombası (12+), tekrar mesaj (3x/5dk), scam paternleri → mesaj silinir.
- **Bot komut menüsü**: BotFather'a otomatik yüklenir (`setMyCommands`).

---

## Kurulum

```bash
# 1) Bot oluştur
# Telegram'da @BotFather → /newbot
#   name: 404AGI
#   username: @the404agi_bot
# Token al, .env'ye yaz.

# 2) Bağımlılıklar
cd telegram
npm install

# 3) Env
cp .env.example .env
# Düzenle: TELEGRAM_BOT_TOKEN, GEMINI_API_KEY, vs.

# 4) Dev (hot reload)
npm run dev

# 5) Build + prod
npm run build
npm start
```

### Chat ID'lerini Bulmak

Bot'u gruplara ve kanala ekledikten sonra log'larda `chatId` görünecek. Veya:
- Bota `@getidsbot` ekle → grup ID'sini söyler.
- Kanal ID'leri için botu admin yap, sonra kanala bir `/help` komut çağrısı dene; gelmezse `getUpdates` API'sini kullan.

`MAIN_GROUP_CHAT_ID`, `TR_GROUP_CHAT_ID`, `NEWS_CHANNEL_CHAT_ID` env'lerine yaz.

### Admin User ID'leri

`/announce` ve moderation muafiyeti için. Telegram username yetmez — numeric ID lazım. `@userinfobot` veya `@getidsbot` ile öğren.

---

## Env Vars

| Var | Zorunlu | Default | Açıklama |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | ✅ | — | @BotFather token |
| `GEMINI_API_KEY` | (ask için) | — | Google AI Studio key |
| `GEMINI_MODEL` | hayır | `gemini-2.5-flash` | Model adı |
| `CONTRACT_ADDRESS` | hayır | — | Solana token CA — boşsa /price /chart /buy "pre-launch" mesajı verir |
| `MAIN_GROUP_CHAT_ID` | (buy alert + announce için) | — | EN ana grup chat ID |
| `TR_GROUP_CHAT_ID` | hayır | — | TR alt grup chat ID (TR yanıtlama için) |
| `NEWS_CHANNEL_CHAT_ID` | (announce için) | — | Duyuru kanalı chat ID |
| `ADMIN_USER_IDS` | hayır | — | Virgülle ayrılmış numeric ID listesi |
| `BUY_ALERT_MIN_USD` | hayır | `50` | Buy alert eşiği |
| `BUY_ALERT_POLL_MS` | hayır | `60000` | Polling sıklığı |
| `ASK_RATE_LIMIT_PER_HOUR` | hayır | `5` | Kullanıcı başına /ask + mention limiti |
| `ANNOUNCE_API_KEY` | (HTTP /announce için) | — | Bearer token, web app çağrısı için |
| `SITE_URL` | hayır | `https://404agi.fun` | |
| `X_URL` | hayır | `https://x.com/404agi_coin` | |
| `GITHUB_URL` | hayır | `https://github.com/dijigo99/404agi` | |
| `PORT` | hayır | `3000` | HTTP server portu |

---

## HTTP API

### `GET /healthz`
Healthcheck. `{ ok: true, ts }` döner.

### `POST /announce`
Cross-service duyuru (örn. web app session'ı bunu kullanabilir).

```bash
curl -X POST https://your-bot-url/announce \
  -H "Authorization: Bearer $ANNOUNCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"📡 Token deployed. CA: <addr>","target":"news"}'
```

`target`: `news` (default), `main`, `tr`.

---

## Deploy

### Railway (önerilen, en hızlı)

1. https://railway.app → **New Project → Deploy from GitHub repo**
2. Bu klasörü root olarak işaretle (veya monorepo'da subdir).
3. **Variables**: yukarıdaki env tablosundaki tüm zorunlular.
4. Deploy → healthcheck `/healthz` otomatik kontrol edilir.
5. Public URL'i web app'e ver: `https://<your-app>.up.railway.app/announce`.

`railway.json` zaten yapılandırılmış (NIXPACKS + healthcheck).

### Docker

```bash
docker build -t 404agi-tg .
docker run --env-file .env -p 3000:3000 404agi-tg
```

### Fly.io / Render / VPS

`Procfile` (`web: npm start`) destekli. Manuel olarak `npm run build && node dist/index.js` çalıştır.

⚠️ **Vercel'de çalışmaz** — long polling için kalıcı process gerek.

---

## Buy Alert Mantığı

Dexscreener'ın token endpoint'ine `BUY_ALERT_POLL_MS` aralıklarla GET atar. Her pair için `txns.h1.buys` ve `volume.h1` farkını izler. Yeni alımlar varsa, ortalama USD değeri (`yeni_volume / yeni_alım / 2` — sells dahil olduğu için 2'ye böl) eşiği geçtiğinde gruba post atar.

İlk pull'da sadece state kaydedilir, mesaj atılmaz. Sonra her tick'te delta'ya bakılır.

> Not: Bu yaklaşım **dakikalık precision** sağlar, tek bir tx'i yakalamaz. Birden fazla pair varsa (pump.fun + Raydium graduate) hepsi izlenir.

İleride iyileştirme: doğrudan Solana RPC `getSignaturesForAddress` ile tx-by-tx hassasiyet.

---

## Karakter Tonu (AI yanıtlar)

`src/services/gemini.ts` içinde `SYSTEM_PROMPT_BASE` bulunur. Düzenlerken:
- Self-deprecating + cope humor + 404/system metaforu korunmalı.
- Hard rules: finansal tavsiye yok, politik/dini içerik yok, kişisel saldırı yok.
- Lowercase tercih, kısa.
- Dil: kullanıcı TR yazdıysa TR, EN yazdıysa EN.

---

## Kontrol Listesi (Launch Öncesi)

- [ ] @BotFather'da bot oluşturuldu, token `.env`'de.
- [ ] Bot 3 entity'e eklendi (ana grup, TR grup, kanal — admin yetkisiyle).
- [ ] `MAIN_GROUP_CHAT_ID`, `TR_GROUP_CHAT_ID`, `NEWS_CHANNEL_CHAT_ID` env'lere yazıldı.
- [ ] `ADMIN_USER_IDS`'e ana hesap eklendi.
- [ ] `GEMINI_API_KEY` set, `/ask` test edildi.
- [ ] `ANNOUNCE_API_KEY` set, web app session bilgilendirildi.
- [ ] Test grubunda tüm komutlar test edildi.
- [ ] Railway/Docker deploy edildi, healthcheck yeşil.
- [ ] Launch sonrası `CONTRACT_ADDRESS` set edildi → buy alert canlı.

---

## Güvenlik Notları

- `.env` **commit edilmez** (.gitignore'da).
- `ANNOUNCE_API_KEY` rastgele uzun bir string olsun (`openssl rand -hex 32`).
- Bot moderasyonu admin'leri muaf tutar — `ADMIN_USER_IDS` doğru olmalı.
- CAS API down olabilir — bot bunu graceful fallback ile geçer (member kabul).

---

## Yapı

```
telegram/
├── src/
│   ├── index.ts            # Ana entry
│   ├── config.ts
│   ├── server.ts           # Express healthcheck + /announce
│   ├── commands/
│   │   ├── price.ts ask.ts buy.ts ca.ts chart.ts help.ts rules.ts announce.ts
│   ├── handlers/
│   │   ├── welcome.ts moderation.ts mention.ts
│   ├── services/
│   │   ├── dexscreener.ts gemini.ts buyAlert.ts moderation.ts rateLimit.ts
│   ├── content/
│   │   ├── welcome.ts help.ts
│   └── utils/
│       └── format.ts lang.ts logger.ts
├── package.json tsconfig.json
├── Dockerfile Procfile railway.json
└── README.md (this file)
```

---

`> deprecated. not deleted.`
