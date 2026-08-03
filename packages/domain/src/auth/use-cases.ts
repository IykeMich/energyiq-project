import type { AuthApi, TokenStorage, UserStorage } from './ports';
import type {
  InitiateRequest,
  InitiateResult,
  CompleteRequest,
  CompleteResult,
  LoginRequest,
  LoginResult,
  AuthState,
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
  DistributorOnboardingDocument,
  DistributorOnboardingDocumentRequest,
  DistributorOnboardingSummary,
  DistributorOnboardingSubmitResult,
  DistributorDocumentType,
  PresignUploadUrlRequest,
  PresignUploadUrlResult,
} from './types';

// ════════════════════════════════════════════════════════════════
// Auth use cases — orchestrate domain logic via ports.
// Pure TypeScript. No React. No HTTP. No localStorage.
// ════════════════════════════════════════════════════════════════

export class AuthUseCases {
  private api: AuthApi;
  private tokens: TokenStorage;
  private user: UserStorage;

  constructor(api: AuthApi, tokens: TokenStorage, user: UserStorage) {
    this.api = api;
    this.tokens = tokens;
    this.user = user;
  }

  // ── Registration ────────────────────────────────────────────

  async initiate(req: InitiateRequest): Promise<InitiateResult> {
    return this.api.initiate(req);
  }

  async complete(req: CompleteRequest): Promise<CompleteResult> {
    const result = await this.api.complete(req);

    this.tokens.setTokens(result.access_token, result.refresh_token);
    this.user.setUser({
      id: result.supplier.id,
      name: '',
      email: '',
      role: 'owner',
      entity_type: 'supplier',
      entity_id: result.supplier.id,
      account_number: result.supplier.account_number,
      slug: result.supplier.slug,
    });

    return result;
  }

  // ── Login ───────────────────────────────────────────────────

  async login(req: LoginRequest): Promise<LoginResult> {
    const result = await this.api.login(req);

    // Only fully-verified accounts receive tokens. Pending distributors may
    // receive a `next_action` routing hint instead.
    if (result.access_token && result.refresh_token && result.user) {
      this.tokens.setTokens(result.access_token, result.refresh_token);
      this.user.setUser(result.user);
    }

    return result;
  }

  // ── Token Refresh ───────────────────────────────────────────

  async refresh(): Promise<boolean> {
    const refreshToken = this.tokens.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const result = await this.api.refresh(refreshToken);
      this.tokens.setTokens(result.access_token, refreshToken);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  // ── Logout ──────────────────────────────────────────────────

  logout(): void {
    this.tokens.clearTokens();
    this.user.clearUser();
  }

  // Revokes the refresh token server-side. Not called anywhere yet — no
  // logout UI exists. Kept separate from the synchronous logout() above so
  // adding it later doesn't need to make the Redux logout reducer async.
  async logoutRemote(): Promise<void> {
    const refreshToken = this.tokens.getRefreshToken();
    if (!refreshToken) return;
    await this.api.logout(refreshToken);
  }

  // ── Auth State ──────────────────────────────────────────────

  getState(): AuthState {
    const user = this.user.getUser();
    const accessToken = this.tokens.getAccessToken();
    const refreshToken = this.tokens.getRefreshToken();

    return {
      user,
      accessToken,
      refreshToken,
      loginType: user ? (user.role === 'owner' ? 'account' : 'staff') : null,
      isAuthenticated: !!accessToken && !!user,
    };
  }

  // ── Password ────────────────────────────────────────────────

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.api.changePassword(currentPassword, newPassword);
  }

  async resetPassword(email: string): Promise<void> {
    return this.api.resetPassword(email);
  }

  async resetPasswordVerify(token: string): Promise<void> {
    return this.api.resetPasswordVerify(token);
  }

  async resetPasswordConfirm(req: ResetPasswordConfirmRequest): Promise<void> {
    return this.api.resetPasswordConfirm(req);
  }

