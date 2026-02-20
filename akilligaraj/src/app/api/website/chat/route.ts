import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { processWebsiteChat, WebsiteUpdateResult } from "@/lib/ai/website-chat";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Get current website content
        const [website] = await db
            .select()
            .from(websites)
            .where(eq(websites.userId, session.user.id));

        if (!website) {
            return NextResponse.json({
                error: "Website not found. Please create a website first."
            }, { status: 404 });
        }

        // Process with AI
        const chatResponse = await processWebsiteChat(message, {
            heroTitle: website.heroTitle || undefined,
            heroSubtitle: website.heroSubtitle || undefined,
            aboutTitle: website.aboutTitle || undefined,
            aboutText: website.aboutText || undefined,
            contactPhone: website.contactPhone || undefined,
            contactEmail: website.contactEmail || undefined,
            contactAddress: website.contactAddress || undefined,
            // Renk ve tasarım alanları
            primaryColor: website.primaryColor || undefined,
            secondaryColor: website.secondaryColor || undefined,
            accentColor: website.accentColor || undefined,
            templateId: website.templateId || undefined,
        });

        // Apply updates if any
        if (chatResponse.updates && chatResponse.updates.length > 0) {
            const updateData: Record<string, unknown> = {
                updatedAt: new Date(),
            };

            const fieldMapping: Record<string, string> = {
                // İçerik
                heroTitle: "heroTitle",
                heroSubtitle: "heroSubtitle",
                aboutTitle: "aboutTitle",
                aboutText: "aboutText",
                // İletişim
                contactPhone: "contactPhone",
                contactEmail: "contactEmail",
                contactAddress: "contactAddress",
                // Renkler ve tasarım
                primaryColor: "primaryColor",
                secondaryColor: "secondaryColor",
                accentColor: "accentColor",
                templateId: "templateId",
            };

            for (const update of chatResponse.updates) {
                const dbField = fieldMapping[update.field];
                if (dbField) {
                    updateData[dbField] = update.value;
                }
            }

            await db
                .update(websites)
                .set(updateData)
                .where(eq(websites.userId, session.user.id));
        }

        return NextResponse.json({
            message: chatResponse.message,
            updates: chatResponse.updates || [],
        });
    } catch (error) {
        console.error("Error processing chat:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
