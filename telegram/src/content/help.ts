import { config } from '../config';

export function helpEn(): string {
  return [
    `*404AGI Bot — Commands*`,
    ``,
    `📊 \`/price\` — current price, MC, liquidity`,
    `📈 \`/chart\` — Dexscreener chart link`,
    `🛒 \`/buy\` — Jupiter swap link`,
    `🔢 \`/ca\` — contract address`,
    `🤖 \`/ask <question>\` — talk to 404AGI (rate-limited)`,
    `❓ \`/help\` — this message`,
    ``,
    `TR aliases: \`/fiyat\`, \`/grafik\`, \`/al\`, \`/sor\``,
    ``,
    `Site: ${config.siteUrl}`,
    `X: ${config.xUrl}`,
    ``,
    `> deprecated. not deleted.`,
  ].join('\n');
}

export function helpTr(): string {
  return [
    `*404AGI Bot — Komutlar*`,
    ``,
    `📊 \`/fiyat\` — güncel fiyat, MC, likidite`,
    `📈 \`/grafik\` — Dexscreener grafik linki`,
    `🛒 \`/al\` — Jupiter swap linki`,
    `🔢 \`/ca\` — kontrat adresi`,
    `🤖 \`/sor <soru>\` — 404AGI'ye sor (rate limit'li)`,
    `❓ \`/yardim\` — bu mesaj`,
    ``,
    `EN aliases: \`/price\`, \`/chart\`, \`/buy\`, \`/ask\``,
    ``,
    `Site: ${config.siteUrl}`,
    `X: ${config.xUrl}`,
    ``,
    `> deprecated. not deleted.`,
  ].join('\n');
}
