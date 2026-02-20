// NES Bilgi API Configuration

export const NES_CONFIG = {
    // Test ortamı
    test: {
        baseUrl: 'https://apitest.nes.com.tr',
        portalUrl: 'https://portaltest.nes.com.tr',
        accountUrl: 'https://accounttest.nes.com.tr',
    },
    // Canlı ortam (production)
    prod: {
        baseUrl: 'https://api.nes.com.tr',
        portalUrl: 'https://portal.nes.com.tr',
        accountUrl: 'https://account.nes.com.tr',
    },
} as const;

// Aktif ortam - env'den al, varsayılan test
export const NES_ENV = (process.env.NES_ENV || 'test') as 'test' | 'prod';

export const NES_BASE_URL = NES_CONFIG[NES_ENV].baseUrl;
export const NES_ACCOUNT_URL = NES_CONFIG[NES_ENV].accountUrl;

// API Endpoints
export const NES_ENDPOINTS = {
    // Account API
    token: '/connect/token',

    // E-Arşiv API
    earchive: {
        upload: '/earchive/v1/uploads/document',
        preview: '/earchive/v1/uploads/document/preview',
        draftSend: '/earchive/v1/uploads/draft/send',
        outgoing: '/earchive/v1/outgoing',
        pdf: (uuid: string) => `/earchive/v1/outgoing/${uuid}/pdf`,
        status: (uuid: string) => `/earchive/v1/outgoing/${uuid}`,
    },

    // E-Fatura API
    einvoice: {
        upload: '/einvoice/v1/uploads/document',
        preview: '/einvoice/v1/uploads/document/preview',
        draftSend: '/einvoice/v1/uploads/draft/send',
        outgoing: '/einvoice/v1/outgoing',
        pdf: (uuid: string) => `/einvoice/v1/outgoing/${uuid}/pdf`,
        status: (uuid: string) => `/einvoice/v1/outgoing/${uuid}`,
        checkReceiver: '/einvoice/v1/gibusers', // Alıcının e-fatura mükellefi olup olmadığını kontrol
    },
} as const;

// Timeout settings
export const NES_TIMEOUT = 30000; // 30 seconds

// GİB Status Mapping
export const GIB_STATUS = {
    DRAFT: 'draft',
    PROCESSING: 'processing',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    WAITING: 'waiting',
} as const;

export type GibStatus = typeof GIB_STATUS[keyof typeof GIB_STATUS];
