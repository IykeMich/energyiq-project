import type { TokenStorage } from '@/domain/auth/ports';

const ACCESS_TOKEN_KEY = 'eiq_access_token';
const REFRESH_TOKEN_KEY = 'eiq_refresh_token';

// LocalStorage adapter implementing TokenStorage port
export class LocalTokenStorage implements TokenStorage {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
