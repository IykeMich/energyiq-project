import type { auth } from "@energyiq/domain";
import { apiGet, apiPost, apiPut, apiDelete } from "./client";

// ════════════════════════════════════════════════════════════════
// Auth API adapter — implements AuthApi port via HTTP.
// Used by the auth use-cases in @energyiq/domain/auth.
// ════════════════════════════════════════════════════════════════

export class AuthApiAdapter implements auth.AuthApi {
  // ── Supplier public registration ──────────────────────────────

  async initiate(req: auth.InitiateRequest): Promise<auth.InitiateResult> {
    return apiPost<auth.InitiateResult>("v1/public/auth/register", req);
  }

  async complete(req: auth.CompleteRequest): Promise<auth.CompleteResult> {
    return apiPost<auth.CompleteResult>("v1/public/auth/verify-otp", req);
  }

  async login(req: auth.LoginRequest): Promise<auth.LoginResult> {
    return apiPost<auth.LoginResult>("v1/public/auth/login", req);
  }

  async refresh(refreshToken: string): Promise<auth.RefreshResult> {
    return apiPost<auth.RefreshResult>("v1/public/auth/refresh", {
      refresh_token: refreshToken,
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiPost("v1/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async resetPassword(email: string): Promise<void> {
    await apiPost("v1/public/auth/forgot-password", { email });
  }

  // ── Supplier account security ─────────────────────────────────

  async logout(refreshToken: string): Promise<void> {
    await apiPost("v1/auth/logout", { refresh_token: refreshToken });
  }

  async enableMfa(): Promise<void> {
    await apiPost("v1/auth/enable-mfa");
  }

  async verifyMfa(code: string): Promise<void> {
    await apiPost("v1/auth/verify-mfa", { code });
  }

  // ── Supplier registration follow-ups (post-login) ───────────────

  async resendOtp(registrationToken: string): Promise<auth.ResendOtpResult> {
    return apiPost<auth.ResendOtpResult>("v1/public/auth/resend-otp", {
      registration_token: registrationToken,
    });
  }

  async resetPasswordVerify(token: string): Promise<void> {
    await apiGet(`v1/public/auth/reset-password/verify/${token}`);
  }

  async resetPasswordConfirm(
    req: auth.ResetPasswordConfirmRequest,
  ): Promise<void> {
    await apiPost("v1/public/auth/reset-password/confirm", req);
  }

  async resetPasswordResend(email: string): Promise<void> {
    await apiPost("v1/public/auth/reset-password/resend", { email });
  }

  async createOnboardingDocument(
    req: auth.OnboardingDocumentRequest,
  ): Promise<auth.OnboardingDocument> {
    return apiPost<auth.OnboardingDocument>(
      "v1/auth/onboarding-documents",
      req,
    );
  }

  async listOnboardingDocuments(): Promise<auth.OnboardingDocument[]> {
    return apiGet<auth.OnboardingDocument[]>("v1/auth/onboarding-documents");
  }

  async presignOnboardingDocument(
    req: auth.PresignUploadUrlRequest,
  ): Promise<auth.PresignUploadUrlResult> {
    return apiPost<auth.PresignUploadUrlResult>(
      "v1/auth/onboarding-documents/presigned-url",
      req,
    );
  }

  // ── Supplier onboarding documents (pre-OTP, registration_token-scoped) ──

  async presignRegistrationDocument(
    req: auth.PresignRegistrationDocumentRequest,
  ): Promise<auth.PresignUploadUrlResult> {
    return apiPost<auth.PresignUploadUrlResult>(
      "v1/public/auth/onboarding-documents/presigned-url",
      req,
    );
  }

  async createRegistrationDocument(
    req: auth.RegistrationDocumentRequest,
  ): Promise<auth.OnboardingDocument> {
    return apiPost<auth.OnboardingDocument>(
      "v1/public/auth/onboarding-documents",
      req,
    );
  }

  async listRegistrationDocuments(
    registrationToken: string,
  ): Promise<auth.OnboardingDocument[]> {
    return apiGet<auth.OnboardingDocument[]>(
      `v1/public/auth/onboarding-documents/${registrationToken}`,
    );
  }

  // ── Distributor invitations (supplier side) ────────────────────

  async createInvitation(
    req: auth.CreateInvitationRequest,
  ): Promise<auth.Invitation> {
    return apiPost<auth.Invitation>("v1/invitation/create", req);
  }

  async listInvitations(
    params?: auth.ListInvitationsParams,
  ): Promise<auth.Invitation[]> {
    const searchParams: Record<string, number> = {};
    if (params?.limit !== undefined) searchParams.limit = params.limit;
    if (params?.offset !== undefined) searchParams.offset = params.offset;
    return apiGet<auth.Invitation[]>("v1/invitation/list", { searchParams });
  }

  async revokeInvitation(id: string): Promise<void> {
    await apiDelete(`v1/invitation/revoke/${id}`);
  }

  async verifyInvitation(token: string): Promise<auth.Invitation> {
    return apiGet<auth.Invitation>("v1/public/invitation/verify", {
      searchParams: { token },
    });
  }

  // ── Distributor public onboarding ─────────────────────────────

  async distributorRegister(
    req: auth.DistributorRegisterRequest,
  ): Promise<auth.DistributorRegisterResult> {
    return apiPost<auth.DistributorRegisterResult>(
      "v1/public/distributor/register",
      req,
    );
  }

  async distributorVerifyOtp(
    req: auth.DistributorVerifyOtpRequest,
  ): Promise<auth.LoginResult> {
    return apiPost<auth.LoginResult>("v1/public/distributor/verify-otp", req);
  }

  async distributorResendOtp(
    email: string,
    password: string,
  ): Promise<auth.LoginResult> {
    // The backend deliberately has no tokenless public resend endpoint.
    // Repeating the login call with the same credentials triggers the OTP send
    // subject to the Redis cooldown, so resend is routed through login.
    return this.login({ email, password });
  }

  // ── Distributor authenticated onboarding (JWT-bound) ───────────

  async getDistributorOnboarding(): Promise<auth.DistributorOnboardingSummary> {
    return apiGet<auth.DistributorOnboardingSummary>(
      "v1/auth/distributor-onboarding",
    );
  }

  async saveDistributorBusinessProfile(
    req: auth.DistributorBusinessProfileRequest,
  ): Promise<auth.Distributor> {
    return apiPut<auth.Distributor>(
      "v1/auth/distributor-onboarding/business-profile",
      req,
    );
  }

  async presignDistributorDocument(
    req: auth.PresignUploadUrlRequest,
  ): Promise<auth.PresignUploadUrlResult> {
    return apiPost<auth.PresignUploadUrlResult>(
      "v1/auth/distributor-onboarding/documents/presigned-url",
      req,
    );
  }

  async createDistributorOnboardingDocument(
    req: auth.DistributorOnboardingDocumentRequest,
  ): Promise<auth.DistributorOnboardingDocument> {
    return apiPost<auth.DistributorOnboardingDocument>(
      "v1/auth/distributor-onboarding/documents",
      req,
    );
  }

  async listDistributorOnboardingDocuments(): Promise<
    auth.DistributorOnboardingDocument[]
  > {
    return apiGet<auth.DistributorOnboardingDocument[]>(
      "v1/auth/distributor-onboarding/documents",
    );
  }

  async deleteDistributorOnboardingDocument(id: string): Promise<void> {
    await apiDelete(`v1/auth/distributor-onboarding/documents/${id}`);
  }

  async submitDistributorOnboarding(): Promise<auth.DistributorOnboardingSubmitResult> {
    return apiPost<auth.DistributorOnboardingSubmitResult>(
      "v1/auth/distributor-onboarding/submit",
    );
  }

  async listDocumentTypes(): Promise<auth.DistributorDocumentType[]> {
    return apiGet<auth.DistributorDocumentType[]>("v1/document-type/list");
  }

  // ── Supplier activation of a distributor ──────────────────────

  async activateDistributor(id: string): Promise<auth.Distributor> {
    return apiPost<auth.Distributor>(`v1/distributor/activate/${id}`);
  }
}
