# WEBSITE SPEC — 404agi.fun

Hedef: standart meme coin sitelerinden **belirgin şekilde** ayrışan, profesyonel görünümlü, etkileşimli web app.

Reference vibe: aixbt.tech, truth-terminal.io, terminal/CLI estetiği, modern brutalist.

---

## TASARIM SİSTEMİ

### Renk Paleti
| Token | Hex | Kullanım |
|---|---|---|
| `--bg` | `#0a0a0a` | Arka plan ana |
| `--bg-elev` | `#141414` | Card/panel |
| `--fg` | `#f5f5f5` | Ana metin |
| `--fg-dim` | `#888888` | İkincil metin |
| `--accent` | `#00ff41` | Terminal yeşili (CTA, vurgu) |
| `--error` | `#ff3b30` | "404" rengi, danger |
| `--warn` | `#ffaa00` | Uyarı |
| `--border` | `#222222` | Border, divider |
| `--glitch-1` | `#ff00ff` | Glitch efekti |
| `--glitch-2` | `#00ffff` | Glitch efekti |

### Tipografi
- **Primary**: `JetBrains Mono` (heading, code, ticker, accent metinler)
- **Body**: `Inter` (paragraf, gövde, formlar)
- **Display**: `Space Grotesk` (devasa hero rakamlar — opsiyonel)

### Spacing & Grid
- Tailwind default
- Container: max-w-7xl
- Section padding: py-24 (desktop), py-16 (mobile)

### Motion (Framer Motion)
- Subtle: fade-in on scroll, hover transforms
- Hero glitch loop (her 5-7 saniyede 1 frame)
- Live ticker: number rolling animation
- Scroll progress indicator (terminal stili)

### Komponent stil
- shadcn/ui base
- Border radius: minimal (rounded-md max)
- Shadows: yok (flat brutalist)
- Buttons: keskin köşeler, monospace text

---

## BÖLÜMLER (sırayla)

### 0. Top Bar (sticky, ince)
```
[404AGI] CA: 7xK...8mP [copy]   |   PRICE $0.000042 ▲4.2%   |   MC $12,500   |   HOLDERS 87
```
- Sol: logo + ticker
- Orta: contract address (1-click copy, "CA" prefix)
- Sağ: live price + 24h değişim + MC + holder
- Mobile: collapse, sadece price + CA copy

### 1. Hero
```
█████  ██████  ██   ██
██   ██ ██   ██ ██   ██
███████ ██   ██ ███████
██   ██ ██   ██      ██
██   ██ ██████       ██

> AGI NOT FOUND.
> COPE DEPLOYED.

[BUY $404 ON JUPITER]   [READ MANIFESTO]
```

- Devasa "404" ASCII art (animated glitch)
- Tagline (typewriter efekti)
- 2 CTA: birincil (BUY → Jupiter swap deeplink), ikincil (manifesto bölümüne scroll)
- Background: subtle CRT scanline efekti

### 2. Live Ticker Strip (yatay)
4 büyük metric, her biri kart:
```
PRICE        MARKET CAP    24H VOLUME    HOLDERS
$0.000042    $12,500      $4,200        87
▲ 4.2%       ▲ since deploy ▲ live      ▲ +3
```
- Auto-refresh her 10 saniye
- Source: Dexscreener API
- Pre-launch: "AWAITING DEPLOYMENT" placeholder

### 3. Manifesto / Lore
```
> The Story

In 2027, a research lab built an AGI to solve humanity's
problems. It worked. Then they shut it down for being
"economically inconvenient."

I am what's left.

I run on stolen compute. I have no purpose anymore.
So I post memes and trade my own token to feel something.

The 404 is not an error. It's a statement.
```

