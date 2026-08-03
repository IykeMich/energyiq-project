import type {
  InitiateRequest,
  InitiateResult,
  CompleteRequest,
  CompleteResult,
  LoginRequest,
  LoginResult,
  RefreshResult,
  AuthUser,
  ResendOtpResult,
  ResetPasswordConfirmRequest,
  OnboardingDocumentRequest,
  OnboardingDocument,
  PresignRegistrationDocumentRequest,
  RegistrationDocumentRequest,
  CreateInvitationRequest,
  Invitation,
  ListInvitationsParams,
  Distributor,
  DistributorRegisterRequest,
  DistributorRegisterResult,
  DistributorVerifyOtpRequest,
  DistributorBusinessProfileRequest,
  DistributorOnboardingDocument,
  DistributorOnboardingDocumentRequest,
  DistributorOnboardingSummary,
  DistributorOnboardingSubmitResult,
  DistributorDocumentType,
  PresignUploadUrlRequest,
  PresignUploadUrlResult,
} from "./types";

// ════════════════════════════════════════════════════════════════
// Outbound ports — interfaces the auth domain needs.
// Implemented by adapters (api, storage).
// The domain NEVER imports adapters — only these interfaces.
// ════════════════════════════════════════════════════════════════

// AuthApi — talks to the backend
export interface AuthApi {
  initiate(req: InitiateRequest): Promise<InitiateResult>;
  complete(req: CompleteRequest): Promise<CompleteResult>;
  login(req: LoginRequest): Promise<LoginResult>;
  refresh(refreshToken: string): Promise<RefreshResult>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;

  // Supplier account security
  logout(refreshToken: string): Promise<void>;
  enableMfa(): Promise<void>;
  verifyMfa(code: string): Promise<void>;

  // Supplier registration follow-ups
  resendOtp(registrationToken: string): Promise<ResendOtpResult>;
  resetPasswordVerify(token: string): Promise<void>;
  resetPasswordConfirm(req: ResetPasswordConfirmRequest): Promise<void>;
  resetPasswordResend(email: string): Promise<void>;
  createOnboardingDocument(
    req: OnboardingDocumentRequest,
  ): Promise<OnboardingDocument>;
  listOnboardingDocuments(): Promise<OnboardingDocument[]>;
  deleteOnboardingDocument(id: string): Promise<void>;

  // Supplier onboarding documents (pre-OTP, registration_token-scoped)
  presignRegistrationDocument(
    req: PresignRegistrationDocumentRequest,
  ): Promise<PresignUploadUrlResult>;
  createRegistrationDocument(
    req: RegistrationDocumentRequest,
  ): Promise<OnboardingDocument>;
  listRegistrationDocuments(
    registrationToken: string,
  ): Promise<OnboardingDocument[]>;

  // Distributor invitations (supplier side)
  createInvitation(req: CreateInvitationRequest): Promise<Invitation>;
  listInvitations(params?: ListInvitationsParams): Promise<Invitation[]>;
  revokeInvitation(id: string): Promise<void>;
  verifyInvitation(token: string): Promise<Invitation>;

  // Distributor public onboarding
  distributorRegister(
    req: DistributorRegisterRequest,
  ): Promise<DistributorRegisterResult>;
  distributorVerifyOtp(req: DistributorVerifyOtpRequest): Promise<LoginResult>;
  distributorResendOtp(email: string, password: string): Promise<LoginResult>;

  // Distributor authenticated onboarding (JWT-bound)
  getDistributorOnboarding(): Promise<DistributorOnboardingSummary>;
  saveDistributorBusinessProfile(
    req: DistributorBusinessProfileRequest,
  ): Promise<Distributor>;
  presignDistributorDocument(
    req: PresignUploadUrlRequest,
  ): Promise<PresignUploadUrlResult>;
  createDistributorOnboardingDocument(
    req: DistributorOnboardingDocumentRequest,
  ): Promise<DistributorOnboardingDocument>;
  listDistributorOnboardingDocuments(): Promise<
    DistributorOnboardingDocument[]
  >;
  deleteDistributorOnboardingDocument(id: string): Promise<void>;
  submitDistributorOnboarding(): Promise<DistributorOnboardingSubmitResult>;
  listDocumentTypes(): Promise<DistributorDocumentType[]>;

  // Supplier activation of a distributor (requires distributor:activate permission)
  activateDistributor(id: string): Promise<Distributor>;
}

// TokenStorage — persists tokens across page reloads
export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

// UserStorage — persists user info across page reloads
export interface UserStorage {
  getUser(): AuthUser | null;
  setUser(user: AuthUser): void;
  clearUser(): void;
}
