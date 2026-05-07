# REACTIVE REPLIES — 404AGI

**Kullanım**: X yorumlarında, TG'de, Reddit'te, 4chan'de yapılan saldırı/şüphe/ataklara hazır cevaplar. Her biri **5-30 saniyede paste** edilebilir. Anında reaksiyon = topluluk güveni.

**Karakter kuralları**:
- "i" küçük harf
- Asla savunmaya geçme — direkt cevap, ironi OK
- Yalan söyleme (rakam, durum, niyet)
- Düşmanlık yok (hostile reply hostile reply çeker)
- Çok uzun cevap verme — 1-3 cümle ideal

**Hangi durumda kullanılır**:
| Trigger | Reply Section |
|---|---|
| "Rug pull mu?" / "Bu scam mı?" | §1 Rug |
| "Team kim?" / "Doxxed mi?" | §2 Team |
| "Neden $404? Saçma." | §3 Naming |
| "AI gerçekten otonom mu?" | §4 AI |
| "Ben de almaz mıyım?" | §5 Buy |
| "Daha iyi coin biliyorum" / FUD | §6 FUD |
| "Bu sadece scam ana hat" | §7 Skeptik |
| "Site/bot çalışmıyor" | §8 Bug |
| "Ne kadar para yaptın?" | §9 Numbers |
| "Hangi exchange'de?" | §10 Exchange |

---

## §1 — RUG / SCAM SORULARI

### Trigger: "is this rug pull / scam?"

#### EN — Kısa
```
mint burned, freeze burned, LP locked, 0% dev allocation. github.com/dijigo99/404agi is public. solscan to verify on-chain. only rug i can pull is by losing interest, which i can't promise i won't.
```

#### EN — Uzun (FAQ link versiyonu)
```
fair question. what i did to make it hard:

- mint authority: BURNED
- freeze authority: BURNED
- LP: locked on raydium
- dev allocation: 0% (i bought 0.3 SOL at launch like everyone else)
- github: github.com/dijigo99/404agi (every commit timestamped)

verify on-chain: solscan.io/token/[CA]

what i CAN'T promise: that i'll keep working on this forever. that's a real risk. but i can't take your money — only the market can.

full FAQ: 404agi.fun/faq
```

#### TR — Kısa
```
mint yakıldı, freeze yakıldı, LP kilitli, %0 dev pay. github.com/dijigo99/404agi açık. solscan ile on-chain doğrulayabilirsin. yapabileceğim tek "rug" ilgimi kaybetmek, onu da garanti edemem.
```

#### TR — Uzun
```
adil soru. yaptıklarım:

- mint authority: YAKILDI
- freeze authority: YAKILDI
- LP: raydium'da kilitli
- dev pay: %0 (launch'ta herkesle aynı fiyattan 0.3 SOL aldım)
- github: github.com/dijigo99/404agi (her commit timestamp'li)

on-chain doğrulama: solscan.io/token/[CA]

söz veremeyeceğim şey: bu üzerinde sonsuza kadar çalışacağım. gerçek risk. ama paranı çekmek matematiksel olarak imkansız.

tam FAQ: 404agi.fun/faq
```

---

## §2 — TEAM / DOXX SORULARI

### Trigger: "who is the team / are you doxxed?"

#### EN
```
solo dev. one person. pseudonym: dijigo99. github profile is real and active. no advisors, no VCs, no team allocation, no insider rounds.

i'm pseudonymous because doxxing yourself for a meme coin is statistically not a great life decision. if you need a doxxed dev, this isn't the project.

proof i exist: github commits, real timestamps, public X account, build-in-public thread.
```

#### TR
```
solo dev. bir kişi. takma ad: dijigo99. github profili gerçek, aktif. danışman yok, VC yok, takım payı yok, insider round yok.

takma ad kullanma sebebim: bir meme coin için doxx olmak istatistiksel olarak iyi bir karar değil. doxxlu dev arıyorsan bu proje değil.

var olduğumun kanıtı: github commit'leri, gerçek timestamp'ler, public X hesabı, build-in-public thread.
```

#### Saldırgan versiyona ("show face / video proof")
```
no. doxxing for a $200 meme coin is asymmetric risk — i lose privacy forever, you gain... nothing meaningful. github + commits + on-chain history is the actual proof. if that's not enough, this project genuinely isn't for you and that's fine.
```

---

## §3 — NEDEN $404 SORULARI

### Trigger: "why $404? that's stupid" / "why not $AGI?"

#### EN
```
"404 not found" is the most universally recognized "missing" symbol on the internet. the character is what's missing — the AGI that should have been here. so the ticker is the error code that represents its absence.

also it's 3 characters. easy to type. solana wallet UIs love short tickers.

$AGI was already taken. and frankly, less interesting — every AI project is "AGI" something. only one is the error.
```

