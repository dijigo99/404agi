# COLOR PALETTE — 404AGI (Final)

WEBSITE_SPEC.md paletini onaylıyoruz. Değişiklik yok.

---

## Ana Palet

| Token | Hex | RGB | Kullanım |
|---|---|---|---|
| `--bg` | `#0a0a0a` | 10, 10, 10 | Ana arka plan |
| `--bg-elev` | `#141414` | 20, 20, 20 | Card, panel |
| `--fg` | `#f5f5f5` | 245, 245, 245 | Ana metin |
| `--fg-dim` | `#888888` | 136, 136, 136 | İkincil metin |
| `--accent` | `#00ff41` | 0, 255, 65 | Terminal yeşili — CTA, vurgu, logo |
| `--error` | `#ff3b30` | 255, 59, 48 | "404" kırmızısı, danger, hata |
| `--warn` | `#ffaa00` | 255, 170, 0 | Uyarı elementleri |
| `--border` | `#222222` | 34, 34, 34 | Border, divider |

## Glitch Efekt Paleti

| Token | Hex | Kullanım |
|---|---|---|
| `--glitch-1` | `#ff00ff` | Magenta — chromatic aberration sol |
| `--glitch-2` | `#00ffff` | Cyan — chromatic aberration sağ |

## Tipografi

| Rol | Font | Kullanım |
|---|---|---|
| Primary | JetBrains Mono | Heading, code, ticker, accent |
| Body | Inter | Paragraf, gövde, formlar |
| Display | Space Grotesk | Hero rakamlar (opsiyonel) |

## Kullanım Kuralları

- **CTA butonları**: `--accent` bg, `--bg` text
- **Hover**: `--accent` %80 opacity
- **Linkler**: `--accent` renk, underline yok
- **Error state**: `--error` renk
- **Glitch efekt**: Sadece hero + hover animasyonlarında, aşırıya kaçmamak
- **Kontrastlar**: `--accent` on `--bg` = 15.3:1 (AAA ✅), `--fg` on `--bg` = 19.4:1 (AAA ✅)

## Durum: ✅ ONAYLANDI
