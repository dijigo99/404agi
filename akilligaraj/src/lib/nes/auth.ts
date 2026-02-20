// NES Bilgi API Authentication Service

import { NES_ACCOUNT_URL, NES_ENDPOINTS, NES_TIMEOUT } from './config';
import { NesTokenResponse } from './types';

// Token cache - her API key için ayrı token cache
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

/**
 * NES API'den Bearer token alır
 * API Key kullanarak OAuth2 client credentials flow
 */
export async function getNesToken(apiKey: string): Promise<string> {
    // Check cache
    const cached = tokenCache.get(apiKey);
    if (cached && cached.expiresAt > Date.now() + 60000) {
        // Token hala geçerli (1 dakika buffer)
        return cached.token;
    }

    // Get new token
    const response = await fetch(`${NES_ACCOUNT_URL}${NES_ENDPOINTS.token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'earchive einvoice',
        }),
        signal: AbortSignal.timeout(NES_TIMEOUT),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NES token alınamadı: ${response.status} - ${errorText}`);
    }

    const data: NesTokenResponse = await response.json();

    // Cache token
    tokenCache.set(apiKey, {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
    });

    return data.access_token;
}

/**
 * Cache'i temizle (logout veya API key değişikliğinde)
 */
export function clearNesTokenCache(apiKey?: string): void {
    if (apiKey) {
        tokenCache.delete(apiKey);
    } else {
        tokenCache.clear();
    }
}

/**
 * NES API'ye authenticated request yapar
 */
export async function nesRequest<T>(
    apiKey: string,
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getNesToken(apiKey);

    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
        signal: AbortSignal.timeout(NES_TIMEOUT),
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch {
            errorData = { message: errorText };
        }
        throw new Error(`NES API hatası (${response.status}): ${errorData.message || errorText}`);
    }

    // Check if response is JSON or binary
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        return response.json();
    }

    // For PDF downloads, return as buffer
    if (contentType?.includes('application/pdf')) {
        const buffer = await response.arrayBuffer();
        return { content: Buffer.from(buffer), contentType, fileName: 'invoice.pdf' } as T;
    }

    return response.json();
}
