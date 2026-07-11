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
  CreateInvitationRequest,
  Invitation,
  ListInvitationsParams,
  Distributor,
  DistributorRegisterRequest,
  DistributorRegisterResult,
  DistributorVerifyOtpRequest,
  DistributorBusinessProfileRequest,
} from './types';

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
  createOnboardingDocument(req: OnboardingDocumentRequest): Promise<OnboardingDocument>;
  listOnboardingDocuments(registrationToken: string): Promise<OnboardingDocument[]>;
  deleteOnboardingDocument(id: string, registrationToken: string): Promise<void>;

  // Distributor invitations (supplier side)
  createInvitation(req: CreateInvitationRequest): Promise<Invitation>;
  listInvitations(params?: ListInvitationsParams): Promise<Invitation[]>;
  revokeInvitation(id: string): Promise<void>;
  verifyInvitation(token: string): Promise<Invitation>;

  // Distributor public onboarding
  distributorRegister(req: DistributorRegisterRequest): Promise<DistributorRegisterResult>;
  distributorVerifyOtp(req: DistributorVerifyOtpRequest): Promise<void>;
  distributorResendOtp(registrationToken: string): Promise<ResendOtpResult>;
  saveDistributorBusinessProfile(req: DistributorBusinessProfileRequest): Promise<Distributor>;
  activateDistributor(registrationToken: string): Promise<Distributor>;
  createDistributorOnboardingDocument(req: OnboardingDocumentRequest): Promise<OnboardingDocument>;
  listDistributorOnboardingDocuments(registrationToken: string): Promise<OnboardingDocument[]>;
  deleteDistributorOnboardingDocument(id: string, registrationToken: string): Promise<void>;
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
