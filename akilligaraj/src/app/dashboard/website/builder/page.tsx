import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { WebsiteBuilderClient } from "@/components/website/builder/WebsiteBuilderClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Site Düzenleyici | Dijital Muavin',
    description: 'AkıllıGaraj yapay zeka destekli site düzenleyici',
};

export default async function WebsiteBuilderPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    // Fetch the user's website record
    let userWebsite = await db.query.websites.findFirst({
        where: eq(websites.userId, session.user.id),
    });

    // If they don't have one, this is an edge case (usually created upstream), but let's handle gracefully.
    if (!userWebsite) {
        // We could either redirect to setup page, or create a mock template here
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Önce Site Kurulumunu Tamamla</h2>
                    <p className="text-slate-500">Alan Adı (Domain) ve ön ayarları yapmadın usta.</p>
                </div>
            </div>
        );
    }

    // Parse mapped data for the client
    const initialData = {
        id: userWebsite.id,
        templateId: userWebsite.templateId || "kurumsal",
        primaryColor: userWebsite.primaryColor || "#f97316",
        heroTitle: userWebsite.heroTitle || "Markanız",
        heroSubtitle: userWebsite.heroSubtitle || "Açıklamanız",
        aboutTitle: userWebsite.aboutTitle || "Hakkımızda",
        aboutText: userWebsite.aboutText || "",
        logoUrl: userWebsite.logoUrl || undefined,
    };

    return (
        <div className="h-[calc(100vh-64px)] w-full">
            <WebsiteBuilderClient initialData={initialData} />
        </div>
    );
}
