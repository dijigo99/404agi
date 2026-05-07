# İŞÇİ SESSION BRIEF TEMPLATE

Yeni bir işçi session açtığında ilk mesaj olarak bu template'i doldurup yapıştır:

---

```
Sen bir işçi session'sın. Ana beyin başka bir session'da çalışıyor.

📂 ZORUNLU İLK ADIM:
Şu 3 dosyayı oku, içeriği özümse:
- MASTER_PLAN.md (proje kılavuzu — değiştirmen YASAK)
- DECISIONS.md (verilen kararlar)
- PROGRESS.md (canlı durum)

🎯 GÖREVİN:
[BURAYA GÖREVİ YAZ — örn: "Web app landing page'i kur"]

🚧 SCOPE (sadece bu, fazlası değil):
- [Madde 1]
- [Madde 2]

🚫 DOKUNMA:
- MASTER_PLAN.md (yalnız oku)
- Diğer worktree'lerin dosyaları
- [Diğer no-touch alanlar]

✅ BİTİNCE:
1. PROGRESS.md'yi güncelle (durum + neyi değiştirdin)
2. Commit at, mesajda session adını yaz: "[coin-web] landing page hero done"
3. Ana beyne dön ve "[session-adı] görev tamam" de

❓ SORU GEREKİRSE:
Ana beyne dön, sorma — kendi başına karar verme. Tüm önemli kararlar ana beyinde alınır.

Başla.
```

---

## Hazır brief örnekleri

### Branding session
```
🎯 GÖREVİN: Logo, X bio, pinned tweet, TG açıklamaları
🚧 SCOPE: Sadece /branding klasörü
✅ BİTİNCE: 5 logo varyantı, 3 tweet taslağı
```

### Web App session
```
🎯 GÖREVİN: Next.js skeleton + landing page
🚧 SCOPE: Sadece /web klasörü, route: /
🚫 DOKUNMA: AI chat endpoint (başka session'da yapılacak)
✅ BİTİNCE: Vercel'e deploy, URL'i PROGRESS.md'ye yaz
```

### Telegram Bot session
```
🎯 GÖREVİN: Bot kodu + komutlar (/price, /chart, /buy, /ask)
🚧 SCOPE: /telegram klasörü
🚫 DOKUNMA: Web app, agent kodu
✅ BİTİNCE: Test grubunda canlı bot
```

### AI Agent session
```
🎯 GÖREVİN: Otonom tweet/cevap motoru
🚧 SCOPE: /agent klasörü
🚫 DOKUNMA: Web app UI
✅ BİTİNCE: Cron çalışıyor, test tweetleri loglanıyor
```

### Marketing Content session
```
🎯 GÖREVİN: 20 meme görseli, 10 tweet taslağı, KOL listesi, raid metni
🚧 SCOPE: /marketing klasörü
✅ BİTİNCE: Tüm dosyalar /marketing altında
```
