import { Instagram } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SocialPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Sosyal Medya</h1>
                <p className="text-muted-foreground">Sosyal medya hesaplarınızı yönetin</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Instagram className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Sosyal Medya Yönetimi</CardTitle>
                            <CardDescription>Bu özellik yakında aktif olacak</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Instagram ve diğer sosyal medya hesaplarınızı tek panelden yönetin.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
