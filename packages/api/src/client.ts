import ky, { type KyInstance, type Options } from 'ky';
import type { shared } from '@energyiq/domain';
import { shared as sharedNS } from '@energyiq/domain';
import { getApiBaseUrl } from './env';

const { isSuccess, ResponseCodes } = sharedNS;
const { DomainError, NetworkError, ValidationError } = sharedNS;

// ════════════════════════════════════════════════════════════════
// HTTP client — thin wrapper around ky.
// Handles: base URL, JSON parsing, token injection, error mapping,
// automatic token refresh on 401.
// ════════════════════════════════════════════════════════════════

type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<boolean>;

let getAccessToken: TokenGetter = () => null;
let refreshAccessToken: TokenRefresher = async () => false;

// Called once during app bootstrap to wire in auth.
export function configureClient(
  tokenGetter: TokenGetter,
  tokenRefresher: TokenRefresher,
) {
  getAccessToken = tokenGetter;
  refreshAccessToken = tokenRefresher;
}

const instance: KyInstance = ky.create({
  timeout: 30_000,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (request.url.includes('/public/')) return;
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
  const url = `${getApiBaseUrl().replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  try {
    const response = await instance[method](url, options).json<shared.ApiResponse<T>>();
    if (!isSuccess(response.responseCode)) {
      throw new DomainError(response.responseCode, response.responseMessage, response.data);
    }
    return response.data as T;
  } catch (error) {
    if (error instanceof DomainError) throw error;

    if (error instanceof Error && 'response' in error) {
      const errBody = extractErrorBody(error as { data?: shared.ApiResponse });
      if (errBody) throw errBody;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError();
    }

    throw new DomainError('EIQ-5000', 'An unexpected error occurred');
  }
}

// ky pre-parses and consumes the response body into `error.data` when it
// builds an HTTPError, so `error.response.json()` can no longer be read here.
function extractErrorBody(error: { data?: shared.ApiResponse }): shared.DomainError | null {
  const body = error.data;
  if (!body?.responseCode) return null;

  // Field-level validation failures nest the real detail under data:
  // data.message is a short human summary, data.errors are the specific
  // per-field messages. The top-level responseMessage is just the generic
  // "Request validation failed" wrapper — never shown to the user.
  if (body.responseCode === ResponseCodes.VALIDATION_FAILED) {
    const data = body.data as { message?: string; errors?: shared.ErrorFieldMessage[] } | null;
    if (data?.errors?.length) {
      return new ValidationError(data.message ?? body.responseMessage, data.errors);
    }
  }

  return new DomainError(body.responseCode, body.responseMessage, body.data);
}

/** Strips undefined values from a params object so ky doesn't serialize them as "undefined". */
export function toSearchParams(params?: object): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;
  const entries: [string, string | number | boolean][] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) entries.push([key, value as string | number | boolean]);
  }
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
