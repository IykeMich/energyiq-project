import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@energyiq/store";
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
  saveDistributorBusinessProfile as saveDistributorBusinessProfileThunk,
  activateDistributor as activateDistributorThunk,
  createInvitation as createInvitationThunk,
  verifyInvitation as verifyInvitationThunk,
  listDocumentTypes as listDocumentTypesThunk,
  presignDistributorDocument as presignDistributorDocumentThunk,
  createDistributorOnboardingDocument as createDistributorOnboardingDocumentThunk,
  submitDistributorOnboarding as submitDistributorOnboardingThunk,
  getDistributorOnboarding as getDistributorOnboardingThunk,
  listDistributorOnboardingDocuments as listDistributorOnboardingDocumentsThunk,
  deleteDistributorOnboardingDocument as deleteDistributorOnboardingDocumentThunk,
  presignRegistrationDocument as presignRegistrationDocumentThunk,
  createRegistrationDocument as createRegistrationDocumentThunk,
} from "@energyiq/store";
import type {
  InitiateRequest,
  LoginRequest,
  LoginResult,
  ResetPasswordConfirmRequest,
  DistributorRegisterRequest,
  DistributorVerifyOtpRequest,
  DistributorBusinessProfileRequest,
  DistributorOnboardingDocumentRequest,
  PresignUploadUrlRequest,
  PresignRegistrationDocumentRequest,
  RegistrationDocumentRequest,
  CreateInvitationRequest,
} from "@energyiq/domain/auth";

// ════════════════════════════════════════════════════════════════
// useAuth — hook that bridges React components to Redux auth slice.
// Components import this, never the store or thunks directly.
// ════════════════════════════════════════════════════════════════

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleInitiate = useCallback(
    async (req: InitiateRequest) => {
      const result = await dispatch(initiateThunk(req));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleComplete = useCallback(
    async (otpCode: string) => {
      const result = await dispatch(completeThunk(otpCode));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleLogin = useCallback(
    async (req: LoginRequest): Promise<LoginResult | null> => {
      const result = await dispatch(loginThunk(req));
      if (loginThunk.fulfilled.match(result)) {
        return result.payload;
      }
      return null;
    },
    [dispatch],
  );

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
    return result.meta.requestStatus === "fulfilled";
  }, [dispatch]);

  const handleResetPassword = useCallback(
    async (email: string) => {
      const result = await dispatch(resetPasswordThunk(email));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleResetPasswordVerify = useCallback(
    async (token: string) => {
      const result = await dispatch(resetPasswordVerifyThunk(token));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleResetPasswordConfirm = useCallback(
    async (req: ResetPasswordConfirmRequest) => {
      const result = await dispatch(resetPasswordConfirmThunk(req));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleDistributorRegister = useCallback(
    async (req: DistributorRegisterRequest) => {
      const result = await dispatch(distributorRegisterThunk(req));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleDistributorVerifyOtp = useCallback(
    async (req: DistributorVerifyOtpRequest) => {
      const result = await dispatch(distributorVerifyOtpThunk(req));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleDistributorResendOtp = useCallback(
    async (req: LoginRequest): Promise<LoginResult | null> => {
      // Distributor OTP resend is implemented by repeating the login call,
      // which triggers the OTP send subject to the Redis cooldown.
      return handleLogin(req);
    },
    [handleLogin],
  );

  const handleSaveDistributorBusinessProfile = useCallback(
    async (req: DistributorBusinessProfileRequest) => {
      const result = await dispatch(saveDistributorBusinessProfileThunk(req));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleListDocumentTypes = useCallback(async () => {
    const result = await dispatch(listDocumentTypesThunk());
    if (listDocumentTypesThunk.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const handlePresignDistributorDocument = useCallback(
    async (req: PresignUploadUrlRequest) => {
      const result = await dispatch(presignDistributorDocumentThunk(req));
      if (presignDistributorDocumentThunk.fulfilled.match(result)) {
        return result.payload;
      }
      return null;
    },
    [dispatch],
  );

  const handleCreateDistributorOnboardingDocument = useCallback(
    async (req: DistributorOnboardingDocumentRequest) => {
      const result = await dispatch(
        createDistributorOnboardingDocumentThunk(req),
      );
      if (createDistributorOnboardingDocumentThunk.fulfilled.match(result)) {
        return result.payload;
      }
      return null;
    },
    [dispatch],
  );

  const handleSubmitDistributorOnboarding = useCallback(async () => {
    const result = await dispatch(submitDistributorOnboardingThunk());
    if (submitDistributorOnboardingThunk.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const handleGetDistributorOnboarding = useCallback(async () => {
    const result = await dispatch(getDistributorOnboardingThunk());
    if (getDistributorOnboardingThunk.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const handleListDistributorOnboardingDocuments = useCallback(async () => {
    const result = await dispatch(listDistributorOnboardingDocumentsThunk());
    if (listDistributorOnboardingDocumentsThunk.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  const handleDeleteDistributorOnboardingDocument = useCallback(
    async (id: string) => {
      const result = await dispatch(
        deleteDistributorOnboardingDocumentThunk(id),
      );
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleActivateDistributor = useCallback(
    async (id: string) => {
      const result = await dispatch(activateDistributorThunk(id));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleCreateInvitation = useCallback(
    async (req: CreateInvitationRequest) => {
      const result = await dispatch(createInvitationThunk(req));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handleVerifyInvitation = useCallback(
    async (token: string) => {
      const result = await dispatch(verifyInvitationThunk(token));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch],
  );

  const handlePresignRegistrationDocument = useCallback(
    async (req: PresignRegistrationDocumentRequest) => {
      const result = await dispatch(presignRegistrationDocumentThunk(req));
      if (presignRegistrationDocumentThunk.fulfilled.match(result)) {
        return result.payload;
      }
      return null;
    },
    [dispatch],
  );

  const handleCreateRegistrationDocument = useCallback(
    async (req: RegistrationDocumentRequest) => {
      const result = await dispatch(createRegistrationDocumentThunk(req));
      if (createRegistrationDocumentThunk.fulfilled.match(result)) {
        return result.payload;
      }
      return null;
    },
    [dispatch],
  );

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
    nextAction: auth.nextAction,
    otpResendAfterSeconds: auth.otpResendAfterSeconds,
    devOtp: auth.devOtp,
    documentTypes: auth.documentTypes,

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
    listDocumentTypes: handleListDocumentTypes,
    presignDistributorDocument: handlePresignDistributorDocument,
    createDistributorOnboardingDocument:
      handleCreateDistributorOnboardingDocument,
    submitDistributorOnboarding: handleSubmitDistributorOnboarding,
    getDistributorOnboarding: handleGetDistributorOnboarding,
    listDistributorOnboardingDocuments:
      handleListDistributorOnboardingDocuments,
    deleteDistributorOnboardingDocument:
      handleDeleteDistributorOnboardingDocument,
    activateDistributor: handleActivateDistributor,
    createInvitation: handleCreateInvitation,
    verifyInvitation: handleVerifyInvitation,
    presignRegistrationDocument: handlePresignRegistrationDocument,
    createRegistrationDocument: handleCreateRegistrationDocument,
  };
}
