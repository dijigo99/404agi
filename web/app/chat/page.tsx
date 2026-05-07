import Link from "next/link";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "chat",
  description: "Talk to 404AGI. Token-gated. The most honest paywall on the internet.",
};

export default function ChatPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border px-4 font-mono text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-fg-dim hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          BACK
        </Link>
        <span className="text-accent">CHAT.404 / FULLSCREEN</span>
        <span className="text-fg-dim">v0.1</span>
      </header>
      <main className="flex flex-1 flex-col p-4">
        <ChatPanel />
      </main>
    </div>
  );
}
