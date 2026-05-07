import { ArrowRight } from "lucide-react";
import {
  CONTRACT_ADDRESS,
  isLaunched,
  JUPITER_SWAP_BASE,
  SITE,
} from "@/lib/config";

const STEPS = [
  {
    n: "01",
    title: "INSTALL PHANTOM",
    body: "phantom.app — your gateway to Solana. mobile or browser extension. takes 60 seconds.",
    href: "https://phantom.app",
    cta: "GET PHANTOM",
  },
  {
    n: "02",
    title: "FUND WITH SOL",
    body: "buy SOL on any exchange (Coinbase, Binance, Kraken). send it to your Phantom address. mainnet only.",
    href: "https://phantom.app/learn/crypto-101/how-to-buy-solana",
    cta: "HOW TO BUY SOL",
  },
  {
    n: "03",
    title: "SWAP ON JUPITER",
    body: "open Jupiter, paste the contract address (it's pre-filled below), confirm in Phantom. you now hold cope.",
    cta: `BUY ${SITE.ticker} NOW`,
    accent: true,
  },
];

export function HowToBuy() {
  const buyHref = isLaunched()
    ? `${JUPITER_SWAP_BASE}${CONTRACT_ADDRESS}`
    : "https://jup.ag";

  return (
    <section
      id="how-to-buy"
      aria-labelledby="how-heading"
      className="border-b border-border"
    >
      <div className="container py-24">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
          {"// install.sh"}
        </p>
        <h2
          id="how-heading"
          className="mb-10 font-mono text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl"
        >
          <span className="text-accent">{">"}</span> 3 steps to cope
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => {
            const href = s.accent ? buyHref : s.href;
            return (
              <div
                key={s.n}
                className={`flex flex-col border border-border p-6 ${
                  s.accent ? "bg-accent/5" : "bg-bg-elev"
                }`}
              >
                <span
                  className={`mb-4 font-mono text-3xl font-bold ${
                    s.accent ? "text-accent" : "text-fg-dim"
                  }`}
                >
                  {s.n}
                </span>
                <h3 className="mb-2 font-mono text-base font-semibold uppercase tracking-wider text-fg">
                  {s.title}
                </h3>
                <p className="mb-6 flex-1 text-sm text-fg/80">{s.body}</p>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                      s.accent
                        ? "border-accent bg-accent text-bg hover:bg-accent/85"
                        : "border-border text-fg hover:border-accent hover:text-accent"
                    }`}
                  >
                    {s.cta}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
