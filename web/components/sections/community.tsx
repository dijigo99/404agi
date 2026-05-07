import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/lib/config";

const LINKS = [
  { label: "X / TWITTER", handle: SOCIALS.twitter.handle, url: SOCIALS.twitter.url },
  {
    label: "TELEGRAM · MAIN",
    handle: SOCIALS.telegram.main.handle,
    url: SOCIALS.telegram.main.url,
  },
  {
    label: "TELEGRAM · TR",
    handle: SOCIALS.telegram.tr.handle,
    url: SOCIALS.telegram.tr.url,
  },
  {
    label: "ANNOUNCEMENTS",
    handle: SOCIALS.telegram.news.handle,
    url: SOCIALS.telegram.news.url,
  },
  {
    label: "GITHUB · BUILD-IN-PUBLIC",
    handle: SOCIALS.github.handle,
    url: SOCIALS.github.url,
  },
];

export function Community() {
  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="border-b border-border"
    >
      <div className="container py-24">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
          {"// connect"}
        </p>
        <h2
          id="community-heading"
          className="mb-10 font-mono text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl"
        >
          <span className="text-accent">{">"}</span> join
        </h2>

        <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((l) => (
            <li key={l.label} className="bg-bg-elev">
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-bg"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-dim">
                    {l.label}
                  </span>
                  <span className="font-mono text-base text-fg group-hover:text-accent">
                    {l.handle}
                  </span>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-fg-dim group-hover:text-accent"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
