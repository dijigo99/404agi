"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { CONTRACT_ADDRESS, isLaunched, SITE } from "@/lib/config";
import { fetchTokenStats, type TokenStats } from "@/lib/dexscreener";
import { cn, formatCompact, formatUsd, shortAddress } from "@/lib/utils";

export function TopBar() {
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [copied, setCopied] = useState(false);

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

  const copyCa = async () => {
    if (!CONTRACT_ADDRESS) return;
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const live = isLaunched() && stats?.isLive;
  const change = stats?.change24h;
  const changeColor =
    change === null || change === undefined
      ? "text-fg-dim"
      : change >= 0
      ? "text-accent"
      : "text-error";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="container flex h-12 items-center gap-4 text-xs">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-mono font-bold tracking-tight"
          aria-label={`${SITE.name} home`}
        >
          <span className="text-accent">404</span>
          <span className="text-fg">AGI</span>
        </Link>

        {/* CA */}
        <div className="hidden items-center gap-2 font-mono md:flex">
          <span className="text-fg-dim">CA:</span>
          {CONTRACT_ADDRESS ? (
            <button
              type="button"
              onClick={copyCa}
              className="group flex items-center gap-1.5 text-fg hover:text-accent"
              aria-label="Copy contract address"
            >
              <span>{shortAddress(CONTRACT_ADDRESS, 6, 4)}</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
              ) : (
                <Copy
                  className="h-3.5 w-3.5 text-fg-dim group-hover:text-accent"
                  aria-hidden
                />
              )}
            </button>
          ) : (
            <span className="text-warn">AWAITING DEPLOYMENT</span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3 font-mono sm:gap-5">
          <Stat
            label="PRICE"
            value={live ? formatUsd(stats.priceUsd ?? 0) : "—"}
            extra={
              live && change !== null && change !== undefined ? (
                <span className={cn(changeColor)}>
                  {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
                </span>
              ) : null
            }
          />
          <Stat
            className="hidden sm:flex"
            label="MC"
            value={
              live && stats.marketCap
                ? `$${formatCompact(stats.marketCap)}`
                : "—"
            }
          />
          <Stat
            className="hidden md:flex"
            label="VOL 24H"
            value={
              live && stats.volume24h
                ? `$${formatCompact(stats.volume24h)}`
                : "—"
            }
          />
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  extra,
  className,
}: {
  label: string;
  value: string;
  extra?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-fg-dim">{label}</span>
      <span className="text-fg">{value}</span>
      {extra}
    </div>
  );
}
