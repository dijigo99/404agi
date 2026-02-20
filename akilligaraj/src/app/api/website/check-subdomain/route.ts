import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const subdomain = searchParams.get("subdomain");

        if (!subdomain) {
            return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
        }

        const [existing] = await db
            .select({ id: websites.id })
            .from(websites)
            .where(eq(websites.subdomain, subdomain.toLowerCase()));

        return NextResponse.json({ available: !existing });
    } catch (error) {
        console.error("Error checking subdomain:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
