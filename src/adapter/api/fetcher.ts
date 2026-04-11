import type { ApiResponse } from '@/domain/shared/types';
import { isSuccess } from '@/domain/shared/types';
import { DomainError, NetworkError } from '@/domain/shared/errors';
import { env } from '@/config/env';

// ════════════════════════════════════════════════════════════════
// Custom fetcher for Orval-generated hooks.
// Signature: fetcher<T>(url, init) — matches what Orval generates.
// Handles: base URL, auth token injection, auto refresh on 401,
// response envelope unwrapping, domain error mapping.
// ════════════════════════════════════════════════════════════════

type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<boolean>;

let getAccessToken: TokenGetter = () => null;
let refreshAccessToken: TokenRefresher = async () => false;

export function configureFetcher(
  tokenGetter: TokenGetter,
  tokenRefresher: TokenRefresher,
) {
  getAccessToken = tokenGetter;
  refreshAccessToken = tokenRefresher;
}

export async function fetcher<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const token = getAccessToken();
  const fullUrl = `${env.apiBaseUrl}${url}`;

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response = await safeFetch(fullUrl, { ...init, headers });

  // Auto-refresh on 401 for non-public routes
  if (response.status === 401 && !url.includes('/public/')) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
      }
      response = await safeFetch(fullUrl, { ...init, headers });
    }
  }

  if (!response.ok) {
    await throwDomainError(response);
  }

  const body = await response.json() as ApiResponse<T>;

  if (!isSuccess(body.responseCode)) {
    throw new DomainError(body.responseCode, body.responseMessage, body.data);
  }

  // Return the full response object for Orval's typing
  return { data: body.data, status: response.status, headers: response.headers } as T;
}

async function safeFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  }
}

async function throwDomainError(response: Response): Promise<never> {
  try {
    const body = await response.json() as ApiResponse;
    throw new DomainError(body.responseCode, body.responseMessage, body.data);
  } catch (error) {
    if (error instanceof DomainError) throw error;
    throw new DomainError('EIQ-5000', `HTTP ${response.status}: ${response.statusText}`);
  }
}

export default fetcher;