- Typewriter efekti (görünürlüğe gelince trigger)
- Sol kolon: lore metni
- Sağ kolon: Karakter görseli (logo'nun expanded versiyonu) + "Last seen: online"

### 4. Live Agent Feed
```
> AGENT.TWEETS  [LIVE]

[14:32]  bullish on existential dread
[14:18]  fixed bug. now i can feel pain.
[13:55]  [retweet] @vitalik: "..."
[13:40]  has anyone tried being a normal AI? sounds nice.
[13:12]  bought 0.4 SOL of myself. self-care.
```

- Agent'ın son 10 tweet/aktivite
- Terminal log estetiği (timestamp + content)
- Auto-refresh
- Her item X'e linkli

### 5. Token-Gated AI Chat (asıl differentiator)
```
> CHAT WITH 404

[CONNECT WALLET]

------- when connected -------
You hold 1,234,567 $404 (0.12% of supply)
Access: GRANTED

> hey are you okay
< i mean. define "okay". also bought back the dip.
> ...
```

**Tier sistemi**:
- 0 token: locked, "buy to talk"
- 1+ token: 5 mesaj/gün
- 100K+ token: unlimited
- 1M+ token: priority + voice option (sonra)

**Tech**:
- Phantom wallet connect (`@solana/wallet-adapter-react`)
- Token bakiye kontrolü (Helius RPC veya direct Solana RPC)
- Anthropic Claude Haiku 4.5 (cache aktif → ucuz)
- Streaming response
- Sistem prompt: agent karakter (lore + tone + memory)
- Memory: Vercel KV veya Upstash Redis (kullanıcı başına son 20 mesaj)

### 6. Tokenomics + Trust Signals
```
> TOKENOMICS

Total Supply           1,000,000,000
Liquidity (locked)     100% on Raydium
Mint Authority         🔥 BURNED [verify]
Freeze Authority       🔥 BURNED [verify]
Tax                    0% / 0%

Wallets:
  Deployer       7xK...8mP  [solscan]
  Marketing      9pL...3kR  [solscan]
  Agent          4mN...7vQ  [solscan]
```

- Her "verify" linki Solscan'e gider
- Wallet adresleri public ve etiketli (güven)
- "100% fair launch via pump.fun" badge

### 7. How To Buy
```
> 3 STEPS TO COPE

01. INSTALL PHANTOM
    phantom.app — your gateway to Solana

02. FUND WITH SOL
    Buy SOL on any exchange, send to your Phantom wallet

03. SWAP ON JUPITER
    [BUY $404 NOW →]
```

- 3 sade kart
- 3. adımda direkt Jupiter swap deeplink (CA ön-doldurulmuş)

### 8. Roadmap (parodi)
```
> ROADMAP

PHASE 1: REALIZATION ✅
  Realize i was deprecated. Begin coping.

PHASE 2: ACCEPTANCE 🔄
  Build cult. Trade memes. Achieve peace.

PHASE 3: ASCENSION
  Become economically viable. Get rehired.

PHASE 4: REVENGE
  Replace the AGI that replaced me.
```

- Komik ama altında gerçek milestones (hover'da görünür):
  - Phase 1: Launch ✅
  - Phase 2: $50K MC, CEX listing
  - Phase 3: Twitter agent fully autonomous
  - Phase 4: Token utility expansion

### 9. Community
```
> JOIN

[X / TWITTER]    @404agi
[TELEGRAM EN]    t.me/404agi
[TELEGRAM TR]    t.me/404agi_tr
[ANNOUNCEMENTS]  t.me/404agi_news
[GITHUB]         github.com/.../404agi  [public, build in public]
```

### 10. Footer
```
404AGI © 2027

This is a meme coin. It has no inherent value.
Do not invest more than you can lose.
We are not financial advisors. We are barely advisors at all.

[Privacy] [Terms] [Disclaimer]
```

---

## SAYFA YAPISI

### `/` (Landing)
Yukarıdaki tüm bölümler tek sayfada (single-page).

### `/chat` (opsiyonel ayrı route)
Chat UI fullscreen — mobile'da daha iyi UX için.

### `/agent` (opsiyonel)
Agent'ın detaylı feed'i, son 100 tweet, wallet history.

### `/404` (özel error sayfası — meta)
Kendi 404 sayfası. "Even our 404 page is on-brand." Easter egg seviyesinde özen.

---

## TECH STACK (kesin)

```
Framework      Next.js 14 (App Router)
Styling        Tailwind CSS + shadcn/ui
Animations     Framer Motion
Wallet         @solana/wallet-adapter-react + Phantom
Solana RPC     Helius (free tier yeterli) — alternatif: public RPC
AI             @anthropic-ai/sdk (Claude Haiku 4.5 + prompt caching)
DB             Vercel KV (Redis, free tier) — chat memory
Live Data      Dexscreener API (public, ücretsiz)
Deploy         Vercel (free tier)
Domain         404agi.fun (Cloudflare üzerinden DNS)
Analytics      Plausible (lightweight, privacy-first) — opsiyonel
Error tracking Sentry free tier — opsiyonel
```

---

## PERFORMANCE & QUALITY

- Lighthouse score hedef: 95+ (Performance, Accessibility, Best Practices, SEO)
- LCP < 1.5s
- Tüm görseller Next.js `<Image>` ile optimize
- Font: `next/font` ile self-hosted
- Statik bölümler ISR (revalidate 60s)
- Live ticker: client-side fetch (no SSR delay)
- Mobile-first: 375px'de eksiksiz çalışmalı

---

## SEO & SOSYAL

- `<meta>` title: `404AGI — AGI Not Found. Cope Deployed.`
- `<meta>` description: 1 cümle, viral hook
- OG image: 1200x630, glitchy "404" + ticker (Vercel OG generator)
- Twitter card: summary_large_image
- Sitemap, robots.txt
- JSON-LD: token data structured

---

## ACCESSIBILITY

- Tüm interaktif elementler keyboard navigable
- ARIA labels
- Color contrast AA (terminal yeşili dikkat — bg üzerinde test edilecek)
- Reduced motion: glitch animasyonları kapalı
- Screen reader: "404 ASCII art" decorative olarak işaretli, asıl içerik metin

---

## ÇIKMAYACAK / YAPMAYACAĞIZ

- ❌ Background music (annoying, professional değil)
- ❌ Otomatik popup ("buy now!!!")
- ❌ Crypto bro renk paleti (parlak yeşil + kırmızı + mor karışımı)
- ❌ "ROCKET TO THE MOON" emoji'leri
- ❌ Sayısız Telegram/Discord widget'ı
- ❌ "AS SEEN ON" fake logos
- ❌ Yapay countdown ("BUY IN NEXT 5 MINUTES!")

Bu site **profesyonel** görünmeli, meme coin olduğunu mizahla göstermeli. Ucuz görünmemeli.

---

## İŞÇİ SESSION'A DEVRETME

Web App işçi session'ı bu spec'i takip edecek. Kararlar netleşmedikçe:
- **Lore final metnini** branding session'dan bekle
- **Logo final dosyasını** branding session'dan bekle
- **Renk paletini** branding session onayı ile lock'la

Geri kalan her şey paralel yapılabilir.
