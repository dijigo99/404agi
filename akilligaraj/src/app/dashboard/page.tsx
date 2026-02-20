import { auth } from "@/lib/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Calculator,
    FileText,
    Globe,
    Plus,
    TrendingUp,
    TrendingDown,
    Truck,
    Car,
    Bell,
} from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    const userName = session?.user?.name?.split(" ")[0] || "Usta";

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Hoş geldin, {userName}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    İşlerini buradan yönetebilirsin. Bugün ne yapmak istersin?
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-3 hover:border-accent hover:bg-accent/5"
                >
                    <Link href="/dashboard/calculator">
                        <Calculator className="h-8 w-8 text-accent" />
                        <span className="text-sm font-medium">Maliyet Hesapla</span>
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-3 hover:border-accent hover:bg-accent/5"
                >
                    <Link href="/dashboard/trips/new">
                        <Plus className="h-8 w-8 text-accent" />
                        <span className="text-sm font-medium">Yeni Sefer</span>
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-3 hover:border-accent hover:bg-accent/5"
                >
                    <Link href="/dashboard/offers/new">
                        <FileText className="h-8 w-8 text-accent" />
                        <span className="text-sm font-medium">Teklif Oluştur</span>
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-3 hover:border-accent hover:bg-accent/5"
                >
                    <Link href="/dashboard/website">
                        <Globe className="h-8 w-8 text-accent" />
                        <span className="text-sm font-medium">Web Siteni Düzenle</span>
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* This Month Summary */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Truck className="h-5 w-5 text-accent" />
                            Bu Ay
                        </CardTitle>
                        <CardDescription>Sefer özeti</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Toplam Sefer</span>
                            <span className="text-2xl font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-success" />
                                Ciro
                            </span>
                            <span className="text-xl font-semibold text-success">0 ₺</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <TrendingDown className="h-4 w-4 text-destructive" />
                                Gider
                            </span>
                            <span className="text-xl font-semibold text-destructive">0 ₺</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Net Kâr</span>
                                <span className="text-2xl font-bold text-success">0 ₺</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="h-5 w-5 text-accent" />
                            Son Aktiviteler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Truck className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Henüz aktivite yok
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                                İlk seferini ekleyerek başla!
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Vehicles / Insurance Reminders */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Car className="h-5 w-5 text-accent" />
                            Araç Hatırlatmaları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Car className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Araç eklenmedi
                            </p>
                            <Button variant="link" size="sm" asChild className="mt-2">
                                <Link href="/dashboard/vehicles">
                                    Araç Ekle →
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Getting Started CTA */}
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                🚀 Profilini Tamamla
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Firma bilgilerini girerek web siteni aktif et ve müşterilerine profesyonel görün.
                            </p>
                        </div>
                        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/dashboard/settings">
                                Profili Tamamla
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
