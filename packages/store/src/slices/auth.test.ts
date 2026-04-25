import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice, initiate, login, logout, clearError } from './auth';

// ════════════════════════════════════════════════════════════════
// Redux store test — slice reducers + async thunks.
// We mock the package's `../config` module so thunks call our spy
// instead of the real composition root.
// ════════════════════════════════════════════════════════════════

const useCasesMock = {
  initiate: vi.fn(),
  complete: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  changePassword: vi.fn(),
  resetPassword: vi.fn(),
  getState: vi.fn(() => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loginType: null,
    isAuthenticated: false,
  })),
};

vi.mock('../config', () => ({
  authUseCases: () => useCasesMock,
  configureStore: vi.fn(),
}));

function createTestStore() {
  return configureStore({ reducer: { auth: authSlice.reducer } });
}

describe('auth slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createTestStore();
  });

  describe('reducers', () => {
    it('clears error', () => {
      store.dispatch(clearError());
      expect(store.getState().auth.error).toBeNull();
    });

    it('resets state on logout', () => {
      store.dispatch(logout());
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(useCasesMock.logout).toHaveBeenCalled();
    });
  });

  describe('initiate thunk', () => {
    const req = {
      company: { name: 'Test', business_type: 'LPG', registration_number: 'RC1' },
      account: { name: 'User', email: 'u@t.com', password: 'password12345' },
    };

    it('sets registration token on success', async () => {
      useCasesMock.initiate.mockResolvedValue({
        registration_token: 'reg_tok',
        account_number: '1234567890',
        slug: 'test',
      });

      await store.dispatch(initiate(req));

      const state = store.getState().auth;
      expect(state.registrationToken).toBe('reg_tok');
      expect(state.accountNumber).toBe('1234567890');
      expect(state.slug).toBe('test');
      expect(state.isLoading).toBe(false);
    });

    it('sets error on failure', async () => {
      useCasesMock.initiate.mockRejectedValue(new Error('Email taken'));
      await store.dispatch(initiate(req));
      const state = store.getState().auth;
      expect(state.error).toBe('Email taken');
      expect(state.isLoading).toBe(false);
    });

    it('sets loading during request', async () => {
      useCasesMock.initiate.mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => resolve({ registration_token: 't', account_number: '1', slug: 's' }), 10);
        }),
      );

      const promise = store.dispatch(initiate(req));
      expect(store.getState().auth.isLoading).toBe(true);
      await promise;
      expect(store.getState().auth.isLoading).toBe(false);
    });
  });

  describe('login thunk', () => {
    it('sets user and auth state on success', async () => {
      useCasesMock.login.mockResolvedValue({
        access_token: 'acc', refresh_token: 'ref', expires_in: 3600,
        login_type: 'account',
        user: {
          id: '1', name: 'Chioma', email: 'c@m.com', role: 'owner',
          entity_type: 'supplier', entity_id: '1', account_number: '123', slug: 'mega',
        },
      });

      await store.dispatch(login({ email: 'c@m.com', password: 'pass' }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginType).toBe('account');
      expect(state.user?.name).toBe('Chioma');
    });
  });
});
