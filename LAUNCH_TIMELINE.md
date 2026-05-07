# LAUNCH TIMELINE — 404AGI

Faz bazlı plan. Saatler "T-saati" referans alınarak. T = launch anı (pump.fun deploy).

---

## FAZ 0 — Hazırlık Sıfır (TAMAMLANDI ✅)

- [x] Konsept netleşti
- [x] İsim + ticker karar
- [x] Karakter karar
- [x] Bütçe netleşti
- [x] Session yapısı kuruldu

---

## FAZ 1 — Foundation (T-18h ila T-14h, ~4 saat)

**Kullanıcı + Ana Beyin birlikte yapacak**

### Sosyal & Domain (kullanıcı manuel)
- [ ] Domain al — `404agi.fun` (yedek `404agi.xyz`)
- [ ] X hesabı aç — `@404agi` veya alternatif
- [ ] Telegram: 3 entity oluştur
  - Ana grup (EN): `t.me/404agi`
  - TR alt grup: `t.me/404agi_tr`
  - Duyuru kanalı: `t.me/404agi_news`
- [ ] Phantom cüzdan kur (mobile + extension), 12-word seed güvenli yere
- [ ] 0.5-1 SOL al (deploy + initial buy için, ~$50-100)
- [ ] Anthropic API key oluştur (console.anthropic.com), $50 kredi yükle
- [ ] GitHub repo aç: `404agi` — public, readme var

### Kod altyapısı (ana beyin → işçi sessions)
- [ ] **Branding session aç** → `BRANDING_BRIEF.md` brief'i ile
- [ ] **Web App session aç** → `WEB_APP_BRIEF.md` brief'i ile
- [ ] Repo'da 3 klasör: `/web`, `/agent`, `/telegram`

**Bu fazın çıktısı**: tüm hesaplar açık, repo hazır, branding kavramları onaylı.

---

## FAZ 2 — Build (T-14h ila T-6h, ~8 saat)

**4 işçi session paralel çalışıyor**

### Branding session (3-4 saat)
- [ ] Logo (5 varyant, en iyi seçilir)
- [ ] Renk paleti netleşir
- [ ] X bio + pinned tweet (3 varyant)
- [ ] TG açıklama metinleri (ana, TR, kanal)
- [ ] 10-15 hazır meme görseli klasörde
- [ ] Lore (1 paragraf origin story, web sitede kullanılacak)
- [ ] Tagline finalize

