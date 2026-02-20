// POST /api/invoices/nes/send
// NES Bilgi'ye e-Fatura/e-Arşiv gönderme

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { invoices, customers, companies } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendInvoice, checkEInvoiceUser, NesInvoiceData, NesInvoiceItem, InvoiceType } from '@/lib/nes';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const body = await request.json();
        const { invoiceId, invoiceType = 'earchive' } = body as {
            invoiceId: string;
            invoiceType?: InvoiceType;
        };

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

        // Zaten gönderilmiş mi kontrol et
        if (invoice.nesUuid) {
            return NextResponse.json({
                error: 'Bu fatura zaten NES\'e gönderilmiş',
                nesUuid: invoice.nesUuid,
                gibStatus: invoice.gibStatus,
            }, { status: 400 });
        }

        // Şirket bilgilerini getir (NES API bilgileri dahil)
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.userId, session.user.id));

        if (!company) {
            return NextResponse.json({ error: 'Şirket bilgileri bulunamadı' }, { status: 404 });
        }

        if (!company.nesApiKey || !company.nesVkn || !company.nesSenderAlias) {
            return NextResponse.json({
                error: 'NES API bilgileri eksik. Lütfen şirket ayarlarından NES bilgilerini girin.'
            }, { status: 400 });
        }

        // Müşteri bilgilerini getir
        let customerData = null;
        if (invoice.customerId) {
            const [customer] = await db
                .select()
                .from(customers)
                .where(eq(customers.id, invoice.customerId));
            customerData = customer;
        }

        // e-Fatura seçildiyse, alıcının e-Fatura mükellefi olup olmadığını kontrol et
        let receiverAlias: string | undefined;
        if (invoiceType === 'einvoice' && customerData?.taxNumber) {
            const gibUser = await checkEInvoiceUser(company.nesApiKey, customerData.taxNumber);
            if (!gibUser?.isEInvoiceUser) {
                return NextResponse.json({
                    error: 'Müşteri e-Fatura mükellefi değil. e-Arşiv fatura kullanın.',
                    suggestion: 'earchive',
                }, { status: 400 });
            }
            receiverAlias = gibUser.alias[0];
        }

        // Fatura kalemlerini parse et
        let invoiceItems: NesInvoiceItem[];
        try {
            const parsedItems = JSON.parse(invoice.items);
            invoiceItems = parsedItems.map((item: {
                name?: string;
                description?: string;
                quantity?: number;
                unitPrice?: number;
                unit?: string;
            }) => ({
                name: item.name || 'Hizmet',
                description: item.description,
                quantity: item.quantity || 1,
                unitCode: item.unit || 'C62', // C62 = adet
                unitPrice: item.unitPrice || 0,
                taxRate: invoice.taxRate,
            }));
        } catch {
            invoiceItems = [{
                name: 'Nakliyat Hizmeti',
                quantity: 1,
                unitCode: 'C62',
                unitPrice: Number(invoice.subtotal),
                taxRate: invoice.taxRate,
            }];
        }

        // NES Invoice Data oluştur
        const nesInvoiceData: NesInvoiceData = {
            invoiceNumber: invoice.invoiceNumber,
            invoiceType: invoiceType,
            issueDate: new Date(),
            dueDate: invoice.dueDate || undefined,
            currencyCode: 'TRY',
            seller: {
                nesApiKey: company.nesApiKey,
                nesVkn: company.nesVkn,
                nesSenderAlias: company.nesSenderAlias,
                nesMailboxAlias: company.nesMailboxAlias || undefined,
                nesTaxOffice: company.nesTaxOffice || undefined,
                companyName: company.companyName,
                address: company.address || undefined,
                phone: company.phone || undefined,
                email: company.email || undefined,
                city: company.city || undefined,
                district: company.district || undefined,
            },
            buyer: {
                name: customerData?.name || 'Müşteri',
                taxNumber: customerData?.taxNumber || undefined,
                taxOffice: customerData?.taxOffice || undefined,
                address: customerData?.address || undefined,
                phone: customerData?.phone || undefined,
                email: customerData?.email || undefined,
            },
            items: invoiceItems,
            subtotal: Number(invoice.subtotal),
            taxAmount: Number(invoice.taxAmount),
            total: Number(invoice.total),
            notes: invoice.notes || undefined,
        };

        // NES'e gönder
        const nesResponse = await sendInvoice(
            company.nesApiKey,
            nesInvoiceData,
            receiverAlias
        );

        if (!nesResponse.isSucceeded) {
            return NextResponse.json({
                error: `NES hatası: ${nesResponse.errorMessage || 'Bilinmeyen hata'}`,
                errorCode: nesResponse.errorCode,
            }, { status: 400 });
        }

        // Veritabanını güncelle
        await db
            .update(invoices)
            .set({
                nesUuid: nesResponse.uuid,
                invoiceType: invoiceType,
                gibStatus: 'processing',
                nesDocumentNumber: nesResponse.documentNumber,
                nesSentAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(invoices.id, invoiceId));

        return NextResponse.json({
            success: true,
            message: 'Fatura başarıyla gönderildi',
            nesUuid: nesResponse.uuid,
            documentNumber: nesResponse.documentNumber,
            previewLink: nesResponse.previewLink,
        });

    } catch (error) {
        console.error('NES fatura gönderme hatası:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Fatura gönderilirken bir hata oluştu'
        }, { status: 500 });
    }
}