  async resetPasswordResend(email: string): Promise<void> {
    return this.api.resetPasswordResend(email);
  }

  // ── MFA (no UI yet — added for port completeness) ──────────

  async enableMfa(): Promise<void> {
    return this.api.enableMfa();
  }

  async verifyMfa(code: string): Promise<void> {
    return this.api.verifyMfa(code);
  }

  // ── Supplier registration follow-ups ────────────────────────

  async resendOtp(registrationToken: string): Promise<ResendOtpResult> {
    return this.api.resendOtp(registrationToken);
  }

  async createOnboardingDocument(req: OnboardingDocumentRequest): Promise<OnboardingDocument> {
    return this.api.createOnboardingDocument(req);
  }

  async listOnboardingDocuments(): Promise<OnboardingDocument[]> {
    return this.api.listOnboardingDocuments();
  }

  async deleteOnboardingDocument(id: string): Promise<void> {
    return this.api.deleteOnboardingDocument(id);
  }

  // ── Distributor invitations (supplier side) ─────────────────

  async createInvitation(req: CreateInvitationRequest): Promise<Invitation> {
    return this.api.createInvitation(req);
  }

  async listInvitations(params?: ListInvitationsParams): Promise<Invitation[]> {
    return this.api.listInvitations(params);
  }

  async revokeInvitation(id: string): Promise<void> {
    return this.api.revokeInvitation(id);
  }

  async verifyInvitation(token: string): Promise<Invitation> {
    return this.api.verifyInvitation(token);
  }

  // ── Distributor public onboarding ───────────────────────────

  async distributorRegister(req: DistributorRegisterRequest): Promise<DistributorRegisterResult> {
    return this.api.distributorRegister(req);
  }

  async distributorVerifyOtp(req: DistributorVerifyOtpRequest): Promise<LoginResult> {
    const result = await this.api.distributorVerifyOtp(req);

    if (result.access_token && result.refresh_token && result.user) {
      this.tokens.setTokens(result.access_token, result.refresh_token);
      this.user.setUser(result.user);
    }

    return result;
  }

  async distributorResendOtp(email: string, password: string): Promise<LoginResult> {
    // The backend deliberately has no tokenless public resend endpoint.
    // Repeating the login call with the same credentials triggers the OTP send
    // subject to the Redis cooldown, so resend is routed through login.
    return this.api.distributorResendOtp(email, password);
  }

  // ── Distributor authenticated onboarding ────────────────────

  async getDistributorOnboarding(): Promise<DistributorOnboardingSummary> {
    return this.api.getDistributorOnboarding();
  }

  async saveDistributorBusinessProfile(req: DistributorBusinessProfileRequest): Promise<Distributor> {
    return this.api.saveDistributorBusinessProfile(req);
  }

  async presignDistributorDocument(req: PresignUploadUrlRequest): Promise<PresignUploadUrlResult> {
    return this.api.presignDistributorDocument(req);
  }

  async createDistributorOnboardingDocument(req: DistributorOnboardingDocumentRequest): Promise<DistributorOnboardingDocument> {
    return this.api.createDistributorOnboardingDocument(req);
  }

  async listDistributorOnboardingDocuments(): Promise<DistributorOnboardingDocument[]> {
    return this.api.listDistributorOnboardingDocuments();
  }

  async deleteDistributorOnboardingDocument(id: string): Promise<void> {
    return this.api.deleteDistributorOnboardingDocument(id);
  }

  async submitDistributorOnboarding(): Promise<DistributorOnboardingSubmitResult> {
    return this.api.submitDistributorOnboarding();
  }

  async listDocumentTypes(): Promise<DistributorDocumentType[]> {
    return this.api.listDocumentTypes();
  }

  // ── Supplier activation of a distributor ─────────────────────

  async activateDistributor(id: string): Promise<Distributor> {
    return this.api.activateDistributor(id);
  }
}
