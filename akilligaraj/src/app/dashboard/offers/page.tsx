import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OffersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tekliflerim</h1>
                <p className="text-muted-foreground">Müşteri tekliflerinizi yönetin</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Teklif Yönetimi</CardTitle>
                            <CardDescription>Bu özellik yakında aktif olacak</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Profesyonel teklifler oluşturun, PDF olarak gönderin ve takip edin.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
