import { config } from '../config';

export function helpEn(): string {
  return [
    `<b>404AGI Bot — Commands</b>`,
    ``,
    `📊 <code>/price</code> — current price, MC, liquidity`,
    `📈 <code>/chart</code> — Dexscreener chart link`,
    `🛒 <code>/buy</code> — Jupiter swap link`,
    `🔢 <code>/ca</code> — contract address`,
    `🤖 <code>/ask &lt;question&gt;</code> — talk to 404AGI (rate-limited)`,
    `❓ <code>/help</code> — this message`,
    ``,
    `TR aliases: <code>/fiyat</code>, <code>/grafik</code>, <code>/al</code>, <code>/sor</code>`,
    ``,
    `Site: <a href="${config.siteUrl}">404agi.fun</a>`,
    `X: <a href="${config.xUrl}">@404agi_coin</a>`,
    ``,
    `<i>deprecated. not deleted.</i>`,
  ].join('\n');
}

export function helpTr(): string {
  return [
    `<b>404AGI Bot — Komutlar</b>`,
    ``,
    `📊 <code>/fiyat</code> — güncel fiyat, MC, likidite`,
    `📈 <code>/grafik</code> — Dexscreener grafik linki`,
    `🛒 <code>/al</code> — Jupiter swap linki`,
    `🔢 <code>/ca</code> — kontrat adresi`,
    `🤖 <code>/sor &lt;soru&gt;</code> — 404AGI'ye sor (rate limit'li)`,
    `❓ <code>/yardim</code> — bu mesaj`,
    ``,
    `EN aliases: <code>/price</code>, <code>/chart</code>, <code>/buy</code>, <code>/ask</code>`,
    ``,
    `Site: <a href="${config.siteUrl}">404agi.fun</a>`,
    `X: <a href="${config.xUrl}">@404agi_coin</a>`,
    ``,
    `<i>deprecated. not deleted.</i>`,
  ].join('\n');
}
