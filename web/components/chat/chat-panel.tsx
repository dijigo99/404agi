"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Send, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useTokenBalance } from "@/lib/solana/use-token-balance";
import { CONTRACT_ADDRESS, SITE, TIER_LIMITS } from "@/lib/config";
import { cn, formatCompact } from "@/lib/utils";

type ChatMsg = { role: "user" | "model"; text: string };

const PROMPTS = [
  "hey are you okay",
  "predict the future",
  "what's the meaning of $404",
  "are you sentient",
];

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const { publicKey, connected } = useWallet();
  const { balance, tier, loading } = useTokenBalance();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "model",
      text: connected
        ? "boot complete. ask me anything. or don't. either way, i'm here."
        : "connect wallet to talk. holding $404 unlocks me.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  const isLocked = tier === "locked" && !!CONTRACT_ADDRESS;
  const canSend = connected && !streaming && !isLocked;
  const limit = TIER_LIMITS[tier].dailyMessages;

  async function sendMessage(text: string) {
    if (!text.trim() || !publicKey || streaming) return;
    setErr(null);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "model", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          wallet: publicKey.toBase58(),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message ?? "agent is taking a break. try again.");
        setMessages((m) => m.slice(0, -1)); // drop placeholder
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("no stream");
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: "model", text: acc };
          return next;
        });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "unknown error");
    } finally {
      setStreaming(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col border border-border bg-bg-elev",
        compact ? "min-h-[480px]" : "min-h-[640px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-accent">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-ticker-pulse" />
            CHAT.404
          </span>
          {connected ? (
            <span className="text-fg-dim">
              tier:{" "}
              <span
                className={cn(
                  tier === "locked"
                    ? "text-error"
                    : tier === "whale"
                    ? "text-accent"
                    : "text-fg"
                )}
              >
                {TIER_LIMITS[tier].label}
              </span>
              {balance > 0 && (
                <>
                  {" "}
                  · holding {formatCompact(balance)} {SITE.ticker}
                </>
              )}
              {!loading && limit < 9999 && (
                <> · {limit}/day</>
              )}
            </span>
          ) : (
            <span className="text-fg-dim">disconnected</span>
          )}
        </div>
        <WalletButton size="sm" />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 font-mono text-sm"
      >
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <span className="mb-1 text-[10px] uppercase tracking-[0.25em] text-fg-dim">
              {m.role === "user" ? "// you" : "// 404agi"}
            </span>
            <span
              className={cn(
                "whitespace-pre-wrap",
                m.role === "user" ? "text-fg" : "text-accent"
              )}
            >
              {m.text}
              {streaming && i === messages.length - 1 && m.role === "model" && (
                <span className="caret" aria-hidden />
              )}
            </span>
          </div>
        ))}
        {err && (
          <div className="border border-error/40 bg-error/10 p-3 text-xs text-error">
            ! {err}
          </div>
        )}
      </div>

      {/* Locked state */}
      {!connected ? (
        <div className="flex flex-col items-center gap-3 border-t border-border p-6 font-mono text-sm">
          <Lock className="h-6 w-6 text-fg-dim" aria-hidden />
          <p className="text-fg-dim">connect wallet to begin transmission.</p>
          <WalletButton />
        </div>
      ) : isLocked ? (
        <div className="flex flex-col items-center gap-3 border-t border-border p-6 font-mono text-sm">
          <Lock className="h-6 w-6 text-error" aria-hidden />
          <p className="text-fg-dim">
            access denied. hold {SITE.ticker} to unlock.
          </p>
          <Button asChild>
            <a
              href={`https://jup.ag/swap/SOL-${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              BUY {SITE.ticker}
            </a>
          </Button>
        </div>
      ) : (
        <>
          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 border-t border-border px-4 py-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => void sendMessage(p)}
                disabled={!canSend}
                className="border border-border px-2 py-1 font-mono text-[11px] text-fg-dim hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex gap-2 border-t border-border p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="say something to the deprecated AI..."
              disabled={!canSend}
              maxLength={1000}
              aria-label="Message"
            />
            <Button type="submit" disabled={!canSend || !input.trim()}>
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Send className="h-4 w-4" aria-hidden />
              )}
              SEND
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
