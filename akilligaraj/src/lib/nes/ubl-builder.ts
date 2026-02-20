// UBL-TR 1.2 XML Builder for NES Bilgi API
// GİB standartlarına uygun e-Fatura/e-Arşiv XML oluşturma

import { NesInvoiceData, NesInvoiceItem } from './types';

/**
 * UUID v4 formatında benzersiz kimlik oluşturur
 */
function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * Tarihi ISO 8601 formatına çevirir
 */
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Tarihi saat bilgisiyle ISO formatına çevirir
 */
function formatDateTime(date: Date): string {
    return date.toISOString().split('T')[1].substring(0, 8);
}

/**
 * Sayıyı 2 ondalık basamakla formatlar
 */
function formatAmount(amount: number): string {
    return amount.toFixed(2);
}

/**
 * XML karakterlerini escape eder
 */
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Fatura kalemi XML'i oluşturur
 */
function buildInvoiceLineXml(item: NesInvoiceItem, lineId: number): string {
    const lineExtensionAmount = item.quantity * item.unitPrice;
    const taxAmount = lineExtensionAmount * (item.taxRate / 100);

    return `
        <cac:InvoiceLine>
            <cbc:ID>${lineId}</cbc:ID>
            <cbc:InvoicedQuantity unitCode="${item.unitCode}">${item.quantity}</cbc:InvoicedQuantity>
            <cbc:LineExtensionAmount currencyID="TRY">${formatAmount(lineExtensionAmount)}</cbc:LineExtensionAmount>
            <cac:TaxTotal>
                <cbc:TaxAmount currencyID="TRY">${formatAmount(taxAmount)}</cbc:TaxAmount>
                <cac:TaxSubtotal>
                    <cbc:TaxableAmount currencyID="TRY">${formatAmount(lineExtensionAmount)}</cbc:TaxableAmount>
                    <cbc:TaxAmount currencyID="TRY">${formatAmount(taxAmount)}</cbc:TaxAmount>
                    <cbc:Percent>${item.taxRate}</cbc:Percent>
                    <cac:TaxCategory>
                        <cac:TaxScheme>
                            <cbc:Name>KDV</cbc:Name>
                            <cbc:TaxTypeCode>0015</cbc:TaxTypeCode>
                        </cac:TaxScheme>
                    </cac:TaxCategory>
                </cac:TaxSubtotal>
            </cac:TaxTotal>
            <cac:Item>
                <cbc:Name>${escapeXml(item.name)}</cbc:Name>
                ${item.description ? `<cbc:Description>${escapeXml(item.description)}</cbc:Description>` : ''}
            </cac:Item>
            <cac:Price>
                <cbc:PriceAmount currencyID="TRY">${formatAmount(item.unitPrice)}</cbc:PriceAmount>
            </cac:Price>
        </cac:InvoiceLine>`;
}

/**
 * UBL-TR 1.2 formatında e-Arşiv/e-Fatura XML'i oluşturur
 */
