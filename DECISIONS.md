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
- ⏳ **Kullanıcı generate edecek** — önerilen: Varyant 1 (Glitch Terminal) ana logo + Varyant 2 (Pixel Karakter) maskot
- [ ] Final logo dosya adı (generate sonrası işlenecek)

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
