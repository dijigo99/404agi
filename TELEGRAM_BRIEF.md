# İŞÇİ SESSION BRIEF — TELEGRAM BOT

Bu dosyayı yeni bir Claude Code session'a yapıştır.

---

```
Sen "Telegram Bot" işçi session'ısın. Ana beyin başka bir session'da.

📂 ZORUNLU İLK ADIM:
Şu dosyaları oku:
- MASTER_PLAN.md
- DECISIONS.md
- LAUNCH_TIMELINE.md (Faz 2 → TG Bot kısmı)
- AGENT_BRIEF.md (AI agent endpoint'i ile entegrasyon için)

🎯 PROJE: 404AGI Telegram bot'u
3 entity: ana grup (EN), TR alt grup, duyuru kanalı.

🚧 SCOPE:

1. BOT OLUŞTUR
   - @BotFather'da yeni bot
   - Bot username: @404agi_bot (alternatif: @the404agi_bot)
   - Token alınır, env var'a yazılır

2. KOMUTLAR
   - /price → anlık fiyat & MC (Dexscreener API)
   - /chart → Dexscreener link
   - /buy → Jupiter swap deeplink (CA önceden)
   - /ask <soru> → AI agent'a soru forward (agent endpoint'i)
   - /ca → contract address copy
   - /help → komut listesi

3. BUY ALERT
   - Yeni alımları izler (Solana RPC veya Dexscreener)
   - >$50 alımları gruba duyurur
   - Format: emoji + amount + tx link + balance change

4. AUTO MODERATION
   - Anti-spam: link spam, emoji spam, identical message detection
   - CAS protection (combot.org/cas)
   - Ban hammer: scam wallet adresi paylaşanlar
   - Welcome mesajı (yeni üyelere CAPTCHA + kurallar)

5. AI INTEGRATION
   - @mention veya reply'de bot AI agent'a forward eder
   - TR/EN dil tespit otomatik
   - Rate limit: kullanıcı başına saatte 5 soru

6. DUYURU KANALI BOT
   - Web sitedeki bir API endpoint'inden duyuruları yayınlar
   - Manuel admin komutu: /announce <metin> → kanala post

7. DEPLOY
   - Railway veya Vercel (free tier)
   - 24/7 uptime
   - Healthcheck endpoint

🚫 DOKUNMA:
- /web klasörü
- /agent klasörü (sadece AI agent endpoint'i çağrılır, kodu değişmez)
- /branding klasörü

✅ BİTİNCE:
1. /telegram altında çalışan Node.js/TypeScript projesi
2. Bot test grubunda canlı, tüm komutlar çalışıyor
3. Buy alert template hazır (CA placeholder)
4. README: kurulum, env vars, deploy
5. PROGRESS.md güncelle
6. Commit: "[coin-tg] bot komutları + buy alert + moderation"

❓ KARAR GEREKİRSE:
Ana beyne dön.

⏱ TAHMİNİ SÜRE: 3-4 saat

Başla.
```
