import type { auth } from '@energyiq/domain';
import { apiPost } from './client';

// ════════════════════════════════════════════════════════════════
// Auth API adapter — implements AuthApi port via HTTP.
// Used by the auth use-cases in @energyiq/domain/auth.
// ════════════════════════════════════════════════════════════════

export class AuthApiAdapter implements auth.AuthApi {
  async initiate(req: auth.InitiateRequest): Promise<auth.InitiateResult> {
    return apiPost<auth.InitiateResult>('v1/public/auth/initiate', req);
  }

  async complete(req: auth.CompleteRequest): Promise<auth.CompleteResult> {
    return apiPost<auth.CompleteResult>('v1/public/auth/complete', req);
  }

  async login(req: auth.LoginRequest): Promise<auth.LoginResult> {
    return apiPost<auth.LoginResult>('v1/public/auth/login', req);
  }

  async refresh(refreshToken: string): Promise<auth.RefreshResult> {
    return apiPost<auth.RefreshResult>('v1/public/auth/refresh', { refresh_token: refreshToken });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiPost('v1/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async resetPassword(email: string): Promise<void> {
    await apiPost('v1/public/auth/reset-password', { email });
  }
}
