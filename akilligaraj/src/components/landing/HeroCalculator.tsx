"use client";

import { useState } from "react";
import {
    Truck,
    MapPin,
    Calculator,
    Fuel,
    Route,
    Lock,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Araç tipleri ve özellikleri
const vehicleTypes = [
    {
        id: "kamyonet",
        name: "Kamyonet",
        icon: "🚐",
        fuelConsumption: 12, // L/100km
        description: "3.5 ton'a kadar"
    },
    {
        id: "kamyon",
        name: "Kamyon",
        icon: "🚛",
        fuelConsumption: 25, // L/100km
        description: "12 ton'a kadar"
    },
    {
        id: "tir",
        name: "TIR",
        icon: "🚚",
        fuelConsumption: 35, // L/100km
        description: "40 ton'a kadar"
    },
    {
        id: "kirkayak",
        name: "Kırkayak",
        icon: "🚛",
        fuelConsumption: 40, // L/100km
        description: "Uzun yük taşıma"
    }
];

// Türkiye'deki bazı şehirler (örnek)
const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
    "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri",
    "Eskişehir", "Samsun", "Trabzon", "Diyarbakır", "Şanlıurfa"
];

// Şehirler arası mesafe hesaplama (basitleştirilmiş)
function calculateDistance(from: string, to: string): number {
    // Gerçek uygulamada API kullanılacak
    // Şimdilik rastgele bir mesafe döndürüyoruz
    if (from === to) return 0;
    return Math.floor(Math.random() * 1000) + 200;
}

// Maliyet hesaplama
function calculateCosts(distance: number, vehicleType: string) {
    const vehicle = vehicleTypes.find(v => v.id === vehicleType);
    if (!vehicle) return null;

    const fuelPrice = 43.5; // TL/L (örnek)
    const fuelNeeded = (distance * vehicle.fuelConsumption) / 100;
    const fuelCost = fuelNeeded * fuelPrice;

    // Köprü/otoyol ücretleri (tahmini)
    const tollCost = distance > 300 ? 850 : distance > 100 ? 350 : 0;

    // Amortisman, lastik, bakım (km başına)
    const maintenanceCost = distance * 2.5;

    // Şoför ücreti (günlük)
    const days = Math.ceil(distance / 500);
    const driverCost = days * 1500;

    const totalCost = fuelCost + tollCost + maintenanceCost + driverCost;

    return {
        fuelCost: Math.round(fuelCost),
        tollCost: Math.round(tollCost),
        maintenanceCost: Math.round(maintenanceCost),
        driverCost: Math.round(driverCost),
        totalCost: Math.round(totalCost),
        distance,
        fuelNeeded: Math.round(fuelNeeded)
    };
}

