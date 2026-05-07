"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS, JUPITER_SWAP_BASE, SITE } from "@/lib/config";

const ASCII = [
  "██╗  ██╗ ██████╗ ██╗  ██╗",
  "██║  ██║██╔═████╗██║  ██║",
  "███████║██║██╔██║███████║",
  "╚════██║████╔╝██║╚════██║",
  "     ██║╚██████╔╝     ██║",
  "     ╚═╝ ╚═════╝      ╚═╝",
];

const TAGLINE = SITE.tagline; // "AGI not found. Cope deployed."

export function Hero() {
  const [typed, setTyped] = useState("");
  const [glitch, setGlitch] = useState(false);

  // Typewriter
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(TAGLINE.slice(0, i));
      if (i >= TAGLINE.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, []);

  // Periodic glitch frame
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const buyHref = CONTRACT_ADDRESS
    ? `${JUPITER_SWAP_BASE}${CONTRACT_ADDRESS}`
    : SITE.url;

  return (
    <section
      aria-labelledby="hero-heading"
      className="crt-scanlines vignette relative overflow-hidden border-b border-border"
    >
      <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="container relative grid min-h-[88svh] place-items-center py-20 md:py-28">
        <div className="flex w-full flex-col items-center gap-10 text-center">
          {/* ASCII art */}
          <pre
            id="hero-heading"
            aria-label="404"
            className={`select-none font-mono text-[10px] leading-none text-accent sm:text-xs md:text-base ${
              glitch ? "animate-glitch-skew" : ""
            }`}
          >
            {ASCII.join("\n")}
          </pre>

          <div className="space-y-3 font-mono text-fg-dim">
            <p className="text-xs uppercase tracking-[0.3em] text-fg-dim">
              {SITE.name} / Solana / {SITE.ticker}
            </p>
            <h1 className="text-balance text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl md:text-5xl">
              <span className="caret">{typed}</span>
            </h1>
            <p className="font-mono text-sm text-fg-dim md:text-base">
              {SITE.taglineSecondary}
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={buyHref} target="_blank" rel="noopener noreferrer">
                BUY {SITE.ticker} ON JUPITER
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href="#manifesto">
                <BookOpen className="h-4 w-4" aria-hidden />
                READ MANIFESTO
              </a>
            </Button>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
            scroll<span className="ml-2">↓</span>
          </p>
        </div>
      </div>
    </section>
  );
}
