"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Globe, ExternalLink, Check, X, Loader2,
    ArrowLeft, Shield, Zap, Settings, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Website {
    subdomain: string;
    customDomain: string | null;
    isPublished: boolean;
}

interface DomainCheckResult {
    available: boolean;
    price?: number;
    currency?: string;
}

export default function DomainPage() {
    const router = useRouter();
    const [website, setWebsite] = useState<Website | null>(null);
    const [loading, setLoading] = useState(true);
    const [customDomain, setCustomDomain] = useState("");
    const [checking, setChecking] = useState(false);
    const [checkResult, setCheckResult] = useState<DomainCheckResult | null>(null);

    useEffect(() => {
        fetchWebsite();
    }, []);

    const fetchWebsite = async () => {
        try {
            const response = await fetch("/api/website");
            if (response.ok) {
                const data = await response.json();
                if (!data) {
                    router.push("/dashboard/website/setup");
                    return;
                }
                setWebsite(data);
                if (data.customDomain) {
                    setCustomDomain(data.customDomain);
                }
            }
        } catch (error) {
            console.error("Error fetching website:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkDomain = async () => {
        if (!customDomain.trim()) return;

        setChecking(true);
        setCheckResult(null);

        try {
            const response = await fetch(`/api/domain/check?domain=${encodeURIComponent(customDomain)}`);
            const data = await response.json();
            setCheckResult(data);
        } catch (error) {
            console.error("Error checking domain:", error);
            setCheckResult({ available: false });
        } finally {
            setChecking(false);
        }
    };

    const handleDomainChange = (value: string) => {
        // Remove protocols and trailing slashes
        const cleaned = value
            .toLowerCase()
            .replace(/^(https?:\/\/)?/, "")
            .replace(/\/+$/, "")
            .trim();
        setCustomDomain(cleaned);
        setCheckResult(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!website) {
        return null;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/website">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Domain Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Web sitenizin adresini yönetin
                    </p>
                </div>
            </div>

            {/* Current Subdomain */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-accent" />
                        Mevcut Adres
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground">Subdomain</p>
                            <a
                                href={`https://${website.subdomain}.akilligaraj.com`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-semibold text-accent hover:underline flex items-center gap-1"
                            >
                                {website.subdomain}.akilligaraj.com
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            {website.isPublished ? (
                                <span className="flex items-center gap-1 text-green-600 text-sm">
                                    <Check className="h-4 w-4" />
                                    Aktif
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-yellow-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    Taslak
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                        Bu adres ücretsiz olarak size aittir ve her zaman aktif kalacaktır.
                    </p>
                </CardContent>
            </Card>

            {/* Custom Domain */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500" />
                        Özel Domain
                    </CardTitle>
                    <CardDescription>
                        Kendi domain adresinizi (örn: orneknakliyat.com) bağlayın
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {website.customDomain ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Bağlı Domain</p>
                                    <a
                                        href={`https://${website.customDomain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-semibold text-green-800 hover:underline flex items-center gap-1"
                                    >
                                        {website.customDomain}
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="customDomain">Domain Adresi</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="customDomain"
                                        value={customDomain}
                                        onChange={(e) => handleDomainChange(e.target.value)}
                                        placeholder="orneknakliyat.com"
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={checkDomain}
                                        disabled={!customDomain.trim() || checking}
                                    >
                                        {checking ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Kontrol Et"
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {checkResult && (
                                <div className={`p-4 rounded-lg ${checkResult.available
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-red-50 border border-red-200"
                                    }`}>
                                    {checkResult.available ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <Check className="h-5 w-5" />
                                                <span className="font-medium">
                                                    {customDomain} müsait!
                                                </span>
                                            </div>
                                            {checkResult.price && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-green-700">Yıllık Fiyat:</span>
                                                    <span className="text-xl font-bold text-green-800">
                                                        {checkResult.price} {checkResult.currency || "TL"}
                                                    </span>
                                                </div>
                                            )}
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                Satın Al
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-700">
                                            <X className="h-5 w-5" />
                                            <span>
                                                Bu domain zaten kayıtlı veya müsait değil
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Zaten bir domaininiz var mı?</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Mevcut domaininizi bağlamak için DNS ayarlarınızı güncelleyin:
                                </p>
                                <div className="bg-background rounded p-3 text-sm font-mono">
                                    <p><strong>A Kaydı:</strong> 76.76.21.21</p>
                                    <p><strong>CNAME:</strong> cname.akilligaraj.com</p>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle>Özel Domain Avantajları</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: Shield,
                                title: "SSL Sertifikası",
                                description: "Ücretsiz HTTPS güvenliği"
                            },
                            {
                                icon: Zap,
                                title: "Hızlı CDN",
                                description: "Global içerik dağıtımı"
                            },
                            {
                                icon: Settings,
                                title: "Kolay Yönetim",
                                description: "Tek tıkla kurulum"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-4 bg-muted rounded-lg text-center">
                                <feature.icon className="h-8 w-8 mx-auto mb-2 text-accent" />
                                <h4 className="font-medium">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
