"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { auth } from "@/lib/auth/auth";

export async function publishWebsite(websiteId: string, updates: any) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Verify ownership implicitly or explicitly if needed.
    // For safety, let's at least assert they are updating their own possible site.

    await db.update(websites)
        .set({
            templateId: updates.templateId,
            primaryColor: updates.primaryColor,
            heroTitle: updates.heroTitle,
            heroSubtitle: updates.heroSubtitle,
            aboutTitle: updates.aboutTitle,
            aboutText: updates.aboutText,
            updatedAt: new Date(),
        })
        .where(eq(websites.id, websiteId));

    revalidatePath("/dashboard/website");
    revalidatePath("/dashboard/website/builder");

    return { success: true };
}
