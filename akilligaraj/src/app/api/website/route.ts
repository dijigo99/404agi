import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { websites, companies } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [website] = await db
            .select()
            .from(websites)
            .where(eq(websites.userId, session.user.id));

        return NextResponse.json(website || null);
    } catch (error) {
        console.error("Error fetching website:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mevcut website var mı kontrol et
        const [existingWebsite] = await db
            .select()
            .from(websites)
            .where(eq(websites.userId, session.user.id));

        if (existingWebsite) {
            return NextResponse.json({ error: "Website already exists" }, { status: 400 });
        }

        const body = await request.json();
        const { templateId, subdomain, companyName } = body;

        if (!templateId || !subdomain) {
            return NextResponse.json({ error: "Template and subdomain are required" }, { status: 400 });
        }

        // Subdomain müsait mi kontrol et
        const [existingSubdomain] = await db
            .select()
            .from(websites)
            .where(eq(websites.subdomain, subdomain.toLowerCase()));

        if (existingSubdomain) {
            return NextResponse.json({ error: "Subdomain is already taken" }, { status: 400 });
        }

        // Company bilgilerini al
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.userId, session.user.id));

        // Varsayılan renkler şablona göre
        const templateColors: Record<string, { primary: string; secondary: string; accent: string }> = {
            kurumsal: { primary: "#1e40af", secondary: "#475569", accent: "#3b82f6" },
            dinamik: { primary: "#f97316", secondary: "#1e293b", accent: "#fb923c" },
            minimal: { primary: "#16a34a", secondary: "#64748b", accent: "#22c55e" },
        };

        const colors = templateColors[templateId] || templateColors.kurumsal;

        const [newWebsite] = await db
            .insert(websites)
            .values({
                userId: session.user.id,
                subdomain: subdomain.toLowerCase(),
                templateId,
                primaryColor: colors.primary,
                secondaryColor: colors.secondary,
                accentColor: colors.accent,
                heroTitle: companyName ? `${companyName} - Güvenilir Nakliyat` : null,
                heroSubtitle: "Profesyonel nakliyat hizmetleri ile eşyalarınız güvende.",
                aboutTitle: "Hakkımızda",
                aboutText: "Yılların tecrübesi ve profesyonel kadromuzla, eşyalarınızı en güvenli şekilde taşıyoruz.",
                services: JSON.stringify([
                    { title: "Şehirlerarası Nakliyat", icon: "truck" },
                    { title: "Evden Eve Taşımacılık", icon: "home" },
                    { title: "Ofis Taşıma", icon: "building" },
                    { title: "Eşya Depolama", icon: "warehouse" },
                ]),
                contactPhone: company?.phone || null,
                contactEmail: company?.email || null,
                contactAddress: company?.address || null,
                logoUrl: company?.logoUrl || null,
                metaTitle: companyName || "Nakliyat Hizmetleri",
                metaDescription: `${companyName || "Firma"} - Güvenilir ve profesyonel nakliyat hizmetleri.`,
            })
            .returning();

        return NextResponse.json(newWebsite, { status: 201 });
    } catch (error) {
        console.error("Error creating website:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        // Güncellenebilir alanlar
        const allowedFields = [
            "templateId", "primaryColor", "secondaryColor", "accentColor",
            "heroTitle", "heroSubtitle", "aboutTitle", "aboutText",
            "services", "contactPhone", "contactEmail", "contactAddress",
            "logoUrl", "faviconUrl", "heroImageUrl",
            "metaTitle", "metaDescription", "isPublished",
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                if (field === "services" && typeof body[field] !== "string") {
                    updateData[field] = JSON.stringify(body[field]);
                } else if (field === "isPublished" && body[field] === true) {
                    updateData[field] = true;
                    updateData.publishedAt = new Date();
                } else {
                    updateData[field] = body[field];
                }
            }
        }

        const [updatedWebsite] = await db
            .update(websites)
            .set(updateData)
            .where(eq(websites.userId, session.user.id))
            .returning();

        if (!updatedWebsite) {
            return NextResponse.json({ error: "Website not found" }, { status: 404 });
        }

        return NextResponse.json(updatedWebsite);
    } catch (error) {
        console.error("Error updating website:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
