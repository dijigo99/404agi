// NES Bilgi API Types

import { GibStatus } from './config';

// Invoice Types
export type InvoiceType = 'earchive' | 'einvoice';

// Token Response
export interface NesTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

// Company NES Info (from database)
export interface NesCompanyInfo {
    nesApiKey: string;
    nesVkn: string;
    nesSenderAlias: string;
    nesMailboxAlias?: string;
    nesTaxOffice?: string;
    companyName: string;
    address?: string;
    phone?: string;
    email?: string;
    city?: string;
    district?: string;
}

// Customer Info for Invoice
export interface NesCustomerInfo {
    name: string;
    taxNumber?: string; // VKN veya TCKN
    taxOffice?: string;
    address?: string;
    phone?: string;
    email?: string;
    city?: string;
    district?: string;
}

// Invoice Item
export interface NesInvoiceItem {
    name: string;
    description?: string;
    quantity: number;
    unitCode: string; // C62 (adet), KGM (kg), MTR (metre), etc.
    unitPrice: number;
    taxRate: number; // %18, %10, %1, %0
    discountRate?: number;
    discountAmount?: number;
}

// Invoice Data for UBL Generation
export interface NesInvoiceData {
    invoiceNumber: string;
    invoiceType: InvoiceType;
    issueDate: Date;
    dueDate?: Date;
    currencyCode: string; // TRY

    // Seller (Company)
    seller: NesCompanyInfo;

    // Buyer (Customer)
    buyer: NesCustomerInfo;

    // Items
    items: NesInvoiceItem[];

    // Totals
    subtotal: number;
    taxAmount: number;
    total: number;

    // Notes
    notes?: string;
}

// Upload Document Response
export interface NesUploadResponse {
    uuid: string;
    documentNumber?: string;
    isSucceeded: boolean;
    errorCode?: string;
    errorMessage?: string;
    previewLink?: string;
}

// Document Status Response
export interface NesDocumentStatus {
    uuid: string;
    documentNumber: string;
    status: string;
    statusDescription: string;
    issueDate: string;
    receiverName?: string;
    receiverTaxNumber?: string;
    total: number;
    gibStatus?: GibStatus;
}

// PDF Download Response
export interface NesPdfResponse {
    content: Buffer;
    contentType: string;
    fileName: string;
}

// GIB User Check Response (e-Fatura mükellefi kontrolü)
export interface NesGibUserResponse {
    identifier: string;
    title: string;
    alias: string[];
    isEInvoiceUser: boolean;
}

// Error Response
export interface NesErrorResponse {
    message: string;
    errors?: Array<{
        code: string;
        description: string;
        detail: string;
    }>;
    invalidFields?: Array<{
        field: string;
        description: string;
        detail: string;
    }>;
}
