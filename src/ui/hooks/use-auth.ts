import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/ui/store';
import {
  initiate as initiateThunk,
  complete as completeThunk,
  login as loginThunk,
  logout as logoutAction,
  clearError as clearErrorAction,
} from '@/ui/store/slices/auth';
import type { InitiateRequest, LoginRequest } from '@/domain/auth';

// ════════════════════════════════════════════════════════════════
// useAuth — hook that bridges React components to Redux auth slice.
// Components import this, never the store or thunks directly.
// ════════════════════════════════════════════════════════════════

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleInitiate = useCallback(async (req: InitiateRequest) => {
    const result = await dispatch(initiateThunk(req));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleComplete = useCallback(async (otpCode: string) => {
    const result = await dispatch(completeThunk(otpCode));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleLogin = useCallback(async (req: LoginRequest) => {
    const result = await dispatch(loginThunk(req));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearErrorAction());
  }, [dispatch]);

  return {
    // State
    user: auth.user,
    loginType: auth.loginType,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    registrationToken: auth.registrationToken,
    accountNumber: auth.accountNumber,
    slug: auth.slug,

    // Actions
    initiate: handleInitiate,
    complete: handleComplete,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
  };
}
