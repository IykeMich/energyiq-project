import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@energyiq/store';
import {
  initiate as initiateThunk,
  complete as completeThunk,
  login as loginThunk,
  logout as logoutAction,
  logoutRemote as logoutRemoteThunk,
  clearError as clearErrorAction,
  resendOtp as resendOtpThunk,
  resetPassword as resetPasswordThunk,
  resetPasswordVerify as resetPasswordVerifyThunk,
  resetPasswordConfirm as resetPasswordConfirmThunk,
  distributorRegister as distributorRegisterThunk,
  distributorVerifyOtp as distributorVerifyOtpThunk,
  distributorResendOtp as distributorResendOtpThunk,
  saveDistributorBusinessProfile as saveDistributorBusinessProfileThunk,
  activateDistributor as activateDistributorThunk,
  createInvitation as createInvitationThunk,
  verifyInvitation as verifyInvitationThunk,
} from '@energyiq/store';
import type {
  InitiateRequest,
  LoginRequest,
  ResetPasswordConfirmRequest,
  DistributorRegisterRequest,
  DistributorBusinessProfileRequest,
  CreateInvitationRequest,
} from '@energyiq/domain/auth';

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
    if (loginThunk.fulfilled.match(result)) {
      return { success: true as const, slug: result.payload.user.slug };
    }
    return { success: false as const };
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    // Revoke the refresh token server-side before clearing it locally.
    await dispatch(logoutRemoteThunk());
    dispatch(logoutAction());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearErrorAction());
  }, [dispatch]);

  const handleResendOtp = useCallback(async () => {
    const result = await dispatch(resendOtpThunk());
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleResetPassword = useCallback(async (email: string) => {
    const result = await dispatch(resetPasswordThunk(email));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleResetPasswordVerify = useCallback(async (token: string) => {
    const result = await dispatch(resetPasswordVerifyThunk(token));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleResetPasswordConfirm = useCallback(async (req: ResetPasswordConfirmRequest) => {
    const result = await dispatch(resetPasswordConfirmThunk(req));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleDistributorRegister = useCallback(async (req: DistributorRegisterRequest) => {
    const result = await dispatch(distributorRegisterThunk(req));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleDistributorVerifyOtp = useCallback(async (otpCode: string) => {
    const result = await dispatch(distributorVerifyOtpThunk(otpCode));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleDistributorResendOtp = useCallback(async () => {
    const result = await dispatch(distributorResendOtpThunk());
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleSaveDistributorBusinessProfile = useCallback(
    async (req: Omit<DistributorBusinessProfileRequest, 'registration_token'>) => {
      const result = await dispatch(saveDistributorBusinessProfileThunk(req));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch],
  );

  const handleActivateDistributor = useCallback(async () => {
    const result = await dispatch(activateDistributorThunk());
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleCreateInvitation = useCallback(async (req: CreateInvitationRequest) => {
    const result = await dispatch(createInvitationThunk(req));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  const handleVerifyInvitation = useCallback(async (token: string) => {
    const result = await dispatch(verifyInvitationThunk(token));
    return result.meta.requestStatus === 'fulfilled';
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
    distributor: auth.distributor,
    invitation: auth.invitation,

    // Actions
    initiate: handleInitiate,
    complete: handleComplete,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
    resendOtp: handleResendOtp,
    resetPassword: handleResetPassword,
    resetPasswordVerify: handleResetPasswordVerify,
    resetPasswordConfirm: handleResetPasswordConfirm,
    distributorRegister: handleDistributorRegister,
    distributorVerifyOtp: handleDistributorVerifyOtp,
    distributorResendOtp: handleDistributorResendOtp,
    saveDistributorBusinessProfile: handleSaveDistributorBusinessProfile,
    activateDistributor: handleActivateDistributor,
    createInvitation: handleCreateInvitation,
    verifyInvitation: handleVerifyInvitation,
  };
}
