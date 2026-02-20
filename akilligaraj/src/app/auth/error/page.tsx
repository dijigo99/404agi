import Link from "next/link";
import { Truck, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
    const { error } = await searchParams;

    const errorMessages: Record<string, { title: string; description: string }> = {
        Configuration: {
            title: "Yapılandırma Hatası",
            description: "Sunucu yapılandırmasında bir sorun var. Lütfen daha sonra tekrar deneyin veya destek ekibimizle iletişime geçin.",
        },
        AccessDenied: {
            title: "Erişim Reddedildi",
            description: "Bu sayfaya erişim izniniz yok.",
        },
        Verification: {
            title: "Doğrulama Hatası",
            description: "Doğrulama linki geçersiz veya süresi dolmuş. Lütfen tekrar deneyin.",
        },
        Default: {
            title: "Bir Hata Oluştu",
            description: "Giriş yaparken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        },
    };

    const { title, description } = errorMessages[error || "Default"] || errorMessages.Default;

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
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-bold">
                            {title}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Retry Button */}
                        <Button asChild className="w-full btn-touch">
                            <Link href="/auth/login">
                                Tekrar Dene
                            </Link>
                        </Button>

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
