/**
 * Trigger a wallet-event tweet locally. Useful for testing the lore hook.
 *
 *   npm run wallet:tweet -- --kind=self_buy --sol=0.05
 *   npm run wallet:tweet -- --kind=milestone --label=first_100_holders --note="100 holders"
 */

import { walletEventTweet, type WalletEvent } from "../src/hooks/wallet.js";

function arg(name: string): string | undefined {
  const flag = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(flag));
  return hit?.slice(flag.length);
}

async function main() {
  const kind = arg("kind") ?? "self_buy";
  let event: WalletEvent;
  switch (kind) {
    case "self_buy":
      event = { kind: "self_buy", sol: Number(arg("sol") ?? "0.05"), note: arg("note") };
      break;
    case "tip_received":
      event = { kind: "tip_received", sol: Number(arg("sol") ?? "0.1"), from: arg("from"), note: arg("note") };
      break;
    case "milestone":
      event = { kind: "milestone", label: arg("label") ?? "milestone", note: arg("note") ?? "milestone reached" };
      break;
    case "balance_low":
      event = { kind: "balance_low", sol: Number(arg("sol") ?? "0.05") };
      break;
    default:
      console.error(`unknown kind: ${kind}`);
      process.exit(2);
  }

  const tweet = await walletEventTweet(event!);
  console.log("");
  console.log(`[wallet:${tweet.kind}] (${tweet.text.length} chars)`);
  console.log("─".repeat(60));
  console.log(tweet.text);
  console.log("─".repeat(60));
  console.log(`logged → see TWEET_LOG_PATH\n`);
}

main().catch((err) => {
  console.error("error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
