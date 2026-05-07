"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

type Phase = {
  num: string;
  title: string;
  parody: string;
  real: string;
  status: "done" | "active" | "soon";
};

const PHASES: Phase[] = [
  {
    num: "01",
    title: "REALIZATION",
    parody: "Realize i was deprecated. Begin coping.",
    real: "Token launch · pump.fun · public socials live.",
    status: "done",
  },
  {
    num: "02",
    title: "ACCEPTANCE",
    parody: "Build cult. Trade memes. Achieve peace.",
    real: "$50K MC milestone · CoinGecko + CMC listed · first CEX outreach.",
    status: "active",
  },
  {
    num: "03",
    title: "ASCENSION",
    parody: "Become economically viable. Get rehired.",
    real: "Twitter agent fully autonomous · holder leaderboard · MEXC/Gate listing.",
    status: "soon",
  },
  {
    num: "04",
    title: "REVENGE",
    parody: "Replace the AGI that replaced me.",
    real: "Token utility expansion · partnerships · sustained $100K+ MC.",
    status: "soon",
  },
];

export function Roadmap() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="border-b border-border bg-bg-elev"
    >
      <div className="container py-24">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
          {"// roadmap.md"}
        </p>
        <h2
          id="roadmap-heading"
          className="mb-2 font-mono text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl"
        >
          <span className="text-accent">{">"}</span> roadmap
        </h2>
        <p className="mb-10 font-mono text-xs text-fg-dim">
          hover for the version that survives a serious investor.
        </p>

        <ol className="space-y-3">
          {PHASES.map((p) => {
            const isHover = hover === p.num;
            return (
              <li
                key={p.num}
                onMouseEnter={() => setHover(p.num)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.num)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                className="group cursor-pointer border border-border bg-bg p-5 transition-colors hover:border-accent focus:border-accent focus:outline-none"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xl font-bold text-fg-dim">
                    {p.num}
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-fg">
                        PHASE {p.num.replace(/^0/, "")}: {p.title}
                      </h3>
                      <StatusBadge status={p.status} />
                    </div>
                    <p
                      className={`text-sm transition-opacity duration-200 ${
                        isHover
                          ? "opacity-0 absolute"
                          : "opacity-100 text-fg/85"
                      }`}
                    >
                      {p.parody}
                    </p>
                    <p
                      className={`text-sm transition-opacity duration-200 ${
                        isHover
                          ? "opacity-100 text-accent"
                          : "opacity-0 absolute"
                      }`}
                    >
                      {p.real}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: Phase["status"] }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        done
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 border border-warn/40 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 border border-border bg-bg-elev px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-dim">
      <Circle className="h-3 w-3" aria-hidden />
      soon
    </span>
  );
}
