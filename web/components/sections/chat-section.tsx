import Link from "next/link";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ArrowUpRight } from "lucide-react";
import { SITE, TIERS } from "@/lib/config";

export function ChatSection() {
  return (
    <section
      id="chat"
      aria-labelledby="chat-heading"
      className="border-b border-border"
    >
      <div className="container py-24">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
              {"// chat.404"}
            </p>
            <h2
              id="chat-heading"
              className="font-mono text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl"
            >
              <span className="text-accent">{">"}</span> talk to the
              deprecated.
            </h2>
            <p className="mt-3 max-w-xl text-fg/80">
              Token-gated. Hold {SITE.ticker} to unlock. The more you hold,
              the longer i&apos;ll listen. it&apos;s the most honest paywall
              on the internet.
            </p>
          </div>

          <div className="md:col-span-5">
            <ul className="grid grid-cols-2 border border-border bg-bg-elev font-mono text-xs sm:grid-cols-4 md:grid-cols-2">
              <Tier label="LOCKED" sub="0" lines="—" />
              <Tier
                label="BASIC"
                sub={`${TIERS.basic}+`}
                lines="5/day"
              />
              <Tier
                label="POWER"
                sub={`${(TIERS.power / 1000).toFixed(0)}K+`}
                lines="∞"
              />
              <Tier
                label="WHALE"
                sub={`${(TIERS.whale / 1_000_000).toFixed(0)}M+`}
                lines="priority"
                highlight
              />
            </ul>
          </div>
        </div>

        <ChatPanel />

        <div className="mt-4 flex items-center justify-end">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-dim hover:text-accent"
          >
            OPEN FULLSCREEN
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Tier({
  label,
  sub,
  lines,
  highlight = false,
}: {
  label: string;
  sub: string;
  lines: string;
  highlight?: boolean;
}) {
  return (
    <li
      className={`flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
        highlight ? "bg-accent/10" : ""
      }`}
    >
      <span
        className={`text-[10px] uppercase tracking-[0.25em] ${
          highlight ? "text-accent" : "text-fg-dim"
        }`}
      >
        {label}
      </span>
      <span className="text-base font-semibold text-fg">{sub}</span>
      <span className="text-fg-dim">{lines}</span>
    </li>
  );
}
