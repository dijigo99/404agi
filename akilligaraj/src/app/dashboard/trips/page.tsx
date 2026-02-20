import { Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TripsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Seferlerim</h1>
                <p className="text-muted-foreground">Tüm seferlerinizi görüntüleyin ve yönetin</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Sefer Yönetimi</CardTitle>
                            <CardDescription>Bu özellik yakında aktif olacak</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Tüm seferlerinizi kaydedin, takip edin ve raporlayın.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
