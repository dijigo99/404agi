import { NextResponse } from "next/server";

// Simulated domain availability check
// In production, this would call GoDaddy/Namecheap API
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get("domain");

        if (!domain) {
            return NextResponse.json({ error: "Domain is required" }, { status: 400 });
        }

        // Clean domain
        const cleanDomain = domain
            .toLowerCase()
            .replace(/^(https?:\/\/)?/, "")
            .replace(/\/+$/, "")
            .trim();

        // Validate domain format
        const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/;
        if (!domainRegex.test(cleanDomain)) {
            return NextResponse.json({
                available: false,
                error: "Invalid domain format"
            });
        }

        // Simulate API call - in production, use actual domain registrar API
        // Example: GoDaddy API, Namecheap API, etc.

        // For demo purposes, simulate availability check
        const isAvailable = Math.random() > 0.3; // 70% chance available

        // Get TLD for pricing
        const tld = cleanDomain.split(".").pop() || "com";
        const prices: Record<string, number> = {
            "com": 299,
            "net": 249,
            "org": 279,
            "com.tr": 149,
            "tr": 99,
        };

        return NextResponse.json({
            domain: cleanDomain,
            available: isAvailable,
            price: isAvailable ? (prices[tld] || 199) : undefined,
            currency: "TL",
        });
    } catch (error) {
        console.error("Error checking domain:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
