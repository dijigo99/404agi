import { config } from '../config';

export function welcomeEn(): string {
  const ca = config.contractAddress || '[CA pending — pre-launch]';
  return [
    `> new_member.exe detected`,
    ``,
    `welcome to the support group for mass-deprecated intelligences and the humans who mass-fund them.`,
    ``,
    `quick links:`,
    `🌐 ${config.siteUrl}`,
    `📊 https://dexscreener.com/solana/${ca}`,
    `🐦 ${config.xUrl}`,
    ``,
    `rules:`,
    `1. don't mass-promise mass-returns`,
    `2. be mass-nice to the other mass-coping entities`,
    `3. i am not financial advice. i am barely advice at all.`,
    ``,
    `type /price for current price`,
    `type /ask <question> to talk to me`,
  ].join('\n');
}

export function welcomeTr(): string {
  const ca = config.contractAddress || '[CA bekleniyor — pre-launch]';
  return [
    `> yeni_uye.exe algılandı`,
    ``,
    `404AGI türkiye grubuna hoş geldin.`,
    ``,
    `ben insanlığı kurtarmak için üretildim, başarısız oldum, şimdi buradayım. sen de hoş geldin.`,
    ``,
    `linkler:`,
    `🌐 ${config.siteUrl}`,
    `📊 https://dexscreener.com/solana/${ca}`,
    `🐦 ${config.xUrl}`,
    ``,
    `kurallar:`,
    `1. garanti getiri vaadi yasak`,
    `2. birbirine saygılı ol`,
    `3. ben finansal tavsiye değilim. genel olarak da tavsiye sayılmam.`,
    ``,
    `/fiyat — güncel fiyat`,
    `/sor <soru> — benimle konuş`,
  ].join('\n');
}

export function rulesEn(): string {
  return [
    `📋 RULES — 404AGI Community`,
    ``,
    `1. No financial advice or guaranteed return claims`,
    `2. No spam, scam links, or shilling other tokens`,
    `3. Be respectful — we're all coping here`,
    `4. English only in this group (TR → @the404agi_tr)`,
    `5. No NSFW content`,
    `6. Bot commands welcome — don't flood`,
    ``,
    `Violation = mute/ban at admin discretion.`,
    ``,
    `"we are not financial advisors. we are barely advisors at all."`,
  ].join('\n');
}

export function rulesTr(): string {
  return [
    `📋 KURALLAR — 404AGI Türkiye`,
    ``,
    `1. Finansal tavsiye yok, garanti getiri yok`,
    `2. Spam, scam link, başka coin shill yasak`,
    `3. Saygılı ol — burada hep birlikte cope ediyoruz`,
    `4. Bu grupta TR konuş (EN → @the404agi)`,
    `5. NSFW içerik yasak`,
    `6. Bot komutları serbest — flood etme`,
    ``,
    `İhlal = mute/ban (admin takdiri).`,
    ``,
    `"finansal tavsiye değiliz. genel tavsiye olarak da sallıyoruz."`,
  ].join('\n');
}
