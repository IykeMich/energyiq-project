import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthUseCases } from './use-cases';
import type { AuthApi, TokenStorage, UserStorage } from './ports';

// ════════════════════════════════════════════════════════════════
// Domain test — pure TypeScript, mock ports, no React.
// This is the pattern for ALL domain use-case tests.
// ════════════════════════════════════════════════════════════════

const mockApi: AuthApi = {
  initiate: vi.fn(),
  complete: vi.fn(),
  login: vi.fn(),
  refresh: vi.fn(),
  changePassword: vi.fn(),
  resetPassword: vi.fn(),
};

const mockTokens: TokenStorage = {
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
};

const mockUser: UserStorage = {
  getUser: vi.fn(),
  setUser: vi.fn(),
  clearUser: vi.fn(),
};

describe('AuthUseCases', () => {
  let auth: AuthUseCases;

  beforeEach(() => {
    vi.clearAllMocks();
    auth = new AuthUseCases(mockApi, mockTokens, mockUser);
  });

  describe('initiate', () => {
    it('calls api.initiate with the request', async () => {
      const req = {
        company: { name: 'MegaEnergy', email: '', business_type: 'LPG', registration_number: 'RC123' },
        account: { name: 'Chioma', email: 'chioma@mega.com', password: 'SecurePass123!' },
      };
      const result = { registration_token: 'token123', account_number: '1234567890', slug: 'megaenergy' };
      vi.mocked(mockApi.initiate).mockResolvedValue(result);

      const response = await auth.initiate(req);

      expect(mockApi.initiate).toHaveBeenCalledWith(req);
      expect(response).toEqual(result);
    });

    it('does not store tokens on initiate', async () => {
      vi.mocked(mockApi.initiate).mockResolvedValue({
        registration_token: 'tok', account_number: '123', slug: 'test',
      });

      await auth.initiate({
        company: { name: 'X', business_type: 'Y', registration_number: 'Z' },
        account: { name: 'A', email: 'a@b.com', password: 'password12345' },
      });

      expect(mockTokens.setTokens).not.toHaveBeenCalled();
    });
  });

  describe('complete', () => {
    it('stores tokens and user on success', async () => {
      const result = {
        access_token: 'acc_token',
        refresh_token: 'ref_token',
        expires_in: 3600,
        supplier: {
          id: 'sup-1', account_number: '1234567890', slug: 'mega',
          company_name: 'MegaEnergy', status: 'active', kyc_status: 'pending',
        },
      };
      vi.mocked(mockApi.complete).mockResolvedValue(result);

      await auth.complete({ registration_token: 'reg_tok', otp_code: '123456' });

      expect(mockTokens.setTokens).toHaveBeenCalledWith('acc_token', 'ref_token');
      expect(mockUser.setUser).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'sup-1', role: 'owner', account_number: '1234567890' }),
      );
    });
  });

  describe('login', () => {
    it('stores tokens and user on success', async () => {
      const result = {
        access_token: 'acc', refresh_token: 'ref', expires_in: 3600,
        login_type: 'account' as const,
        user: {
          id: 'u-1', name: 'Chioma', email: 'chioma@mega.com', role: 'owner',
          entity_type: 'supplier', entity_id: 'sup-1', account_number: '123', slug: 'mega',
        },
      };
      vi.mocked(mockApi.login).mockResolvedValue(result);

      await auth.login({ email: 'chioma@mega.com', password: 'pass' });

      expect(mockTokens.setTokens).toHaveBeenCalledWith('acc', 'ref');
      expect(mockUser.setUser).toHaveBeenCalledWith(result.user);
    });
  });

  describe('logout', () => {
    it('clears tokens and user', () => {
      auth.logout();

      expect(mockTokens.clearTokens).toHaveBeenCalled();
      expect(mockUser.clearUser).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('returns false if no refresh token', async () => {
      vi.mocked(mockTokens.getRefreshToken).mockReturnValue(null);

      const result = await auth.refresh();

      expect(result).toBe(false);
      expect(mockApi.refresh).not.toHaveBeenCalled();
    });

    it('updates access token on success', async () => {
      vi.mocked(mockTokens.getRefreshToken).mockReturnValue('ref_token');
      vi.mocked(mockApi.refresh).mockResolvedValue({ access_token: 'new_acc', expires_in: 3600 });

      const result = await auth.refresh();

      expect(result).toBe(true);
      expect(mockTokens.setTokens).toHaveBeenCalledWith('new_acc', 'ref_token');
    });

    it('logs out on refresh failure', async () => {
      vi.mocked(mockTokens.getRefreshToken).mockReturnValue('ref_token');
      vi.mocked(mockApi.refresh).mockRejectedValue(new Error('expired'));

      const result = await auth.refresh();

      expect(result).toBe(false);
      expect(mockTokens.clearTokens).toHaveBeenCalled();
      expect(mockUser.clearUser).toHaveBeenCalled();
    });
  });

  describe('getState', () => {
    it('returns authenticated state when token and user exist', () => {
      vi.mocked(mockTokens.getAccessToken).mockReturnValue('token');
      vi.mocked(mockTokens.getRefreshToken).mockReturnValue('refresh');
      vi.mocked(mockUser.getUser).mockReturnValue({
        id: '1', name: 'Chioma', email: 'c@m.com', role: 'owner',
        entity_type: 'supplier', entity_id: '1', account_number: '123', slug: 'mega',
      });

      const state = auth.getState();

      expect(state.isAuthenticated).toBe(true);
      expect(state.loginType).toBe('account');
    });

    it('returns unauthenticated when no token', () => {
      vi.mocked(mockTokens.getAccessToken).mockReturnValue(null);
      vi.mocked(mockUser.getUser).mockReturnValue(null);

      const state = auth.getState();

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });
});
