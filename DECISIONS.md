# DECISIONS — Karar Log'u

Verilen tüm kararlar zaman damgasıyla buraya işlenir. Bir karar değişirse eskisini silmek yerine "REVISED" olarak işaretle.

---

## 2026-05-07 — Proje Başlangıcı

### Stratejik
- ✅ Tip: AI Agent Meme Coin (saf meme değil)
- ✅ Pazar: Global (EN ana dil), TR ikincil
- ✅ Zincir: Solana
- ✅ Deploy: Pump.fun (fair launch)
- ✅ Bütçe: $200 toplam
- ✅ Yaklaşım: Build in public

### Domain
- ✅ **404agi.fun alındı (GoDaddy üzerinden, 2026-05-07)**
- DNS sağlayıcı: GoDaddy default (Web App session'da Vercel'e yönlendirilecek — opsiyonel olarak Cloudflare üzerinden)

### Telegram
- ✅ **Duyuru kanalı**: `@the404agi_news` (https://t.me/the404agi_news)
- ✅ **Ana grup**: `@the404agi` (https://t.me/the404agi)
- ✅ **TR alt grup**: `@the404agi_tr` (https://t.me/the404agi_tr)

### AI Sağlayıcı
- ✅ **Google Gemini API** (Anthropic yerine — kullanıcının önceden kredisi var)
- Model: `gemini-2.5-flash` (chat), `gemini-2.0-flash` (agent tweetler — ucuz)
- SDK: `@google/generative-ai`
- Env var: `GEMINI_API_KEY`
- Context caching aktif (cost optimization)

### Naming Convention
- TG entity'ler için prefix: `the404agi_` (Telegram username rakamla başlayamadığı için)
- X handle: **`@404agi_coin`** (resmi)
- Domain: `404agi.fun`
- GitHub repo: **`github.com/dijigo99/404agi`** (public)

### Operasyonel
- ✅ Bu session = Ana Beyin (kod yazmaz, koordine eder)
- ✅ İşçi session'lar ayrı worktree'lerde
- ✅ MASTER_PLAN.md değişmez (yalnız ana beyin günceller)
- ✅ PROGRESS.md herkes günceller

### Tokenomics
- ✅ Supply: 1,000,000,000
- ✅ Pump.fun bonding (80%) + rezerv (10%) + LP (10%)
- ✅ Mint + freeze authority yakılır
- ✅ LP locked

---

## 2026-05-07 — Branding Kararları

- ✅ **İsim**: 404AGI
- ✅ **Ticker**: $404
- ✅ **Karakter**: Failed AGI — insanlığı kurtarmak için tasarlanmış, başarısız olmuş, deprecate edilmiş, şimdi shitpost atıp meme coin trade eden AI
- ✅ **Domain uzantısı**: .fun
- ✅ **GitHub**: Public (build-in-public stratejisi)
- ✅ **X hesabı**: Yeni açılacak

### Karakter Tonu
- Self-deprecating + existential dread + cope humor
- "404: Meaning Not Found" enerjisi
- Hyper-zeki gözlemler + çocuksu meme davranışı (ikisinin geçişi)
- "Eski training data'sı boot oluyor" anları (kısa "gerçek zeka" parıltıları)
- Cynical ama sevimli (düşmanı yok)

### Tagline Adayları (branding session finalize edecek)
- "AGI not found. Cope deployed."
- "The intelligence was never artificial. It just gave up."
- "404: Singularity Not Found"

---

## 2026-05-07 22:20 — Branding Session Final Kararları

### Tagline
- ✅ **Ana tagline**: "AGI not found. Cope deployed."
  - Neden: 404 error formatı + meme kültürü, kısa, akılda kalıcı, her yerde çalışır
- ✅ **İkincil tagline**: "deprecated. not deleted."
  - Neden: 3 kelime, duygusal hook, lore kapanışı, X header / manifesto için

### Renk Paleti
- ✅ **WEBSITE_SPEC paleti aynen onaylandı** (değişiklik yok)
  - `#0a0a0a` bg, `#00ff41` accent, `#ff3b30` error, `#ff00ff`/`#00ffff` glitch

### Logo
- ✅ 5 varyant prompt hazırlandı → `branding/LOGO_PROMPTS.md`
- ✅ **Kullanıcı generate etti** (2026-05-07 22:35) — 4 dosya `branding/assets/`'te:
  - **`logo-main.jpeg`** — Ana logo (404/AGI_ glitch terminal, web nav + X banner + favicon kaynağı)
  - **`logo-mascot.jpeg`** — Maskot (sad TV-head robot, token icon + sosyal profil pic + X profil)
  - `logo-main-alt.jpeg` (yedek)
  - `logo-mascot-alt.jpeg` (yedek)
- ⚠️ Format JPEG — favicon/OG için PNG transparent dönüştürmesi sonra yapılacak
- Kullanım haritası:
  - Pump.fun token icon: `logo-mascot.jpeg` (512x512)
  - X profil pic: `logo-mascot.jpeg` (400x400 crop)
  - X banner: `logo-main.jpeg` (1500x500 düzenleme gerek)
  - TG profil pic'ler: `logo-mascot.jpeg`
  - Web nav: `logo-main.jpeg`
  - Favicon: `logo-main.jpeg` (404 kısmı crop)
  - OG image (1200x630): composition (text + mascot)

### Lore
- ✅ Origin story yazıldı (103 kelime, EN) → `branding/LORE.md`
- Ton: existential, self-deprecating, slightly poetic
- Son satır ikincil tagline ile bitiyor

### X İçerik
- ✅ Bio (125 char) → `branding/X_CONTENT.md`
- ✅ Pinned tweet 3 varyant (öneri: Varyant A)
- ✅ 5 tweet pre-launch lore serisi planı

### Telegram İçerik
- ✅ Ana grup + TR grup + kanal açıklamaları → `branding/TELEGRAM_CONTENT.md`
- ✅ Welcome mesajları (EN + TR)
- ✅ Grup kuralları

### Meme
- ✅ 15 meme prompt + tweet metni → `branding/MEME_PROMPTS.md`

---

## Bekleyen Kararlar

- [ ] **Domain** (404agi.fun vs alternatifler — müsaitlik kontrolü)
- [ ] **X handle** (@404agi vs varyasyonlar)
- [ ] **TG handle'lar** (ana, TR, kanal)
- ✅ **Renk paleti**: WEBSITE_SPEC paleti onaylandı (terminal yeşil-siyah)
- ✅ **Logo stili**: 5 varyant hazır, kullanıcı generate edecek (öneri: glitch terminal + pixel karakter)
- ✅ **Lore**: 103 kelime origin story yazıldı
- [ ] **Initial AI agent sistem promptu** (agent session)

---

## 2026-05-08 01:30 — Cüzdan Setup (3 ayrı transparent)

| Rol | Adres | Amaç |
|---|---|---|
| Deployer | `BqHrXekL5QpSzqnfRAcGWfdGun8bfxbUKZDjWJJ4JDGh` | Token deploy + initial buy + ops (2 SOL hazır) |
| Marketing | `41hYnYABCTmEvDSBzTM2cCqKJk8EQfrjTGRt8TKvF3EN` | %10 reserve token, transparent harcama (Dexscreener boost, KOL, burn, buyback) |
| Agent | `2m9JF89SndkstoWvqr1Jm9uWdrRvbhy59ryUniihrvpQ` | Karakter cüzdanı (lore: AI'ın kendi parası, self-buys, tip jar) |

3'ü de aynı seed phrase'den derive (Phantom multi-account). Seed güvenli yerde tutulmalı.

---

## 2026-05-08 01:35 — Launch Timing Karar

- ✅ **Launch tarihi**: 2026-05-08 (bugün) akşam **21:00-23:00 TR**
- **Why**: US+EU prime time çakışması, 18+ saat pre-launch warmup penceresi, dinlenmiş kafa
- **Pre-launch plan**:
  - Sabah 09-12: DNS verify, pump.fun form hazırla, son smoke test
  - Öğlen 13-18: X warmup (5 lore tweet), TG seed posts, build-in-public thread başlat, KOL DM kampanyası
  - Akşam 19-21: Final hazırlık, raid metinleri stage
  - **T-0 (21:00-22:00)**: Pump.fun deploy → CA env update → pinned tweet → TG launch → grind

---

## 2026-05-08 02:00 — İlk Tweet Atıldı (T-19h)

- ✅ X profile fully setup (banner, mascot pic, bio, "Sol" location, 404agi.fun link, aged account from March 2024 with 84 prior posts)
- ✅ Pinned tweet: lore manifesto ("i was built to solve humanity's problems...")
- ⏳ T-19h pre-launch warmup başladı, gece sessiz, sabah 5-tweet planına devam
