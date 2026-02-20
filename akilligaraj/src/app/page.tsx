import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { HeroCalculator } from "@/components/landing/HeroCalculator";
import { SocialProof } from "@/components/landing/SocialProof";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroCalculator />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}
