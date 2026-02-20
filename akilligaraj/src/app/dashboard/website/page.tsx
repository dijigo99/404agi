"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Globe, ExternalLink, Settings, Eye, Palette,
    Type, Image as ImageIcon, Phone, Mail, MapPin,
    Save, RefreshCw, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WebsiteChat } from "@/components/website/chat";

interface Website {
    id: string;
    subdomain: string;
    customDomain: string | null;
    templateId: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    heroTitle: string | null;
    heroSubtitle: string | null;
    aboutTitle: string | null;
    aboutText: string | null;
    services: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactAddress: string | null;
    logoUrl: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    isPublished: boolean;
    publishedAt: string | null;
}

const templateNames: Record<string, string> = {
    kurumsal: "Kurumsal",
    dinamik: "Dinamik",
    minimal: "Minimal",
};

export default function WebsitePage() {
    const router = useRouter();
    const [website, setWebsite] = useState<Website | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [formData, setFormData] = useState({
        templateId: "kurumsal",
        heroTitle: "",
        heroSubtitle: "",
        aboutTitle: "",
        aboutText: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
    });

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
                setFormData({
                    templateId: data.templateId || "kurumsal",
                    heroTitle: data.heroTitle || "",
                    heroSubtitle: data.heroSubtitle || "",
                    aboutTitle: data.aboutTitle || "",
                    aboutText: data.aboutText || "",
                    contactPhone: data.contactPhone || "",
                    contactEmail: data.contactEmail || "",
                    contactAddress: data.contactAddress || "",
                });
            }
        } catch (error) {
            console.error("Error fetching website:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/website", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedWebsite = await response.json();
                setWebsite(updatedWebsite);
                refreshPreview();
            }
        } catch (error) {
            console.error("Error saving website:", error);
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/website", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, isPublished: true }),
            });

            if (response.ok) {
                const updatedWebsite = await response.json();
                setWebsite(updatedWebsite);
            }
        } catch (error) {
            console.error("Error publishing website:", error);
        } finally {
            setSaving(false);
        }
    };

    const refreshPreview = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
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

    const siteUrl = `https://${website.subdomain}.akilligaraj.com`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Web Sitem</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline flex items-center gap-1"
                        >
                            {website.subdomain}.akilligaraj.com
                            <ExternalLink className="h-3 w-3" />
                        </a>
                        {website.isPublished ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Yayında
                            </span>
                        ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                Taslak
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Link href="/dashboard/website/domain">
                        <Button variant="outline">
                            <Globe className="h-4 w-4 mr-2" />
                            Domain
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={refreshPreview}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Önizleme
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                    {!website.isPublished && (
                        <Button onClick={handlePublish} disabled={saving} className="bg-green-600 hover:bg-green-700">
                            Yayınla
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Editor Panel */}
                <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2 border-b pb-2 flex-wrap">
                        {[
                            { id: "chat", label: "AI Asistan", icon: MessageSquare },
                            { id: "content", label: "İçerik", icon: Type },
                            { id: "style", label: "Stil", icon: Palette },
                            { id: "contact", label: "İletişim", icon: Phone },
                        ].map((tab) => (
                            <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon className="h-4 w-4 mr-2" />
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {/* AI Chat Tab */}
                    {activeTab === "chat" && (
                        <Card className="h-[500px] flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-accent" />
                                    AI Asistan
                                </CardTitle>
                                <CardDescription>
                                    Sitenizi konuşarak yönetin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                <WebsiteChat onUpdate={fetchWebsite} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Content Tab */}
                    {activeTab === "content" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Site İçeriği</CardTitle>
                                <CardDescription>
                                    Ana sayfa metinlerini düzenleyin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="heroTitle">Ana Başlık</Label>
                                    <Input
                                        id="heroTitle"
                                        value={formData.heroTitle}
                                        onChange={(e) =>
                                            setFormData({ ...formData, heroTitle: e.target.value })
                                        }
                                        placeholder="Firma Adı - Güvenilir Nakliyat"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="heroSubtitle">Alt Başlık</Label>
                                    <Input
                                        id="heroSubtitle"
                                        value={formData.heroSubtitle}
                                        onChange={(e) =>
                                            setFormData({ ...formData, heroSubtitle: e.target.value })
                                        }
                                        placeholder="Profesyonel nakliyat hizmetleri"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="aboutTitle">Hakkımızda Başlık</Label>
                                    <Input
                                        id="aboutTitle"
                                        value={formData.aboutTitle}
                                        onChange={(e) =>
                                            setFormData({ ...formData, aboutTitle: e.target.value })
                                        }
                                        placeholder="Hakkımızda"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="aboutText">Hakkımızda Metni</Label>
                                    <textarea
                                        id="aboutText"
                                        value={formData.aboutText}
                                        onChange={(e) =>
                                            setFormData({ ...formData, aboutText: e.target.value })
                                        }
                                        placeholder="Firma tanıtım metni..."
                                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Style Tab */}
                    {activeTab === "style" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Şablon & Renkler</CardTitle>
                                <CardDescription>
                                    Sitenizin görünümünü özelleştirin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Şablon</Label>
                                    <Select
                                        value={formData.templateId}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, templateId: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kurumsal">Kurumsal (Mavi/Gri)</SelectItem>
                                            <SelectItem value="dinamik">Dinamik (Turuncu/Siyah)</SelectItem>
                                            <SelectItem value="minimal">Minimal (Yeşil/Beyaz)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        💡 Daha fazla özelleştirme için yakında AI destekli düzenleme özelliği eklenecek.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact Tab */}
                    {activeTab === "contact" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>İletişim Bilgileri</CardTitle>
                                <CardDescription>
                                    Müşterilerin size ulaşması için
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="contactPhone">Telefon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, contactPhone: e.target.value })
                                            }
                                            placeholder="0532 XXX XX XX"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contactEmail">E-posta</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="contactEmail"
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) =>
                                                setFormData({ ...formData, contactEmail: e.target.value })
                                            }
                                            placeholder="info@firma.com"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contactAddress">Adres</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="contactAddress"
                                            value={formData.contactAddress}
                                            onChange={(e) =>
                                                setFormData({ ...formData, contactAddress: e.target.value })
                                            }
                                            placeholder="İstanbul, Türkiye"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Preview Panel */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Önizleme</CardTitle>
                            <Button size="sm" variant="ghost" onClick={refreshPreview}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Site önizlemesi</p>
                                <p className="text-xs">Yakında aktif olacak</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
