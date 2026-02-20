import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, companyName, subdomain, city, phone } = body;

        // Validation
        if (!userId || !companyName || !subdomain || !city || !phone) {
            return NextResponse.json(
                { error: "Tüm alanları doldurun" },
                { status: 400 }
            );
        }

        // Check if subdomain already exists
        const existingSubdomain = await db.query.companies.findFirst({
            where: eq(companies.subdomain, subdomain),
        });

        if (existingSubdomain) {
            return NextResponse.json(
                { error: "Bu isim zaten kullanılıyor. Farklı bir firma adı deneyin." },
                { status: 400 }
            );
        }

        // Check if user already has a company
        const existingCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
        });

        if (existingCompany) {
            return NextResponse.json(
                { error: "Zaten bir firmanız var" },
                { status: 400 }
            );
        }

        // Create company
        const [newCompany] = await db
            .insert(companies)
            .values({
                userId,
                companyName,
                subdomain,
                city,
                phone,
                whatsapp: phone,
                isActive: true,
            })
            .returning();

        return NextResponse.json({
            success: true,
            company: newCompany,
        });
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu, tekrar deneyin" },
            { status: 500 }
        );
    }
}
