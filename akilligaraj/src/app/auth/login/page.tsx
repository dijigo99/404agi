import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Truck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton } from "./GoogleSignInButton";

export default async function LoginPage() {
    const session = await auth();

    // Zaten giriş yapmışsa dashboard'a yönlendir
    if (session?.user) {
        redirect("/dashboard");
    }

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
                            Hoş Geldin, Usta! 👋
                        </CardTitle>
                        <CardDescription className="text-base">
                            Hesabına giriş yap ve işlerini yönetmeye başla.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Google Sign In */}
                        <GoogleSignInButton />

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">veya</span>
                            </div>
                        </div>

                        {/* Phone Login (Placeholder) */}
                        <Button
                            variant="outline"
                            className="w-full btn-touch"
                            disabled
                        >
                            📱 Telefon ile Giriş Yap (Yakında)
                        </Button>

                        {/* Terms */}
                        <p className="text-center text-sm text-muted-foreground">
                            Giriş yaparak{" "}
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
