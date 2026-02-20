import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Ayarlar</h1>
                <p className="text-muted-foreground">Hesap ve uygulama ayarlarınız</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Ayarlar</CardTitle>
                            <CardDescription>Bu özellik yakında aktif olacak</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Profil bilgilerinizi, bildirim tercihlerinizi ve diğer ayarları yönetin.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
