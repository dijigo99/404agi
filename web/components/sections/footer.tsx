import { SITE } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-bg" aria-labelledby="footer-heading">
      <div className="container py-12 font-mono text-xs">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-fg">
              <span className="text-accent">404AGI</span> © {year}
            </p>
            <p className="mt-2 max-w-md text-fg-dim">
              this is a meme coin. it has no inherent value. do not invest
              more than you can lose. we are not financial advisors. we are
              barely advisors at all.
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-fg-dim">
            <li>
              <a href="#manifesto" className="hover:text-accent">
                manifesto
              </a>
            </li>
            <li>
              <a href="#tokenomics" className="hover:text-accent">
                tokenomics
              </a>
            </li>
            <li>
              <a href="#how-to-buy" className="hover:text-accent">
                how to buy
              </a>
            </li>
            <li>
              <a href="#community" className="hover:text-accent">
                community
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-fg-dim/70">
          {SITE.taglineSecondary}
        </p>
      </div>
    </footer>
  );
}
