import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalculatorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Maliyet Hesapla</h1>
                <p className="text-muted-foreground">Sefer maliyetlerinizi hesaplayın</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Calculator className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Maliyet Hesaplama</CardTitle>
                            <CardDescription>Bu özellik yakında aktif olacak</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Yakıt, HGS/OGS, sürücü masrafları ve diğer tüm maliyetlerinizi
                        tek bir yerden hesaplayabileceksiniz.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
