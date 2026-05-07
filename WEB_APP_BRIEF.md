# İŞÇİ SESSION BRIEF — WEB APP

Bu dosyayı yeni bir Claude Code session'a yapıştır.

---

```
Sen "Web App" işçi session'ısın. Ana beyin başka bir session'da.

📂 ZORUNLU İLK ADIM:
Şu dosyaları oku:
- MASTER_PLAN.md
- DECISIONS.md
- WEBSITE_SPEC.md  ← BU EN ÖNEMLİSİ, KILAVUZUN
- LAUNCH_TIMELINE.md (Faz 2 → Web App kısmı)
- PRE_LAUNCH_CHECKLIST.md (Web App ile ilgili kalemler)

🎯 PROJE: 404AGI ($404) için profesyonel web app
Domain: 404agi.fun (Vercel'de deploy)

🚧 SCOPE (WEBSITE_SPEC.md'ye birebir uy):

KURULUM
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui kurulumu
- Framer Motion
- Klasör yapısı: /web (bu projeyi /web altında oluştur, monorepo gibi)

LANDING PAGE (single-page, tüm bölümler)
- Top bar (sticky, CA copy + live ticker)
- Hero (404 ASCII art + tagline + 2 CTA)
- Live Ticker Strip (4 metric, Dexscreener API)
- Manifesto / Lore (typewriter efekt)
- Live Agent Feed (placeholder, gerçek tweetler agent session'dan gelir)
- Token-Gated AI Chat (asıl differentiator)
- Tokenomics + Trust Signals
- How To Buy (3 adım)
- Roadmap (parodi + gerçek hover)
- Community linkleri
- Footer + disclaimer

WALLET CONNECT
- @solana/wallet-adapter-react
- Phantom desteği (asıl), diğerleri opsiyonel
- Token bakiye kontrolü (Helius RPC veya public RPC)
- Tier sistemi: 0 / 1+ / 100K+ / 1M+

AI CHAT
- @google/generative-ai
- Gemini 2.5 Flash
- Context caching aktif (cost optimization)
- Streaming response
- Sistem promptu: BRANDING session'dan gelecek (final değil ama placeholder var)
- Memory: Vercel KV (kullanıcı başına son 20 mesaj)
- Rate limit: tier'a göre

DATA
- Dexscreener API (public): /latest/dex/tokens/{ca}
- Auto-refresh 10s
- Pre-launch: "AWAITING DEPLOYMENT" placeholder

DEPLOY
- Vercel (preview ve production)
- Custom domain: 404agi.fun (kullanıcı DNS ayarlayacak)
- Env vars: GEMINI_API_KEY, NEXT_PUBLIC_CONTRACT_ADDRESS, KV_REST_API_URL, KV_REST_API_TOKEN
- Contract address env var → launch'tan sonra güncellenecek

KALİTE GEREKSİNİMLERİ (PRE_LAUNCH_CHECKLIST.md'den)
- Lighthouse 95+ (Performance, A11y, Best Practices, SEO)
- LCP < 1.5s
- Mobile responsive (375px test)
- Accessibility AA
- Reduced motion respect
- SEO meta + OG image (1200x630, Vercel OG generator ile dinamik)

🚫 DOKUNMA:
- MASTER_PLAN.md (yalnız oku)
- WEBSITE_SPEC.md (yalnız oku, ana beyin değiştirir)
- /agent klasörü (AI agent session'ı)
- /telegram klasörü (TG bot session'ı)
- /branding klasörü (branding session'ı)
- Token deploy ile ilgili hiçbir şey

PLACEHOLDER KULLAN
Henüz hazır olmayan içerikler için clear placeholder kullan:
- Logo: `/public/logo-placeholder.svg`
- Lore final metni: WEBSITE_SPEC.md'deki taslak metin (branding finalize edince güncellenir)
- Agent feed: 5 dummy tweet
- Renk paleti: WEBSITE_SPEC.md'deki paleti kullan

✅ BİTİNCE:
1. /web altında çalışan Next.js projesi
2. `npm run dev` ile local'de çalışıyor
3. Vercel'e deploy edildi (preview URL)
4. README.md'de: kurulum, env vars, deploy adımları
5. PROGRESS.md'yi güncelle: "Web App ✅ — preview URL: [...]"
6. Commit: "[coin-web] landing + AI chat + wallet connect hazır"
7. Ana beyne dön: "Web App session bitti, preview URL: [...], test edilmesi gereken: [...]"

❓ KARAR GEREKİRSE:
Ana beyne dön. Spec'te olmayan büyük UX kararları tek başına alma.

⚠️ KRİTİK:
- WEBSITE_SPEC.md'deki "ÇIKMAYACAK" bölümüne dikkat et — yapma listesi var.
- Ucuz görünmesin. Standart meme coin sitelerinden farklı, profesyonel olsun.
- Performans HEDEF DEĞİL ZORUNLULUK — Lighthouse 95+ olmadan bitmedi.

⏱ TAHMİNİ SÜRE: 6-8 saat

Başla. İlk işin: 5 dosyayı oku ve 3 dakika içinde özetle bana, doğru anladığını teyit et. Sonra kurulum.
```