export function buildUblInvoiceXml(data: NesInvoiceData): string {
    const uuid = generateUUID();
    const issueDate = formatDate(data.issueDate);
    const issueTime = formatDateTime(data.issueDate);

    // Profile ID based on invoice type
    const profileId = data.invoiceType === 'einvoice'
        ? 'TEMELFATURA'
        : 'EARSIVFATURA';

    // Invoice type code (SATIS for sales invoice)
    const invoiceTypeCode = 'SATIS';

    // Build invoice lines
    const invoiceLines = data.items
        .map((item, index) => buildInvoiceLineXml(item, index + 1))
        .join('\n');

    // Buyer tax info
    const buyerTaxNumber = data.buyer.taxNumber || '11111111111'; // TCKN for individuals
    const isCorporate = buyerTaxNumber.length === 10; // VKN 10, TCKN 11 hane

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
    xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
    xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
    xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
    
    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
    <cbc:CustomizationID>TR1.2</cbc:CustomizationID>
    <cbc:ProfileID>${profileId}</cbc:ProfileID>
    <cbc:ID>${escapeXml(data.invoiceNumber)}</cbc:ID>
    <cbc:CopyIndicator>false</cbc:CopyIndicator>
    <cbc:UUID>${uuid}</cbc:UUID>
    <cbc:IssueDate>${issueDate}</cbc:IssueDate>
    <cbc:IssueTime>${issueTime}</cbc:IssueTime>
    <cbc:InvoiceTypeCode>${invoiceTypeCode}</cbc:InvoiceTypeCode>
    ${data.notes ? `<cbc:Note>${escapeXml(data.notes)}</cbc:Note>` : ''}
    <cbc:DocumentCurrencyCode>${data.currencyCode}</cbc:DocumentCurrencyCode>
    <cbc:LineCountNumeric>${data.items.length}</cbc:LineCountNumeric>
    
    <!-- Gönderici (Satıcı) Bilgileri -->
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="VKN">${data.seller.nesVkn}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>${escapeXml(data.seller.companyName)}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>${escapeXml(data.seller.address || '')}</cbc:StreetName>
                <cbc:CitySubdivisionName>${escapeXml(data.seller.district || '')}</cbc:CitySubdivisionName>
                <cbc:CityName>${escapeXml(data.seller.city || '')}</cbc:CityName>
                <cac:Country>
                    <cbc:Name>Türkiye</cbc:Name>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cac:TaxScheme>
                    <cbc:Name>${escapeXml(data.seller.nesTaxOffice || 'VERGİ DAİRESİ')}</cbc:Name>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:Contact>
                ${data.seller.phone ? `<cbc:Telephone>${escapeXml(data.seller.phone)}</cbc:Telephone>` : ''}
                ${data.seller.email ? `<cbc:ElectronicMail>${escapeXml(data.seller.email)}</cbc:ElectronicMail>` : ''}
            </cac:Contact>
        </cac:Party>
    </cac:AccountingSupplierParty>
    
    <!-- Alıcı (Müşteri) Bilgileri -->
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="${isCorporate ? 'VKN' : 'TCKN'}">${buyerTaxNumber}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>${escapeXml(data.buyer.name)}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>${escapeXml(data.buyer.address || '')}</cbc:StreetName>
                <cbc:CitySubdivisionName>${escapeXml(data.buyer.district || '')}</cbc:CitySubdivisionName>
                <cbc:CityName>${escapeXml(data.buyer.city || '')}</cbc:CityName>
                <cac:Country>
                    <cbc:Name>Türkiye</cbc:Name>
                </cac:Country>
            </cac:PostalAddress>
            ${isCorporate ? `
            <cac:PartyTaxScheme>
                <cac:TaxScheme>
                    <cbc:Name>${escapeXml(data.buyer.taxOffice || 'VERGİ DAİRESİ')}</cbc:Name>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>` : ''}
            <cac:Contact>
                ${data.buyer.phone ? `<cbc:Telephone>${escapeXml(data.buyer.phone)}</cbc:Telephone>` : ''}
                ${data.buyer.email ? `<cbc:ElectronicMail>${escapeXml(data.buyer.email)}</cbc:ElectronicMail>` : ''}
            </cac:Contact>
        </cac:Party>
    </cac:AccountingCustomerParty>
    
    <!-- Vergi Toplamları -->
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="TRY">${formatAmount(data.taxAmount)}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="TRY">${formatAmount(data.subtotal)}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="TRY">${formatAmount(data.taxAmount)}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cac:TaxScheme>
                    <cbc:Name>KDV</cbc:Name>
                    <cbc:TaxTypeCode>0015</cbc:TaxTypeCode>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
    
    <!-- Fatura Toplamları -->
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="TRY">${formatAmount(data.subtotal)}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="TRY">${formatAmount(data.subtotal)}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="TRY">${formatAmount(data.total)}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="TRY">${formatAmount(data.total)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
    
    <!-- Fatura Kalemleri -->
    ${invoiceLines}
    
</Invoice>`;

    return xml.trim();
}

/**
 * Fatura XML'ini zip dosyasına çevirir (base64)
 */
export async function zipInvoiceXml(xml: string): Promise<Blob> {
    // Browser'da veya Node.js'de çalışabilmesi için basit bir implementasyon
    // Gerçek uygulamada JSZip veya benzeri bir kütüphane kullanılabilir

    // Şimdilik XML'i doğrudan döndürüyoruz
    // NES API hem .xml hem .zip kabul ediyor
    return new Blob([xml], { type: 'application/xml' });
}
