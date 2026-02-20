import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { invoices, customers } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const [invoice] = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                customerId: invoices.customerId,
                customerName: customers.name,
                customerEmail: customers.email,
                customerPhone: customers.phone,
                customerTaxNumber: customers.taxNumber,
                customerTaxOffice: customers.taxOffice,
                customerAddress: customers.address,
                items: invoices.items,
                subtotal: invoices.subtotal,
                taxRate: invoices.taxRate,
                taxAmount: invoices.taxAmount,
                total: invoices.total,
                status: invoices.status,
                dueDate: invoices.dueDate,
                paidAt: invoices.paidAt,
                notes: invoices.notes,
                createdAt: invoices.createdAt,
                // NES fields
                nesUuid: invoices.nesUuid,
                invoiceType: invoices.invoiceType,
                gibStatus: invoices.gibStatus,
                nesDocumentNumber: invoices.nesDocumentNumber,
                nesSentAt: invoices.nesSentAt,
            })
            .from(invoices)
            .leftJoin(customers, eq(invoices.customerId, customers.id))
            .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)));

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...invoice,
            items: JSON.parse(invoice.items),
        });
    } catch (error) {
        console.error("Error fetching invoice:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        if (body.status) {
            updateData.status = body.status;
            if (body.status === "paid") {
                updateData.paidAt = new Date();
            }
        }

        if (body.items) {
            updateData.items = JSON.stringify(body.items);
            updateData.subtotal = body.subtotal.toString();
            updateData.taxAmount = body.taxAmount.toString();
            updateData.total = body.total.toString();
        }

        if (body.taxRate) updateData.taxRate = body.taxRate;
        if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
        if (body.notes !== undefined) updateData.notes = body.notes;

        const [updatedInvoice] = await db
            .update(invoices)
            .set(updateData)
            .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
            .returning();

        if (!updatedInvoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json(updatedInvoice);
    } catch (error) {
        console.error("Error updating invoice:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const [deletedInvoice] = await db
            .delete(invoices)
            .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
            .returning();

        if (!deletedInvoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
