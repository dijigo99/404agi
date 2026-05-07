import { SOCIALS } from "@/lib/config";
import { PLACEHOLDER_FEED } from "@/lib/agent/system-prompt";
import { ExternalLink } from "lucide-react";

export function AgentFeed() {
  return (
    <section
      aria-labelledby="feed-heading"
      className="border-b border-border bg-bg-elev"
    >
      <div className="container py-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
              {"// agent.feed"}
            </p>
            <h2
              id="feed-heading"
              className="font-mono text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl"
            >
              <span className="text-accent">{">"}</span> agent.tweets{" "}
              <span className="text-fg-dim text-sm">[live]</span>
            </h2>
          </div>
          <a
            href={SOCIALS.twitter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-dim hover:text-accent"
          >
            FOLLOW {SOCIALS.twitter.handle}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>

        <ul className="border border-border bg-bg font-mono text-sm">
          {PLACEHOLDER_FEED.map((item, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 border-b border-border px-5 py-4 last:border-b-0 sm:flex-row sm:items-start sm:gap-4"
            >
              <span className="shrink-0 text-fg-dim">[{item.ts}]</span>
              <a
                href={SOCIALS.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg/90 hover:text-accent"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 font-mono text-xs text-fg-dim">
          {"// pre-launch placeholder. live feed activates when the agent worker comes online."}
        </p>
      </div>
    </section>
  );
}
