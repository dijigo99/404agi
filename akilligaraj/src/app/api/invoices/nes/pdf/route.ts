// GET /api/invoices/nes/pdf
// NES'ten fatura PDF indirme

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { invoices, companies } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { downloadInvoicePdf, InvoiceType } from '@/lib/nes';

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
                error: 'Bu fatura henüz NES\'e gönderilmemiş'
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

        // NES'ten PDF indir
        const pdfResponse = await downloadInvoicePdf(
            company.nesApiKey,
            invoice.nesUuid,
            (invoice.invoiceType as InvoiceType) || 'earchive'
        );

        // PDF'i döndür
        return new NextResponse(new Uint8Array(pdfResponse.content), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
            },
        });

    } catch (error) {
        console.error('NES PDF indirme hatası:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'PDF indirilirken bir hata oluştu'
        }, { status: 500 });
    }
}
