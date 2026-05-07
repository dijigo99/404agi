import { TopBar } from "@/components/sections/top-bar";
import { Hero } from "@/components/sections/hero";
import { TickerStrip } from "@/components/sections/ticker-strip";
import { Manifesto } from "@/components/sections/manifesto";
import { AgentFeed } from "@/components/sections/agent-feed";
import { ChatSection } from "@/components/sections/chat-section";
import { Tokenomics } from "@/components/sections/tokenomics";
import { HowToBuy } from "@/components/sections/how-to-buy";
import { Roadmap } from "@/components/sections/roadmap";
import { Community } from "@/components/sections/community";
import { Footer } from "@/components/sections/footer";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <TopBar />
      <main id="main">
        <Hero />
        <TickerStrip />
        <Manifesto />
        <AgentFeed />
        <ChatSection />
        <Tokenomics />
        <HowToBuy />
        <Roadmap />
        <Community />
      </main>
      <Footer />
    </>
  );
}
