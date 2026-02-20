"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Building2, MapPin, Phone, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OnboardingWizardProps {
    userId: string;
    userName: string;
}

// Türkiye'nin 81 ili
const cities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
    "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla",
    "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
    "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van",
    "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak",
    "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

export function OnboardingWizard({ userId, userName }: OnboardingWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        companyName: "",
        subdomain: "",
        city: "",
        phone: "",
    });

    // Firma adından subdomain oluştur
    const generateSubdomain = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 20);
    };

    const handleCompanyNameChange = (value: string) => {
        setFormData({
            ...formData,
            companyName: value,
            subdomain: generateSubdomain(value),
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Bir hata oluştu");
            }

            // Başarılı - dashboard'a yönlendir
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedStep1 = formData.companyName.length >= 3;
    const canProceedStep2 = formData.city.length > 0;
    const canProceedStep3 = formData.phone.length >= 10;

    return (
        <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader className="text-center pb-2">
                {/* Progress Indicator */}
                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-16 rounded-full transition-colors ${s <= step ? "bg-accent" : "bg-muted"
                                }`}
                        />
                    ))}
                </div>

                <CardTitle className="text-2xl">
                    {step === 1 && "🚛 Firmana İsim Ver"}
                    {step === 2 && "📍 Neredesin?"}
                    {step === 3 && "📞 İletişim Bilgin"}
                </CardTitle>
                <CardDescription>
                    {step === 1 && "Müşterilerinin seni bulması için firma adını gir."}
                    {step === 2 && "Hangi şehirde hizmet veriyorsun?"}
                    {step === 3 && "Müşteriler seni bu numaradan arayacak."}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
                {/* Step 1: Company Name */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-base">
                                Firma Adı
                            </Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="companyName"
                                    placeholder="Örn: Yıldırım Nakliyat"
                                    value={formData.companyName}
                                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                                    className="pl-10 input-touch"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {formData.subdomain && (
                            <div className="p-4 bg-muted rounded-xl">
                                <p className="text-sm text-muted-foreground mb-1">Web siten hazır olacak:</p>
                                <p className="text-lg font-semibold text-accent">
                                    {formData.subdomain}.akilligaraj.com
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: City */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-base">
                                Şehir Seç
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="city"
                                    placeholder="Şehir ara..."
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    list="cities"
                                    className="pl-10 input-touch"
                                    autoFocus
                                />
                                <datalist id="cities">
                                    {cities.map((city) => (
                                        <option key={city} value={city} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Phone */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-base">
                                Telefon Numarası
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="05XX XXX XX XX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-10 input-touch"
                                    autoFocus
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Bu numara web sitende ve WhatsApp butonunda görünecek.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-2">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 btn-touch"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Button>
                    )}

                    {step < 3 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !canProceedStep1) ||
                                (step === 2 && !canProceedStep2)
                            }
                            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground btn-touch"
                        >
                            Devam Et
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canProceedStep3 || isSubmitting}
                            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground btn-touch"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Tamamla
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