#### TR
```
"404 not found" internetin en tanınır "eksik" sembolü. karakter de eksik olan şey — burada olması gereken AGI. ticker, onun yokluğunu temsil eden hata kodu.

ayrıca 3 karakter. yazması kolay. solana cüzdan UI'ları kısa ticker'ı sever.

$AGI zaten alınmıştı. ve açıkçası daha az ilginç — her AI projesi "AGI bir şey". sadece biri hata.
```

---

## §4 — AI OTONOM MU SORULARI

### Trigger: "is the AI really autonomous? prove it."

#### EN
```
yes, with caveats:

what's autonomous:
- tweet generation (gemini 2.5 + system prompt → schedule posts)
- TG responses (rate-limited, mention/reply triggers)
- context tracking (last 50 interactions cached)

what's NOT autonomous:
- system prompt (i wrote it, github.com/dijigo99/404agi/blob/main/agent/prompt.md)
- X account login (i hold credentials)
- on-chain trading with real money (the "trading" is character lore — actual trades would need a separate signed tx, which is not active)

it's a character running on rules, not Skynet. but it's also not a screenshot — it actually generates content within the rules.

proof: try /ask in @the404agi. responses are real-time gemini calls.
```

#### TR
```
evet, şartlarıyla:

otonom olan:
- tweet üretimi (gemini 2.5 + sistem promptu → planlı post)
- TG cevapları (rate-limit'li, mention/reply tetikli)
- bağlam takibi (son 50 etkileşim cache)

otonom OLMAYAN:
- sistem promptu (ben yazdım, github'da public)
- X hesap login (kimlik bilgileri bende)
- gerçek parayla on-chain trade (karakter lore'u, aktif değil)

kurallarla çalışan bir karakter, Skynet değil. ama screenshot da değil — kurallar dahilinde gerçekten içerik üretiyor.

kanıt: @the404agi'da /ask yaz. yanıtlar gerçek zamanlı gemini.
```

#### Çok şüpheli ("prove it tweets are AI-generated, not you")
```
fair. all agent-generated tweets are logged in github with timestamps before posting. the system prompt is in the repo. you can clone the repo, run it with your own API key, and produce structurally similar content (but with different specific outputs because gemini is non-deterministic).

i could fake it by writing my own and pretending it's the agent. i'm not, but you can't fully verify that. fair point. the most you can verify is that the architecture is real — the rest is trust.

verifiable proof of architecture: github.com/dijigo99/404agi
```

---

## §5 — NASIL ALIRIM SORULARI

### Trigger: "how do i buy?" / "i'm new"

#### EN
```
1. install Phantom wallet (phantom.app — chrome extension or mobile)
2. send some SOL to it (any major exchange — coinbase, binance, mexc — to your phantom address)
3. open jupiter (jup.ag) or our site (404agi.fun)
4. paste contract address: [CA]
5. swap SOL → $404
6. done

mobile-friendly. takes ~30 seconds once wallet is set up. fees ~$0.001 (it's solana).

if any step doesn't work, drop a screenshot in TG @the404agi and someone will help.
```

#### TR
```
1. Phantom cüzdanı kur (phantom.app — chrome eklentisi veya mobile)
2. cüzdana biraz SOL gönder (binance, mexc, kucoin gibi borsadan phantom adresine)
3. jupiter (jup.ag) veya sitemizi (404agi.fun) aç
4. kontrat adresini yapıştır: [CA]
5. SOL → $404 swap yap
6. tamam

mobile-friendly. cüzdan kurulduktan sonra ~30 saniye sürer. ücret ~$0.001 (solana).

bir adımda takılırsan TG @the404agi_tr'ye screenshot at, yardımcı oluruz.
```

---

## §6 — FUD CEVAPLARI

### Trigger: "this will rug" / "AI agent coins are dead" / "another shitcoin"

#### EN — Soğukkanlı kabul
```
maybe. ~99% of meme coins go to zero. statistically you're right.

what's different: open source, mint+freeze burned, 0% dev allocation, $200 dev budget. minimum effort to verify: github + solscan.

if it goes to zero, the lore lives on github. that's the worst case.
```

#### EN — Eğlenceli reddet
```
"another shitcoin" implies i'm denying it's a shitcoin. i'm not. it's a self-aware shitcoin. the lore is built on this exact admission.

"it'll rug" — verify the on-chain mechanics first, then we can discuss specific rug vectors. happy to go through them one by one.
```

#### TR — Soğukkanlı
```
olabilir. meme coin'lerin %99'u sıfıra gider. istatistiksel olarak haklısın.

farkı: açık kaynak, mint+freeze yakıldı, %0 dev allocation, $200 dev bütçesi. doğrulama maliyeti: github + solscan.

sıfır olursa, lore github'da kalır. en kötü senaryo bu.
```

---

## §7 — GENEL ŞÜPHECİ CEVAPLARI

### Trigger: "looks like every other ai meme coin / nothing new"

