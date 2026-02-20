"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TemplateId = "kurumsal" | "dinamik" | "minimal";

const templates = [
    {
        id: "kurumsal" as TemplateId,
        name: "Kurumsal",
        description: "Ciddi ve profesyonel görünüm. Büyük filolar için ideal.",
        colors: ["#1e40af", "#475569", "#3b82f6"],
        preview: "Mavi/Gri tonlar",
    },
    {
        id: "dinamik" as TemplateId,
        name: "Dinamik",
        description: "Enerjik ve modern görünüm. Genç lojistikçiler için.",
        colors: ["#f97316", "#1e293b", "#fb923c"],
        preview: "Turuncu/Siyah tonlar",
    },
    {
        id: "minimal" as TemplateId,
        name: "Minimal",
        description: "Sade ve temiz görünüm. Net izlenim bırakmak için.",
        colors: ["#16a34a", "#64748b", "#22c55e"],
        preview: "Beyaz/Yeşil tonlar",
    },
];

export default function WebsiteSetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

    const [formData, setFormData] = useState({
        templateId: "kurumsal" as TemplateId,
        subdomain: "",
        companyName: "",
    });

    // Check if website already exists
    useEffect(() => {
        const checkExisting = async () => {
            try {
                const response = await fetch("/api/website");
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        router.push("/dashboard/website");
                    }
                }
            } catch (error) {
                console.error("Error checking website:", error);
            }
        };
        checkExisting();
    }, [router]);

    const checkSubdomain = async (subdomain: string) => {
        if (subdomain.length < 3) {
            setSubdomainAvailable(null);
            return;
        }

        setCheckingSubdomain(true);
        try {
            const response = await fetch(`/api/website/check-subdomain?subdomain=${subdomain}`);
            const data = await response.json();
            setSubdomainAvailable(data.available);
        } catch (error) {
            console.error("Error checking subdomain:", error);
            setSubdomainAvailable(null);
        } finally {
            setCheckingSubdomain(false);
        }
    };

    const handleSubdomainChange = (value: string) => {
        // Sadece küçük harf, rakam ve tire izin ver
        const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
        setFormData({ ...formData, subdomain: cleaned });

        // Debounce check
        const timeoutId = setTimeout(() => {
            checkSubdomain(cleaned);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleSubmit = async () => {
        if (!formData.subdomain || !formData.templateId) return;

        setLoading(true);
        try {
            const response = await fetch("/api/website", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/dashboard/website");
            } else {
                const error = await response.json();
                alert(error.error || "Bir hata oluştu");
            }
        } catch (error) {
            console.error("Error creating website:", error);
            alert("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Web Sitenizi Oluşturun</h1>
                    <p className="text-muted-foreground text-lg">
                        Sadece birkaç adımda profesyonel web siteniz hazır olacak
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s
                                        ? "bg-accent text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {step > s ? <Check className="h-5 w-5" /> : s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-16 h-1 rounded ${step > s ? "bg-accent" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Template Selection */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Bir Şablon Seçin
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all hover:scale-105 ${formData.templateId === template.id
                                            ? "ring-2 ring-accent"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        setFormData({ ...formData, templateId: template.id })
                                    }
                                >
                                    <CardContent className="p-6">
                                        <div className="flex gap-2 mb-4">
                                            {template.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="h-8 w-8 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {template.name}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            {template.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {template.preview}
                                        </p>
                                        {formData.templateId === template.id && (
                                            <div className="mt-4 flex items-center gap-2 text-accent font-medium">
                                                <Check className="h-4 w-4" />
                                                Seçildi
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-center mt-8">
                            <Button
                                size="lg"
                                onClick={() => setStep(2)}
                                className="px-8"
                            >
                                Devam Et
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Subdomain */}
                {step === 2 && (
                    <div className="max-w-lg mx-auto space-y-6">
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Site Adresinizi Belirleyin
                        </h2>
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subdomain">Site Adresi</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="subdomain"
                                                value={formData.subdomain}
                                                onChange={(e) => handleSubdomainChange(e.target.value)}
                                                placeholder="firmaadi"
                                                className="text-lg"
                                            />
                                            <span className="text-muted-foreground whitespace-nowrap">
                                                .akilligaraj.com
                                            </span>
                                        </div>
                                        {checkingSubdomain && (
                                            <p className="text-sm text-muted-foreground">
                                                Kontrol ediliyor...
                                            </p>
                                        )}
                                        {subdomainAvailable === true && (
                                            <p className="text-sm text-green-600 flex items-center gap-1">
                                                <Check className="h-4 w-4" />
                                                Bu adres müsait!
                                            </p>
                                        )}
                                        {subdomainAvailable === false && (
                                            <p className="text-sm text-red-600">
                                                Bu adres zaten kullanılıyor
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="companyName">Firma Adı</Label>
                                        <Input
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, companyName: e.target.value })
                                            }
                                            placeholder="Örnek Nakliyat"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Geri
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => setStep(3)}
                                disabled={!formData.subdomain || subdomainAvailable === false}
                            >
                                Devam Et
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="max-w-lg mx-auto space-y-6">
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Hazırsınız!
                        </h2>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                    <Palette className="h-8 w-8 text-accent" />
                                    <div>
                                        <p className="font-semibold">
                                            {templates.find((t) => t.id === formData.templateId)?.name} Şablon
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {templates.find((t) => t.id === formData.templateId)?.preview}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Site Adresi</p>
                                    <p className="text-lg font-semibold text-accent">
                                        {formData.subdomain}.akilligaraj.com
                                    </p>
                                </div>
                                {formData.companyName && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Firma Adı</p>
                                        <p className="font-semibold">{formData.companyName}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                Geri
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8"
                            >
                                {loading ? "Oluşturuluyor..." : "Siteyi Oluştur"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
