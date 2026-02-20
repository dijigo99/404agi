// NES Bilgi e-Arşiv / e-Fatura Service

import { NES_BASE_URL, NES_ENDPOINTS, GIB_STATUS } from './config';
import { nesRequest } from './auth';
import { buildUblInvoiceXml } from './ubl-builder';
import {
    NesInvoiceData,
    NesUploadResponse,
    NesDocumentStatus,
    NesPdfResponse,
    NesGibUserResponse,
    InvoiceType,
} from './types';

/**
 * e-Arşiv fatura gönderir
 */
export async function sendEArchiveInvoice(
    apiKey: string,
    invoiceData: NesInvoiceData
): Promise<NesUploadResponse> {
    // UBL-TR XML oluştur
    const xml = buildUblInvoiceXml(invoiceData);

    // FormData oluştur
    const formData = new FormData();
    const xmlBlob = new Blob([xml], { type: 'application/xml' });
    formData.append('File', xmlBlob, 'invoice.xml');
    formData.append('IsDirectSend', 'true'); // Direkt gönder (taslak yapma)
    formData.append('PreviewType', 'None');
    formData.append('SourceApp', 'AkilliGaraj');
    formData.append('AutoSaveCompany', 'true');

    const response = await nesRequest<NesUploadResponse>(
        apiKey,
        `${NES_BASE_URL}${NES_ENDPOINTS.earchive.upload}`,
        {
            method: 'POST',
            body: formData,
            headers: {
                // Content-Type otomatik olarak multipart/form-data olacak
            },
        }
    );

    return response;
}

/**
 * e-Fatura gönderir (GİB kayıtlı firmalar arası)
 */
export async function sendEInvoice(
    apiKey: string,
    invoiceData: NesInvoiceData,
    receiverAlias?: string
): Promise<NesUploadResponse> {
    // UBL-TR XML oluştur
    const xml = buildUblInvoiceXml(invoiceData);

    // FormData oluştur
    const formData = new FormData();
    const xmlBlob = new Blob([xml], { type: 'application/xml' });
    formData.append('File', xmlBlob, 'invoice.xml');
    formData.append('IsDirectSend', 'true');
    formData.append('PreviewType', 'None');
    formData.append('SourceApp', 'AkilliGaraj');
    formData.append('AutoSaveCompany', 'true');

    if (receiverAlias) {
        formData.append('ReceiverAlias', receiverAlias);
    }

    const response = await nesRequest<NesUploadResponse>(
        apiKey,
        `${NES_BASE_URL}${NES_ENDPOINTS.einvoice.upload}`,
        {
            method: 'POST',
            body: formData,
            headers: {},
        }
    );

    return response;
}

/**
 * Fatura tipine göre doğru servis ile gönderir
 */
export async function sendInvoice(
    apiKey: string,
    invoiceData: NesInvoiceData,
    receiverAlias?: string
): Promise<NesUploadResponse> {
    if (invoiceData.invoiceType === 'einvoice') {
        return sendEInvoice(apiKey, invoiceData, receiverAlias);
    }
    return sendEArchiveInvoice(apiKey, invoiceData);
}

/**
 * Fatura durumunu sorgular
 */
export async function getInvoiceStatus(
    apiKey: string,
    uuid: string,
    invoiceType: InvoiceType = 'earchive'
): Promise<NesDocumentStatus> {
    const endpoints = invoiceType === 'einvoice'
        ? NES_ENDPOINTS.einvoice
        : NES_ENDPOINTS.earchive;

    const response = await nesRequest<NesDocumentStatus>(
        apiKey,
        `${NES_BASE_URL}${endpoints.status(uuid)}`,
        { method: 'GET' }
    );

    // GIB durumunu map et
    response.gibStatus = mapNesStatusToGibStatus(response.status);

    return response;
}

/**
 * Fatura PDF'ini indirir
 */
export async function downloadInvoicePdf(
    apiKey: string,
    uuid: string,
    invoiceType: InvoiceType = 'earchive'
): Promise<NesPdfResponse> {
    const endpoints = invoiceType === 'einvoice'
        ? NES_ENDPOINTS.einvoice
        : NES_ENDPOINTS.earchive;

    const response = await nesRequest<NesPdfResponse>(
        apiKey,
        `${NES_BASE_URL}${endpoints.pdf(uuid)}`,
        { method: 'GET' }
    );

    return response;
}

/**
 * Alıcının e-Fatura mükellefi olup olmadığını kontrol eder
 */
export async function checkEInvoiceUser(
    apiKey: string,
    taxNumber: string
): Promise<NesGibUserResponse | null> {
    try {
        const response = await nesRequest<NesGibUserResponse[]>(
            apiKey,
            `${NES_BASE_URL}${NES_ENDPOINTS.einvoice.checkReceiver}?query=${taxNumber}`,
            { method: 'GET' }
        );

        if (response && response.length > 0) {
            return {
                ...response[0],
                isEInvoiceUser: true,
            };
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * NES durum kodunu GİB durumuna çevirir
 */
function mapNesStatusToGibStatus(nesStatus: string): typeof GIB_STATUS[keyof typeof GIB_STATUS] {
    const statusMap: Record<string, typeof GIB_STATUS[keyof typeof GIB_STATUS]> = {
        'Draft': GIB_STATUS.DRAFT,
        'Processing': GIB_STATUS.PROCESSING,
        'Succeed': GIB_STATUS.APPROVED,
        'Approved': GIB_STATUS.APPROVED,
        'Accepted': GIB_STATUS.APPROVED,
        'Rejected': GIB_STATUS.REJECTED,
        'Cancelled': GIB_STATUS.CANCELLED,
        'Waiting': GIB_STATUS.WAITING,
        'WaitingForApproval': GIB_STATUS.WAITING,
    };

    return statusMap[nesStatus] || GIB_STATUS.PROCESSING;
}

/**
 * Taslak faturayı onaylar ve gönderir
 */
export async function approveDraftInvoice(
    apiKey: string,
    uuid: string,
    invoiceType: InvoiceType = 'earchive'
): Promise<NesUploadResponse[]> {
    const endpoints = invoiceType === 'einvoice'
        ? NES_ENDPOINTS.einvoice
        : NES_ENDPOINTS.earchive;

    const response = await nesRequest<NesUploadResponse[]>(
        apiKey,
        `${NES_BASE_URL}${endpoints.draftSend}`,
        {
            method: 'POST',
            body: JSON.stringify([uuid]),
        }
    );

    return response;
}