export function HeroCalculator() {
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("kamyon");
    const [result, setResult] = useState<ReturnType<typeof calculateCosts> | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleCalculate = () => {
        if (!fromCity || !toCity) return;

        setIsCalculating(true);

        // Simüle edilmiş hesaplama gecikmesi
        setTimeout(() => {
            const distance = calculateDistance(fromCity, toCity);
            const costs = calculateCosts(distance, selectedVehicle);
            setResult(costs);
            setIsCalculating(false);
        }, 800);
    };

    return (
        <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

            <div className="container relative mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left Side - Text Content */}
                    <div className="text-center lg:text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                            <Calculator className="h-4 w-4" />
                            Ücretsiz Maliyet Hesaplayıcı
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                            Bu Seferden{" "}
                            <span className="text-destructive">Zarar</span> Mı Edeceksin,{" "}
                            <span className="text-success">Kâr</span> Mı?
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                            Mazot, köprü, lastik... <strong>10 saniyede</strong> gerçek maliyetini gör,
                            paran cebinde kalsın.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                            <div className="text-center">
                                <p className="text-2xl md:text-3xl font-bold text-foreground">350+</p>
                                <p className="text-sm text-muted-foreground">Aktif Nakliyeci</p>
                            </div>
                            <div className="h-12 w-px bg-border" />
                            <div className="text-center">
                                <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
                                <p className="text-sm text-muted-foreground">Hesaplanan Sefer</p>
                            </div>
                            <div className="h-12 w-px bg-border" />
                            <div className="text-center">
                                <p className="text-2xl md:text-3xl font-bold text-foreground">%98</p>
                                <p className="text-sm text-muted-foreground">Memnuniyet</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Calculator Card */}
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
                        <CardContent className="p-6 md:p-8 space-y-6">
                            {!result ? (
                                <>
                                    {/* From/To Inputs */}
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="from" className="text-base font-medium flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-accent" />
                                                Nereden?
                                            </Label>
                                            <Input
                                                id="from"
                                                type="text"
                                                placeholder="İl veya ilçe yazın..."
                                                value={fromCity}
                                                onChange={(e) => setFromCity(e.target.value)}
                                                list="cities-from"
                                                className="input-touch"
                                            />
                                            <datalist id="cities-from">
                                                {cities.map(city => (
                                                    <option key={city} value={city} />
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="to" className="text-base font-medium flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-success" />
                                                Nereye?
                                            </Label>
                                            <Input
                                                id="to"
                                                type="text"
                                                placeholder="İl veya ilçe yazın..."
                                                value={toCity}
                                                onChange={(e) => setToCity(e.target.value)}
                                                list="cities-to"
                                                className="input-touch"
                                            />
                                            <datalist id="cities-to">
                                                {cities.map(city => (
                                                    <option key={city} value={city} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>

                                    {/* Vehicle Type Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-base font-medium flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-primary" />
                                            Araç Tipi
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {vehicleTypes.map((vehicle) => (
                                                <button
                                                    key={vehicle.id}
                                                    onClick={() => setSelectedVehicle(vehicle.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${selectedVehicle === vehicle.id
                                                            ? "border-accent bg-accent/5"
                                                            : "border-border hover:border-accent/50"
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{vehicle.icon}</div>
                                                    <div className="font-medium text-foreground">{vehicle.name}</div>
                                                    <div className="text-xs text-muted-foreground">{vehicle.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Calculate Button */}
                                    <Button
                                        onClick={handleCalculate}
                                        disabled={!fromCity || !toCity || isCalculating}
                                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-touch text-lg font-semibold shadow-lg shadow-accent/25"
                                    >
                                        {isCalculating ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Hesaplanıyor...
                                            </>
                                        ) : (
                                            <>
                                                <Calculator className="h-5 w-5 mr-2" />
                                                MALİYETİ HESAPLA
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                /* Result View */
                                <div className="space-y-6">
                                    {/* Route Info */}
                                    <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Route className="h-5 w-5 text-accent" />
                                            <div>
                                                <p className="font-medium text-foreground">{fromCity} → {toCity}</p>
                                                <p className="text-sm text-muted-foreground">{result.distance} km</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setResult(null)}
                                            className="text-sm text-accent hover:underline"
                                        >
                                            Değiştir
                                        </button>
                                    </div>

                                    {/* Visible Cost */}
                                    <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Fuel className="h-6 w-6 text-accent" />
                                            <p className="text-lg font-medium text-foreground">Tahmini Yakıt Maliyeti</p>
                                        </div>
                                        <p className="text-4xl font-bold text-accent">
                                            {result.fuelCost.toLocaleString('tr-TR')} ₺
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            ~{result.fuelNeeded} litre yakıt gerekli
                                        </p>
                                    </div>

                                    {/* Blurred Details */}
                                    <div className="relative">
                                        <div className="space-y-3 blur-sm select-none pointer-events-none">
                                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                                <span>Köprü/Otoyol Ücretleri</span>
                                                <span className="font-semibold">{result.tollCost.toLocaleString('tr-TR')} ₺</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                                <span>Amortisman & Bakım</span>
                                                <span className="font-semibold">{result.maintenanceCost.toLocaleString('tr-TR')} ₺</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                                <span>Şoför Ücreti</span>
                                                <span className="font-semibold">{result.driverCost.toLocaleString('tr-TR')} ₺</span>
                                            </div>
                                            <div className="flex justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                                                <span className="font-semibold">Toplam Maliyet</span>
                                                <span className="font-bold text-success text-xl">{result.totalCost.toLocaleString('tr-TR')} ₺</span>
                                            </div>
                                        </div>

                                        {/* Overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
                                            <Lock className="h-8 w-8 text-muted-foreground mb-3" />
                                            <p className="text-center text-foreground font-medium mb-4 px-4">
                                                Detaylı dökümü görmek ve bu seferi kaydetmek için
                                            </p>
                                            <Button
                                                asChild
                                                className="bg-accent hover:bg-accent/90 text-accent-foreground btn-touch"
                                            >
                                                <Link href="/auth/register">
                                                    ÜCRETSİZ Devam Et
                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
