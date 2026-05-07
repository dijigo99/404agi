# PRE-LAUNCH CHECKLIST — 404AGI

Launch'tan önce **bitmemesi durumunda launch ETMEYECEĞİMİZ** kalemler ⚠️ ile işaretli.

---

## ⚠️ KRİTİK (bitmeden launch yok)

### Kullanıcı (manuel)
- [ ] ⚠️ Domain alındı: `404agi.fun`
- [ ] ⚠️ X hesabı açıldı, handle alındı
- [ ] ⚠️ Telegram 3 entity oluşturuldu (ana, TR, kanal)
- [ ] ⚠️ Phantom cüzdan kuruldu, seed güvende
- [ ] ⚠️ 0.5+ SOL cüzdana yüklendi
- [ ] ⚠️ Anthropic API key + kredi
- [ ] ⚠️ GitHub repo açıldı

### Web App
- [ ] ⚠️ Vercel'de canlı, custom domain bağlı
- [ ] ⚠️ Hero + manifesto + tokenomics + how-to-buy çalışıyor
- [ ] ⚠️ Wallet connect çalışıyor (Phantom)
- [ ] ⚠️ AI chat token-gated çalışıyor (en az test moduyla)
- [ ] ⚠️ Mobile responsive (375px test)
- [ ] ⚠️ Contract address placeholder'ı **launch'tan sonra** güncellenebilir hale getirildi (env var)

### Branding
- [ ] ⚠️ Logo final (PNG transparent + SVG)
- [ ] ⚠️ Favicon
- [ ] ⚠️ X profile pic + banner
- [ ] ⚠️ TG profile pic
- [ ] ⚠️ OG image (1200x630)

### Token
- [ ] ⚠️ Pump.fun deploy formu hazır (isim, ticker, açıklama, görsel önceden hazırla)
- [ ] ⚠️ Token açıklaması (250 char, viral)

---

## YÜKSEK ÖNCELİK (kuvvetli launch için)

### İçerik
- [ ] X bio + pinned tweet hazır
- [ ] İlk 5 tweet planlandı (lore + teaser + launch)
- [ ] TG ana grup açıklaması + kuralları
- [ ] TG TR grup açıklaması
- [ ] Duyuru kanalı pinned post
- [ ] 10-15 hazır meme görseli klasörde
- [ ] Build-in-public thread'i (5 tweet) hazır

### AI Agent
- [ ] Sistem promptu yazıldı
- [ ] Tweet kuyruğu (ilk 20 tweet generate edildi)
- [ ] TR/EN dil otomasyonu test edildi
- [ ] Holder sorularına test cevapları geçti

### Telegram Bot
- [ ] Bot oluşturuldu (@BotFather)
- [ ] Komutlar test edildi: `/price`, `/chart`, `/buy`, `/ask`
- [ ] Buy alert template hazır (CA placeholder)
- [ ] Anti-spam ayarları aktif

### Marketing
- [ ] KOL listesi (10-20 kişi) — handle, takipçi, fiyat (varsa)
- [ ] DM template (EN + TR) hazır
- [ ] Reddit r/CryptoMoonShots post hazır
- [ ] TG raid metinleri (kısa + uzun, EN + TR) hazır
- [ ] 4chan /biz/ thread (uygunsa) hazır

---

## ORTA ÖNCELİK (olsa iyi olur)

- [ ] Discord server (opsiyonel — meme coin'lerde TG ağırlık)
- [ ] Plausible analytics web sitede
- [ ] Sentry error tracking
- [ ] OG image variants (3-4 tane)
- [ ] Easter eggs (404 sayfası, console messages)
- [ ] AI agent için ses opsiyonu (sonraki phase)
- [ ] Holder leaderboard (sonraki phase)

---

## LAUNCH ANI CHECKLIST (T-30 dakika başla)

- [ ] Tüm session'lar online (kullanıcı + ana beyin)
- [ ] Web sitesi son kez kontrol (mobile + desktop)
- [ ] Phantom cüzdanda yeterli SOL var (deploy + buy + gas)
- [ ] Pump.fun açık, deploy formu önceden doldurulmuş (sadece submit kalmış)
- [ ] Marketing rezerv cüzdan adresi public listede
- [ ] X pinned tweet hazır (CA için "____" placeholder'ı var)
- [ ] TG ana grup hazır mesajları stage'de
- [ ] KOL DM listesi açık, "send" tuşuna basmaya hazır
- [ ] Build-in-public thread launch tweeti hazır

**T anı**:
1. Pump.fun submit
2. Kendi alımın (Jupiter veya pump.fun directly)
3. Web sitede CA env var güncellenir → redeploy (~30 saniye)
4. X pinned: CA güncelle, launch tweeti at
5. TG: CA paylaş + buy bot CA ile aktive
6. KOL DM'leri gönder
7. Reddit + TG raid başlat

---

## PİSLİK SENARYOLARI (önceden hazır olalım)

### Senaryo: Sniper bot 1. blokta %20 alıyor
- **Önlem**: Pump.fun otomatik sniper'a karşı bir şey yapmıyor ama küçük launch'larda az ilgi çekiyor
- **Aksiyon**: Eğer 1 cüzdan %5+ alırsa public şekilde "sniper" olarak işaretle, topluluğa "rotate" çağrısı yap

### Senaryo: Domain çalışmıyor (DNS propagation)
- **Önlem**: Cloudflare DNS önceden ayarlı, TTL düşük
- **Plan B**: Vercel default URL (`404agi.vercel.app`) ilk saatte fallback

### Senaryo: AI chat çalışmıyor (API rate limit)
- **Önlem**: Anthropic'te kredi yüklü, rate limit kontrol edildi
- **Plan B**: "Agent is taking a break, try again in 5 min" graceful degradation

### Senaryo: Wallet connect kırılıyor
- **Önlem**: Pre-launch testlerde 3 farklı device + 3 farklı browser
- **Plan B**: WalletConnect alternative, fallback "manual mode"

### Senaryo: Telegram bot down
- **Önlem**: Vercel veya Railway'de deploy, healthcheck
- **Plan B**: Manuel cevaplar (kullanıcı + ana beyin)

### Senaryo: 0 ilgi gösteriliyor
- **Önlem**: İlk dalga arkadaş çevresi (10-20 organik)
- **Plan B**: 6 saat sonra Dexscreener boost ($50), KOL outreach 2. dalga

### Senaryo: AI agent yanlış şey diyor (hassas konu)
- **Önlem**: Sistem promptunda hard rules (politik, dini, saldırgan içerik)
- **Plan B**: Anında manuel intervention, post sil, özür mesajı

---

## SAYISAL HEDEFLER (track edilecek)

### T+1h
- 10+ holder
- $2K+ MC
- 20+ X takipçi
- 30+ TG üye

### T+6h
- 30+ holder
- $5K+ MC
- 100+ X takipçi
- 80+ TG üye

### T+24h
- 50-100+ holder
- $10K-30K+ MC
- 200+ X takipçi
- 100-150+ TG üye

### T+7d
- 200+ holder
- $20K-100K+ sürdürülebilir MC
- 1K+ X takipçi
- 500+ TG üye

Sayılar tutmazsa: paniğe gerek yok, **sürdürülebilir grind** > 1 günlük spike.
