import ky, { type KyInstance, type Options } from 'ky';
import type { ApiResponse } from '@/domain/shared/types';
import { isSuccess } from '@/domain/shared/types';
import { DomainError, NetworkError } from '@/domain/shared/errors';
import { env } from '@/config/env';

// ════════════════════════════════════════════════════════════════
// HTTP client — thin wrapper around ky.
// Handles: base URL, JSON parsing, token injection, error mapping,
// automatic token refresh on 401.
// ════════════════════════════════════════════════════════════════

type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<boolean>;

let getAccessToken: TokenGetter = () => null;
let refreshAccessToken: TokenRefresher = async () => false;

// Called once during app bootstrap to wire in auth
export function configureClient(
  tokenGetter: TokenGetter,
  tokenRefresher: TokenRefresher,
) {
  getAccessToken = tokenGetter;
  refreshAccessToken = tokenRefresher;
}

const instance: KyInstance = ky.create({
  prefix: env.apiBaseUrl,
  timeout: 30_000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getAccessToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status === 401 && !request.url.includes('/public/')) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            const token = getAccessToken();
            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`);
            }
            return ky(request);
          }
        }
      },
    ],
  },
});

// ── Public API ────────────────────────────────────────────────

export async function apiGet<T>(path: string, options?: Options): Promise<T> {
  return request<T>('get', path, options);
}

export async function apiPost<T>(path: string, body?: unknown, options?: Options): Promise<T> {
  return request<T>('post', path, { ...options, json: body });
}

export async function apiPut<T>(path: string, body?: unknown, options?: Options): Promise<T> {
  return request<T>('put', path, { ...options, json: body });
}

export async function apiDelete<T>(path: string, options?: Options): Promise<T> {
  return request<T>('delete', path, options);
}

// ── Internal ──────────────────────────────────────────────────

async function request<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  options?: Options,
): Promise<T> {
  try {
    const response = await instance[method](path, options).json<ApiResponse<T>>();

    if (!isSuccess(response.responseCode)) {
      throw new DomainError(response.responseCode, response.responseMessage, response.data);
    }

    return response.data as T;
  } catch (error) {
    if (error instanceof DomainError) throw error;

    if (error instanceof Error && 'response' in error) {
      const errBody = await extractErrorBody(error as { response: Response });
      if (errBody) throw errBody;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError();
    }

    throw new DomainError('EIQ-5000', 'An unexpected error occurred');
  }
}

async function extractErrorBody(error: { response: Response }): Promise<DomainError | null> {
  try {
    const body = await error.response.json() as ApiResponse;
    return new DomainError(body.responseCode, body.responseMessage, body.data);
  } catch {
    return null;
  }
}
