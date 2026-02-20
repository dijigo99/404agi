import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Truck, ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton } from "../login/GoogleSignInButton";

export default async function RegisterPage() {
    const session = await auth();

    // Zaten giriş yapmışsa dashboard'a yönlendir
    if (session?.user) {
        redirect("/dashboard");
    }

    const benefits = [
        "Anında fiyat hesaplama",
        "Tüm operasyonları tek panelden yönet",
        "Müşteri takibi ve raporlama",
        "7/24 teknik destek"
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                            <Truck className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            Akıllı<span className="text-accent">Garaj</span>
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl md:text-3xl font-bold">
                            Ücretsiz Kayıt Ol 🚀
                        </CardTitle>
                        <CardDescription className="text-base">
                            Hemen ücretsiz hesap oluştur ve işletmeni dijitalleştir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Benefits */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Google Sign In */}
                        <GoogleSignInButton />

                        {/* Already have account */}
                        <div className="text-center text-sm text-muted-foreground">
                            Zaten hesabın var mı?{" "}
                            <Link href="/auth/login" className="text-accent hover:underline font-medium">
                                Giriş Yap
                            </Link>
                        </div>

                        {/* Terms */}
                        <p className="text-center text-sm text-muted-foreground">
                            Kayıt olarak{" "}
                            <Link href="/legal/terms" className="text-accent hover:underline">
                                Kullanım Koşullarını
                            </Link>{" "}
                            ve{" "}
                            <Link href="/legal/privacy" className="text-accent hover:underline">
                                Gizlilik Politikasını
                            </Link>{" "}
                            kabul etmiş olursunuz.
                        </p>

                        {/* Back Link */}
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Ana Sayfaya Dön
                        </Link>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
