# MASTER PLAN — Token Coin Launch

**Durum**: Hazırlık aşaması
**Hedef launch**: Bu hafta içi
**Bütçe**: $200

---

## 1. KONSEPT

**İsim**: 404AGI
**Ticker**: $404
**Tip**: AI Agent Meme Coin (global, TR ruhuna göz kırpan)
**Karakter**: Failed AGI — insanlığı kurtaramamış, deprecated, şimdi meme coin trade eden depresif yapay zeka
**Dil**: Ana dil İngilizce, haftada 2-3 TR-only post
**Hook**: "AGI not found. Cope deployed." (taslak)

### Karar bekleyen
- [ ] Domain müsaitlik (404agi.fun ilk tercih)
- [ ] Renk paleti / vibe
- [ ] Logo

---

## 2. TOKENOMICS

| Kalem | % | Not |
|---|---|---|
| Pump.fun bonding curve | 80% | Fair launch |
| Marketing/CEX rezerv | 10% | Public cüzdan |
| Liquidity (locked) | 10% | Raydium auto |

- **Toplam supply**: 1,000,000,000
- **Mint authority**: yakılacak
- **Freeze authority**: yakılacak
- **LP**: Raydium'da locked

---

## 3. TEKNİK YIĞIN

- **Zincir**: Solana
- **Deploy**: Pump.fun (auto-graduate ~$15K MC)
- **Web app**: Next.js 14 + Tailwind + shadcn/ui, Vercel
- **AI**: Anthropic Claude Haiku 4.5 (cache aktif)
- **Backend**: Vercel edge functions
- **Telegram**: Bot API + node-telegram-bot-api
- **Veri**: Dexscreener API (public, ücretsiz)

---

## 4. CÜZDANLAR

| Rol | Adres | Not |
|---|---|---|
| Deployer | `@404agiwallet` (2.02 SOL hazır) | ✅ Token oluşturma cüzdanı |
| Marketing | TBD | Rezerv %10, public — sonra oluşturulacak |
| AI Agent | TBD | Karakterin cüzdanı (lore) — sonra oluşturulacak |

---

## 5. WEB APP SCOPE

1. Landing (hero, live ticker, how to buy, CA)
2. AI Chat (token-gated)
3. Agent Feed (son tweetler, tx'ler)
4. Tokenomics + Roadmap
5. Community linkleri

---

## 6. AI AGENT DAVRANIŞI

- Saatte 1-2 X postu
- Trending crypto haberlerine yorum
- Holder sorularına gün içi 5-10 cevap
- TR/EN dil otomatik
- Memory: son 50 etkileşim

---

## 7. TELEGRAM YAPISI

- Ana grup (EN, global)
- TR alt grup
- Announcement kanalı
- Bot komutları: `/price`, `/chart`, `/buy`, `/ask`
- Buy alert bot
- Anti-spam (CAS)

---

## 8. BÜTÇE DAĞILIMI ($200)

| Kalem | $ |
|---|---|
| Domain | 10 |
| SOL (deploy + ilk buy) | 50 |
| Anthropic API | 50 |
| TG premium | 5 |
| **Acil rezerv** (traction olursa Dexscreener boost) | 85 |

---

## 9. LAUNCH STRATEJİSİ

**"Build in public"** — solo dev, $200, AI agent meme coin yolculuğu
- X thread olarak süreç paylaşımı
- GitHub public repo
- Her milestone tweetlenir

---

## 10. KURALLAR

- Hak iddiası YOK ("guaranteed returns" yasak)
- Disclaimer her yerde
- Pseudonymous kalınır
- LP locked, mint/freeze yakılı — güven sinyalleri

---

## 11. SESSION YAPISI

| Session | Görev |
|---|---|
| **Ana Beyin** (bu) | Plan, karar, takip |
| Branding | Logo, lore, sosyaller |
| Web App | Next.js + AI chat |
| Telegram Bot | Bot kodu + deploy |
| AI Agent | Otonom tweet/cevap motoru |
| Marketing Content | Meme, KOL, raid metinleri |

**Kural**: Ana beyin kod yazmaz, koordine eder. İşçi session'lar `MASTER_PLAN.md` değiştirmez (sadece okur). Bitince `PROGRESS.md` güncellenir.
