"use client";

import { useEffect, useState } from "react";
import { fetchTokenStats, type TokenStats } from "@/lib/dexscreener";
import {
  cn,
  formatCompact,
  formatNumber,
  formatUsd,
} from "@/lib/utils";
import { isLaunched } from "@/lib/config";

export function TickerStrip() {
  const [stats, setStats] = useState<TokenStats | null>(null);

  useEffect(() => {
    let live = true;
    const tick = async () => {
      const s = await fetchTokenStats();
      if (live) setStats(s);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  const live = isLaunched() && stats?.isLive;

  return (
    <section
      aria-labelledby="ticker-heading"
      className="border-b border-border bg-bg-elev"
    >
      <div className="container py-10">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
          <h2 id="ticker-heading">{"// live signals"}</h2>
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full animate-ticker-pulse",
                live ? "bg-accent" : "bg-warn"
              )}
              aria-hidden
            />
            {live ? "LIVE" : "AWAITING DEPLOYMENT"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          <Cell
            label="PRICE"
            value={live ? formatUsd(stats!.priceUsd ?? 0) : "—"}
            sub={
              live && stats!.change24h !== null
                ? `${stats!.change24h! >= 0 ? "▲" : "▼"} ${Math.abs(
                    stats!.change24h ?? 0
                  ).toFixed(2)}% 24h`
                : "since deploy"
            }
            subColor={
              live && (stats!.change24h ?? 0) >= 0
                ? "text-accent"
                : live
                ? "text-error"
                : "text-fg-dim"
            }
          />
          <Cell
            label="MARKET CAP"
            value={
              live && stats!.marketCap
                ? `$${formatCompact(stats!.marketCap)}`
                : "—"
            }
            sub="fdv"
          />
          <Cell
            label="24H VOLUME"
            value={
              live && stats!.volume24h
                ? `$${formatCompact(stats!.volume24h)}`
                : "—"
            }
            sub="24h"
          />
          <Cell
            label="LIQUIDITY"
            value={
              live && stats!.liquidity
                ? `$${formatCompact(stats!.liquidity)}`
                : "—"
            }
            sub="locked"
          />
        </div>
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  sub,
  subColor = "text-fg-dim",
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-bg p-5 sm:p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-dim">
        {label}
      </span>
      <span className="font-mono text-2xl font-semibold text-fg sm:text-3xl">
        {value}
      </span>
      {sub && (
        <span className={cn("font-mono text-xs", subColor)}>{sub}</span>
      )}
    </div>
  );
}

// keep formatNumber import to avoid tree-shake purge during dev
void formatNumber;
