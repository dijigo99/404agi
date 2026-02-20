import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
    {
        emoji: "🚛",
        title: "Web Siten Hazır",
        description: "Tek tıkla firmaadi.akilligaraj.com senin olsun. Müşterilerine profesyonel görün.",
    },
    {
        emoji: "📄",
        title: "Teklif & Fatura Kes",
        description: "Müşterine PDF teklif at, anlaştığında tek panelden e-fatura kes.",
    },
    {
        emoji: "💰",
        title: "Hesabını Bil",
        description: "Ay sonunda ne kazandığını gör. Zarar ettiğin seferleri tespit et.",
    },
    {
        emoji: "📱",
        title: "Sosyal Medya Yönetimi",
        description: "Instagram, Facebook ve Google İşletme hesaplarını tek panelden kontrol et.",
    },
    {
        emoji: "🛡️",
        title: "Sigorta Takibi",
        description: "Araç sigortalarının bitiş tarihlerini takip et, asla gecikme.",
    },
    {
        emoji: "🤖",
        title: "AI Asistan",
        description: "Yapay zeka ile SEO içerik üret, müşteri mesajlarını otomatik yanıtla.",
    }
];

export function SocialProof() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Trust Badge */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted border border-border">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-orange-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                >
                                    {["A", "M", "K", "E"][i - 1]}
                                </div>
                            ))}
                        </div>
                        <p className="text-foreground font-medium">
                            <span className="text-accent font-bold">350+</span> Nakliyeci şu an bu sistemi kullanıyor
                        </p>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group p-6 md:p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-border"
                        >
                            <div className="mb-4 text-5xl">{benefit.emoji}</div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground btn-touch text-lg px-8 shadow-lg shadow-accent/25"
                    >
                        <Link href="/auth/register">
                            Hemen Başla - Ücretsiz
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                    </Button>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Kredi kartı gerekmez • 5 dakikada hazır
                    </p>
                </div>
            </div>
        </section>
    );
}
