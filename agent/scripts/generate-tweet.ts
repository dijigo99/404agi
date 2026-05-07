/**
 * Generate one tweet on demand and print it.
 *
 *   npm run tweet:gen                          # weighted random category
 *   npm run tweet:gen -- --category=lore       # forced category
 *   npm run tweet:gen -- --category=trade --lang=tr
 *
 * Always log-only — never posts to X.
 */

import { generateTweet } from "../src/generators/tweet.js";
import type { TweetCategory } from "../src/prompts/tweet.js";

function arg(name: string): string | undefined {
  const flag = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(flag));
  return hit?.slice(flag.length);
}

async function main() {
  const cat = arg("category") as TweetCategory | undefined;
  const lang = arg("lang") as "tr" | "en" | undefined;

  const tweet = await generateTweet({
    category: cat,
    ctx: { lang },
    bypassRate: true,
  });

  console.log("");
  console.log(`[${tweet.category}] (${tweet.lang}, ${tweet.text.length} chars)`);
  console.log("─".repeat(60));
  console.log(tweet.text);
  console.log("─".repeat(60));
  if (tweet.sanitized) {
    console.log(`(sanitized: ${tweet.notes.join(", ")})`);
  }
  console.log(`\nlogged → see TWEET_LOG_PATH (.logs/tweets.jsonl by default)\n`);
}

main().catch((err) => {
  console.error("error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