### Web App session (6-8 saat)
- [ ] Next.js 14 skeleton + Tailwind + shadcn
- [ ] Landing page tüm bölümler (`WEBSITE_SPEC.md`'ye göre)
- [ ] Live ticker (Dexscreener API)
- [ ] Wallet connect (Phantom)
- [ ] Token-gated AI chat (Anthropic Claude Haiku 4.5)
- [ ] Agent feed embed
- [ ] Vercel deploy + custom domain
- [ ] SEO + OG image
- [ ] Mobile responsive

### AI Agent session (4-5 saat)
- [ ] Sistem promptu yazılır (karakter)
- [ ] Tweet generator (cron'a hazır, X API gelene kadar manuel kuyruk)
- [ ] Memory store (son 50 etkileşim)
- [ ] TR/EN dil otomasyonu
- [ ] Test postlar (gerçek X'e gönderilmez, log'a yazılır)

### Telegram Bot session (3-4 saat)
- [ ] Bot oluştur (@BotFather)
- [ ] Komutlar: `/price`, `/chart`, `/buy`, `/ask`
- [ ] AI chat entegrasyonu
- [ ] Buy alert hazır (launch'tan sonra contract address eklenecek)
- [ ] Anti-spam (CAS protection)
- [ ] Test grubunda canlı

**Bu fazın çıktısı**: ürün canlı (token'sız), agent hazır, bot çalışıyor.

---

## FAZ 3 — Pre-Launch Hype (T-6h ila T-1h, ~5 saat)

**Marketing Content session + Ana Beyin koordine**

- [ ] Web sitesi canlı: `404agi.fun` — countdown timer "T-XX hours"
- [ ] X hesabı: pinned tweet + 3-5 lore tweeti (planlı)
- [ ] TG ana grup: ilk 10-20 organik üye (arkadaş çevresi, kullanıcı tetiklesin)
- [ ] AI agent: ilk 3-5 tweet manuel olarak post edilir (lore + teaser)
- [ ] KOL listesi finalize: 10-20 mikro-influencer DM hazır
- [ ] Reddit, Discord, TG raid metinleri klasörde
- [ ] Build-in-public thread'i hazır (ilk 5 tweet)

**Bu fazın çıktısı**: launch öncesi 50-100 X takipçi, 30-50 TG üye, hype var.

---

## FAZ 4 — LAUNCH (T-0)

**Saat T'de:**
1. [ ] Pump.fun'da token deploy (Phantom ile, ~30 saniye)
2. [ ] Kendi alımın: 0.3-0.5 SOL ($30-50) — ilk fiyat hareketi
3. [ ] Web sitesi güncellenir: contract address embed olur, countdown kalkar
4. [ ] X pinned tweet: contract address görünür hale getir
5. [ ] TG ana grupta CA paylaşılır
6. [ ] TG buy alert bot CA ile aktive edilir
7. [ ] Build-in-public thread launch tweeti
8. [ ] KOL DM'leri gönder (CA ile birlikte)
9. [ ] Reddit r/CryptoMoonShots post
10. [ ] TR crypto TG'lerine raid (10-15 grup, hazır metinle)

**Bu fazın çıktısı**: T+10 dk içinde ilk 10-20 organic alıcı.

---

## FAZ 5 — İlk 24 Saat (T+0 ila T+24h)

**Yoğun grind — kullanıcı + ana beyin neredeyse sürekli online**

### T+0 ila T+1h
- [ ] Her 10 dakikada AI agent tweet/comment
- [ ] TG'de aktif sohbet (kullanıcı + AI agent)
- [ ] Yeni alıcıları wallet hareketinden takip, hoş geldin mesajı
- [ ] Build-in-public thread güncellenir (gerçek zamanlı)

### T+1h ila T+6h
- [ ] $5K MC kontrol — geldiyse Dexscreener boost ($30-50)
- [ ] $10K MC kontrol — geldiyse 1 mikro-KOL aktive et
- [ ] Telegram'da ilk holder şampiyonları → memes
- [ ] AI agent'ın "ilk reaksiyon" tweetleri

### T+6h ila T+24h
- [ ] CoinGecko + CMC fast-track başvuru ($0)
- [ ] MEXC, Gate, BitMart listing form ($0)
- [ ] AMA duyurusu (T+48h için)
- [ ] AI agent: 1-2 saatte 1 tweet, holder sorularına cevap

**Hedef sonu (T+24h)**:
- 50-100 holder
- $5K-30K peak MC
- 200+ X takipçi
- 100+ TG üye

---

## FAZ 6 — Hafta 1 Sürdürme (T+24h ila T+7d)

**Ana beyin + 1-2 işçi session yeterli, daha sakin tempo**

### Gün 2-3
- [ ] Twitter Space (TR + EN, 1 saat)
- [ ] AI agent v2 — yeni özellikler (örn. cüzdan analiz, memes generator)
- [ ] Web app v2 — agent feed iyileştirmesi, holder leaderboard
- [ ] Partnership girişimleri (3-5 başka meme coin ile mutual shilling)

### Gün 4-5
- [ ] İlk milestone burn veya buyback duyurusu (rezerv'den)
- [ ] AMA (TG'de, 1 saat)
- [ ] Yeni meme dalgası (10-15 fresh content)

### Gün 6-7
- [ ] Hafta özet thread
- [ ] Roadmap v2 duyurusu
- [ ] Topluluk içinde 5-10 aktif üye → ambassador rolü

**Hedef sonu (T+7d)**:
- 200+ holder
- $20K-100K MC sürdürülebilir
- 1K+ X takipçi
- 500+ TG üye
- Coingecko + CMC listed
- 1+ CEX (MEXC veya Gate) başvuru cevap geldi

---

## FAZ 7 — Sustain veya Pivot (T+1w sonrası)

İki olasılık:
- ✅ **Traction var** → Hafta 2-4: Twitter Space'ler, partnerships, AI agent feature drops, CEX listings
- ❌ **Traction yok** → Postmortem, projeden öğren, GitHub repo'su portfolio, sıradakine geç

---

## KRİTİK BAĞIMLILIKLAR (sırayla yapılmalı)

```
[Domain + X + TG] → [Branding] → [Web app deploy]
                                       ↓
                  [Agent + Bot kod]   ↓
                          ↓            ↓
                          → [Pre-launch hype] →
                                                ↓
                                          [LAUNCH] → [İlk 24h grind] → [Sürdürme]
```

Branding session başlamadan web app içeriği yazılamaz (lore, copy gerekiyor).
Web app deploy bitmeden pre-launch yapılamaz (canlı site lazım).
Domain/handle alınmadan branding tamamlanamaz.

**Tek bottleneck**: Faz 1'deki manuel adımlar (kullanıcı yapacak). Hepsi paralel yapılabilir, ~1-2 saatte biter.

---

## ZAMAN BÜTÇESİ

| Faz | Süre | Kritiklik |
|---|---|---|
| Faz 1 (Foundation) | 4h | Bloker |
| Faz 2 (Build) | 8h | Paralel yapılabilir |
| Faz 3 (Pre-launch) | 5h | Bekleme + manual |
| Faz 4 (Launch) | 1h | Yoğun |
| Faz 5 (İlk 24h) | 24h | En yoğun |
| Faz 6 (Hafta 1) | 6 gün | Orta tempo |

**Toplam aktif çalışma**: ~18-24 saat (launch'a kadar) + 24h yoğun + sürdürme.

**Önerilen başlangıç**: Sabah erken kalkış, akşam üstü/geceye launch (TR + US prime time örtüşür).
