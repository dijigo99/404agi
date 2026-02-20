import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const customerList = await db
            .select()
            .from(customers)
            .where(eq(customers.userId, session.user.id))
            .orderBy(desc(customers.createdAt));

        return NextResponse.json(customerList);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, phone, taxNumber, taxOffice, address, notes } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const [newCustomer] = await db
            .insert(customers)
            .values({
                userId: session.user.id,
                name,
                email: email || null,
                phone: phone || null,
                taxNumber: taxNumber || null,
                taxOffice: taxOffice || null,
                address: address || null,
                notes: notes || null,
            })
            .returning();

        return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
        console.error("Error creating customer:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
