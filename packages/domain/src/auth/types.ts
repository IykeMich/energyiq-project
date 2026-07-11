// ════════════════════════════════════════════════════════════════
// Auth domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type LoginType = 'account' | 'staff';

// Initiate registration
export interface InitiateRequest {
  company: {
    name: string;
    email?: string;
    business_type: string;
    registration_number: string;
  };
  account: {
    name: string;
    email: string;
    password: string;
  };
}

export interface InitiateResult {
  registration_token: string;
  account_number: string;
  slug: string;
  /**
   * Dev-only: the OTP echoed back by the backend when APP_ENV=development,
   * so the frontend can autofill the verify form without depending on real
   * email delivery. Never present in production.
   */
  dev_otp?: string;
}

// Complete registration
export interface CompleteRequest {
  registration_token: string;
  otp_code: string;
}

export interface CompleteResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  supplier: SupplierSummary;
}

export interface SupplierSummary {
  id: string;
  account_number: string;
  slug: string;
  company_name: string;
  status: string;
  kyc_status: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
  mfa_code?: string;
}

export interface LoginResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  login_type: LoginType;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  entity_type: string;
  entity_id: string;
  account_number: string;
  slug: string;
}

// Token refresh
export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResult {
  access_token: string;
  expires_in: number;
}

// Auth state held in memory
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginType: LoginType | null;
  isAuthenticated: boolean;
}

// MFA
export interface VerifyMfaRequest {
  code: string;
}

// OTP resend (shared shape for both supplier and distributor registration flows)
export interface ResendOtpResult {
  dev_otp?: string;
}

// Password reset
export interface ResetPasswordConfirmRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Onboarding documents (shared shape for both supplier and distributor registration flows)
export interface OnboardingDocumentRequest {
  registration_token: string;
  document_type: string;
  file_name: string;
  file_size: number;
  file_url: string;
  mime_type: string;
}

export interface OnboardingDocument {
  id?: string;
  document_type?: string;
  file_name?: string;
  file_size?: number;
  file_url?: string;
  mime_type?: string;
  status?: string;
  distributor_id?: string;
  created_at?: number | string;
  updated_at?: number | string;
}

// Distributor invitations (supplier side)
export interface CreateInvitationRequest {
  email: string;
  name: string;
  phone?: string;
}

export interface Invitation {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: string;
  token?: string;
  registration_url?: string;
  expires_at?: string;
  accepted_at?: string;
  created_at?: string;
  supplier_id?: string;
  supplier_name?: string;
}

export interface ListInvitationsParams {
  limit?: number;
  offset?: number;
}

// Distributor public onboarding
export interface Distributor {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  tier?: string;
  status?: string;
  kyc_status?: string;
  risk_score?: number;
  supplier_id?: string;
  owner_user_id?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email_verified?: boolean;
  address?: Record<string, unknown>;
  activated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DistributorRegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  invitation_token: string;
}

export interface DistributorRegisterResult {
  registration_token?: string;
  distributor?: Distributor;
  dev_otp?: string;
}

export interface DistributorVerifyOtpRequest {
  registration_token: string;
  otp_code: string;
}

export interface DistributorBusinessProfileRequest {
  registration_token: string;
  business_name: string;
  address: Record<string, unknown>;
  phone?: string;
  tax_id?: string;
  meta?: Record<string, unknown>;
}
