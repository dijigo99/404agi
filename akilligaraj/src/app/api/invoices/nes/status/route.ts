// GET /api/invoices/nes/status
// NES'ten fatura durumu sorgulama

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { invoices, companies } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getInvoiceStatus, InvoiceType } from '@/lib/nes';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const invoiceId = searchParams.get('invoiceId');

        if (!invoiceId) {
            return NextResponse.json({ error: 'Fatura ID gerekli' }, { status: 400 });
        }

        // Faturayı getir
        const [invoice] = await db
            .select()
            .from(invoices)
            .where(and(
                eq(invoices.id, invoiceId),
                eq(invoices.userId, session.user.id)
            ));

        if (!invoice) {
            return NextResponse.json({ error: 'Fatura bulunamadı' }, { status: 404 });
        }

        if (!invoice.nesUuid) {
            return NextResponse.json({
                error: 'Bu fatura henüz NES\'e gönderilmemiş',
                gibStatus: 'draft',
            }, { status: 400 });
        }

        // Şirket bilgilerini getir
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.userId, session.user.id));

        if (!company?.nesApiKey) {
            return NextResponse.json({ error: 'NES API bilgileri eksik' }, { status: 400 });
        }

        // NES'ten durum sorgula
        const status = await getInvoiceStatus(
            company.nesApiKey,
            invoice.nesUuid,
            (invoice.invoiceType as InvoiceType) || 'earchive'
        );

        // Veritabanını güncelle
        if (status.gibStatus && status.gibStatus !== invoice.gibStatus) {
            await db
                .update(invoices)
                .set({
                    gibStatus: status.gibStatus,
                    nesDocumentNumber: status.documentNumber || invoice.nesDocumentNumber,
                    updatedAt: new Date(),
                })
                .where(eq(invoices.id, invoiceId));
        }

        return NextResponse.json({
            success: true,
            nesUuid: invoice.nesUuid,
            documentNumber: status.documentNumber,
            status: status.status,
            statusDescription: status.statusDescription,
            gibStatus: status.gibStatus,
            issueDate: status.issueDate,
            total: status.total,
        });

    } catch (error) {
        console.error('NES durum sorgulama hatası:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Durum sorgulanırken bir hata oluştu'
        }, { status: 500 });
    }
}
