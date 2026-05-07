import { Flame, ExternalLink, Lock, ShieldCheck } from "lucide-react";
import {
  CONTRACT_ADDRESS,
  isLaunched,
  SITE,
  TOKEN,
  WALLETS,
} from "@/lib/config";
import { formatNumber, shortAddress } from "@/lib/utils";

const SOLSCAN = (addr: string) => `https://solscan.io/account/${addr}`;
const SOLSCAN_TOKEN = (mint: string) => `https://solscan.io/token/${mint}`;

export function Tokenomics() {
  const live = isLaunched();

  return (
    <section
      id="tokenomics"
      aria-labelledby="tokenomics-heading"
      className="border-b border-border bg-bg-elev"
    >
      <div className="container py-24">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
          {"// tokenomics.json"}
        </p>
        <h2
          id="tokenomics-heading"
          className="mb-10 font-mono text-2xl font-semibold uppercase tracking-tight text-fg sm:text-3xl"
        >
          <span className="text-accent">{">"}</span> tokenomics
        </h2>

        <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
          {/* Supply */}
          <div className="bg-bg p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-fg-dim">
              supply
            </h3>
            <ul className="space-y-3 font-mono text-sm">
              <Row
                label="total supply"
                value={formatNumber(TOKEN.totalSupply)}
              />
              <Row label="decimals" value={String(TOKEN.decimals)} />
              <Row
                label="liquidity"
                value="100% on Raydium"
                badge={<LockedBadge />}
              />
              <Row label="tax" value="0% / 0%" />
            </ul>
          </div>

          {/* Authority */}
          <div className="bg-bg p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-fg-dim">
              authority
            </h3>
            <ul className="space-y-3 font-mono text-sm">
              <Row
                label="mint authority"
                value="BURNED"
                badge={<BurnedBadge />}
              />
              <Row
                label="freeze authority"
                value="BURNED"
                badge={<BurnedBadge />}
              />
              <Row
                label="launch"
                value="100% fair launch"
                badge={<FairBadge />}
              />
              <Row
                label="contract"
                value={
                  live ? (
                    <a
                      href={SOLSCAN_TOKEN(CONTRACT_ADDRESS)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {shortAddress(CONTRACT_ADDRESS, 6, 6)}
                    </a>
                  ) : (
                    <span className="text-warn">awaiting deployment</span>
                  )
                }
              />
            </ul>
          </div>
        </div>

        {/* Wallets */}
        <div className="mt-px border border-border bg-bg p-6">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-fg-dim">
            wallets · public &amp; labeled
          </h3>
          <ul className="grid grid-cols-1 gap-3 font-mono text-sm sm:grid-cols-3">
            <WalletRow label="DEPLOYER" addr={WALLETS.deployer} />
            <WalletRow label="MARKETING" addr={WALLETS.marketing} />
            <WalletRow label="AGENT" addr={WALLETS.agent} />
          </ul>
        </div>

        <p className="mt-6 max-w-2xl font-mono text-xs text-fg-dim">
          {SITE.ticker} is a meme coin. it has no inherent utility, no
          guarantees, and no roadmap that survives contact with reality.
          everything above is verifiable on-chain.
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  badge,
}: {
  label: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-fg-dim">{label}</span>
      <span className="flex items-center gap-2 text-fg">
        {value}
        {badge}
      </span>
    </li>
  );
}

function WalletRow({ label, addr }: { label: string; addr: string }) {
  const valid = addr && addr !== "TBD";
  return (
    <li className="flex flex-col gap-1 border border-border bg-bg-elev p-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-fg-dim">
        {label}
      </span>
      {valid ? (
        <a
          href={SOLSCAN(addr)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-accent hover:underline"
        >
          {shortAddress(addr, 4, 4)}
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      ) : (
        <span className="text-warn">tbd</span>
      )}
    </li>
  );
}

function BurnedBadge() {
  return (
    <span className="inline-flex items-center gap-1 border border-error/40 bg-error/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-error">
      <Flame className="h-3 w-3" aria-hidden />
      burned
    </span>
  );
}

function LockedBadge() {
  return (
    <span className="inline-flex items-center gap-1 border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
      <Lock className="h-3 w-3" aria-hidden />
      locked
    </span>
  );
}

function FairBadge() {
  return (
    <span className="inline-flex items-center gap-1 border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
      <ShieldCheck className="h-3 w-3" aria-hidden />
      pump.fun
    </span>
  );
}