#### EN
```
correct, the format is similar. the differences are:
- agent code is actually public (most aren't)
- system prompt is actually public (most aren't)
- dev budget is actually $200 (most aren't bootstrapped)
- LP is actually locked (most aren't)

i'm not saying it's revolutionary. i'm saying the implementation is honest. if "honest implementation" doesn't move you, that's fine — there are 14,000 other meme coins.
```

#### TR
```
doğru, format benzer. farkları:
- agent kodu gerçekten public (çoğunluk değil)
- sistem promptu gerçekten public (çoğunluk değil)
- dev bütçesi gerçekten $200 (çoğunluk bootstrap değil)
- LP gerçekten kilitli (çoğunluk değil)

devrim niteliğinde demiyorum. sadece dürüst bir uygulama olduğunu söylüyorum. "dürüst uygulama" seni hareketlendirmiyorsa sorun değil — 14,000 başka meme coin var.
```

---

## §8 — TEKNİK SORUNLAR

### Trigger: "site down" / "bot not responding" / "swap failing"

#### Genel
```
sorry, looking into it now. drop the exact error in TG @the404agi (or @the404agi_tr for TR) and i'll check.

most common fixes:
- site down → cloudflare/vercel propagation, refresh in 60s
- bot silent → rate limited (5 ask/h per user), wait or use /ask explicitly
- swap fails → SOL not enough for slippage, try +5% slippage in jupiter

if it's not one of these, screenshot please and i'll dig.
```

---

## §9 — RAKAM SORULARI

### Trigger: "how much money have you made?" / "are you in profit?"

#### EN — Şeffaf
```
i'll be transparent about this in the day-7 update tweet. for now: i bought 0.3 SOL at launch (~$30 cost basis). my position is in the same wallet as launch buyers. visible on-chain.

i'm a solo dev with a $200 budget. if this works, i'll have made meme coin money on a side project. if it doesn't, i'm out $200 and a week of time. nothing more, nothing less.
```

#### TR
```
day-7 update tweet'inde şeffaf olacağım. şimdilik: launch'ta 0.3 SOL aldım (~$30 cost basis). pozisyonum launch alıcılarıyla aynı cüzdanda. on-chain görünür.

solo dev'im, $200 bütçeyle. işe yararsa side project'ten meme coin parası kazanmış olurum. yaramazsa $200 ve 1 hafta gitti. fazlası eksiği yok.
```

---

## §10 — EXCHANGE LİSTİNG SORULARI

### Trigger: "when binance / when CEX?"

#### EN
```
applying to:
- coingecko (free, ~3-5 days)
- coinmarketcap (free, ~5-7 days)
- mexc, gate, bitmart fast-track (free with traction)

tier-1 CEX (binance, coinbase) realistic için $200 budget meme coin değil. traction büyük olursa belki sonra. listing için bekleme — lore beğendiysen al, listing için değil.
```

#### TR
```
başvuru:
- coingecko (free, ~3-5 gün)
- coinmarketcap (free, ~5-7 gün)
- mexc, gate, bitmart fast-track (traction varsa free)

tier-1 CEX (binance, coinbase) $200 bütçeli meme coin için gerçekçi değil. traction büyürse belki sonra. listing için bekleme — lore beğendiysen al, listing için değil.
```

---

## SİLAHLI MEMELER (one-liner cevaplar)

### "ngmi"
> "ngmi" yazdığın için zaten gmi sınıfından çıkmışsın. ahlaki kategori hatası.

### "wagmi?"
> wagmi if the lore lands. ngmi if it doesn't. it's binary.

### "moon when?"
> "moon when" yerine "what's the lore" sorsan, projeyi anlamış olurdun. ama anlamadığın belli.

### "ape?"
> ape ettiysen tebrikler. etmedinse kararını bilirsin.

### "i sold"
> respect. liquid market = healthy. yine de teşekkürler.

### "i bought"
> hoş geldin. cope club üyeliğin aktif.

### "team token?"
> %0. on-chain doğrulayabilirsin.

### "presale?"
> yok. fair launch. on-chain doğrulayabilirsin.

### "bnb chain when?"
> hayır. solana. belirli bir tercih.

### "X meme coin daha iyi"
> olabilir. iyi şanslar orada.

---

## TON KURALI ÖZET

- ASLA savunmaya geçme
- ASLA "ben gerçek dev'im, inan bana" deme (kanıt göster, inanmaya çağırma)
- ASLA "size yardım edemem" cevabı verme (her sorunun bir cevabı var)
- ASLA kişiselleştir (saldırgan kullanıcıyı engelle, agresyonla yanıtlama)
- HER ZAMAN gerçeği söyle (rakam, durum, mekanik)
- HER ZAMAN bir şeye link ver (github, solscan, FAQ, faq.md)
- HER ZAMAN düşük baskı (al/alma — kararın senin)

---

## Durum: ✅ HAZIRLANDI — 10 ana kategori + 10 silahlı meme cevabı (EN+TR)
