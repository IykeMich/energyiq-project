import type { AuthApi } from '@/domain/auth/ports';
import type {
  InitiateRequest,
  InitiateResult,
  CompleteRequest,
  CompleteResult,
  LoginRequest,
  LoginResult,
  RefreshResult,
} from '@/domain/auth/types';
import { apiPost } from './client';

// ════════════════════════════════════════════════════════════════
// Auth API adapter — implements AuthApi port via HTTP
// ════════════════════════════════════════════════════════════════

export class AuthApiAdapter implements AuthApi {
  async initiate(req: InitiateRequest): Promise<InitiateResult> {
    return apiPost<InitiateResult>('v1/public/auth/initiate', req);
  }

  async complete(req: CompleteRequest): Promise<CompleteResult> {
    return apiPost<CompleteResult>('v1/public/auth/complete', req);
  }

  async login(req: LoginRequest): Promise<LoginResult> {
    return apiPost<LoginResult>('v1/public/auth/login', req);
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    return apiPost<RefreshResult>('v1/public/auth/refresh', { refresh_token: refreshToken });
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
