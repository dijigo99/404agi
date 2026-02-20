import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { invoices, customers } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const invoiceList = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                customerId: invoices.customerId,
                customerName: customers.name,
                items: invoices.items,
                subtotal: invoices.subtotal,
                taxRate: invoices.taxRate,
                taxAmount: invoices.taxAmount,
                total: invoices.total,
                status: invoices.status,
                dueDate: invoices.dueDate,
                paidAt: invoices.paidAt,
                createdAt: invoices.createdAt,
            })
            .from(invoices)
            .leftJoin(customers, eq(invoices.customerId, customers.id))
            .where(eq(invoices.userId, session.user.id))
            .orderBy(desc(invoices.createdAt));

        return NextResponse.json(invoiceList);
    } catch (error) {
        console.error("Error fetching invoices:", error);
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
        const { customerId, items, subtotal, taxRate, taxAmount, total, dueDate, notes } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
        }

        // Generate invoice number
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
        const invoiceNumber = `FTR-${year}${month}-${random}`;

        const [newInvoice] = await db
            .insert(invoices)
            .values({
                userId: session.user.id,
                customerId: customerId || null,
                invoiceNumber,
                items: JSON.stringify(items),
                subtotal: subtotal.toString(),
                taxRate: taxRate || 20,
                taxAmount: taxAmount.toString(),
                total: total.toString(),
                status: "draft",
                dueDate: dueDate ? new Date(dueDate) : null,
                notes: notes || null,
            })
            .returning();

        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
