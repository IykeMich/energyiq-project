// ════════════════════════════════════════════════════════════════
// Auth domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type LoginType = "account" | "staff";

export type LoginNextAction =
  "verify_email" | "complete_onboarding" | "pending_review" | "dashboard";

// Closed CAC business-type enum required by the supplier registration endpoint.
export type BusinessType =
  | "business_name"
  | "private_limited_company"
  | "public_limited_company"
  | "incorporated_trustees"
  | "limited_partnership"
  | "limited_liability_partnership";

export const BusinessTypeLabels: Record<BusinessType, string> = {
  business_name: "Business Name",
  private_limited_company: "Private Limited Company",
  public_limited_company: "Public Limited Company",
  incorporated_trustees: "Incorporated Trustees",
  limited_partnership: "Limited Partnership",
  limited_liability_partnership: "Limited Liability Partnership",
};

// ── Supplier registration ───────────────────────────────────────

export interface RegisterRequest {
  company: {
    name: string;
    email?: string;
    business_type: BusinessType;
    registration_number: string;
  };
  account: {
    first_name: string;
    last_name: string;
    name?: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
    accepted_terms: boolean;
    accepted_privacy_policy: boolean;
  };
}

export interface RegisterResult {
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

// Legacy aliases used by the existing use-case/store names.
export type InitiateRequest = RegisterRequest;
export type InitiateResult = RegisterResult;

// ── Supplier OTP verification ───────────────────────────────────

export interface VerifyOtpRequest {
  registration_token: string;
  otp_code: string;
}

export interface VerifyOtpResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  supplier: SupplierSummary;
}

export type CompleteRequest = VerifyOtpRequest;
export type CompleteResult = VerifyOtpResult;

export interface SupplierSummary {
  id: string;
  account_number: string;
  slug: string;
  company_name: string;
  status: string;
  kyc_status: string;
  name: string;
  email: string;
}

// ── Login (shared entry point for suppliers and distributors) ─────

export interface LoginRequest {
  email: string;
  password: string;
  mfa_code?: string;
}

export interface LoginResult {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  login_type?: LoginType;
  /**
   * Backend routing hint. Only email-verified accounts return tokens;
   * pending distributors receive `verify_email` or `complete_onboarding`.
   */
  next_action?: LoginNextAction;
  otp_resend_after_seconds?: number;
  user?: AuthUser;
  /**
   * Dev-only: echoed OTP in development environments.
   */
  dev_otp?: string;
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

// ── Token refresh ───────────────────────────────────────────────

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResult {
  access_token: string;
  expires_in: number;
}

// ── Auth state held in memory ───────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginType: LoginType | null;
  isAuthenticated: boolean;
}

// ── MFA ───────────────────────────────────────────────────────────

export interface VerifyMfaRequest {
  code: string;
}

// ── OTP resend ────────────────────────────────────────────────────

export interface ResendOtpResult {
  dev_otp?: string;
  otp_resend_after_seconds?: number;
}

// ── Password reset ──────────────────────────────────────────────

export interface ResetPasswordConfirmRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

// ── Supplier onboarding documents (post-login) ────────────────────

export interface OnboardingDocumentRequest {
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

// ── Supplier onboarding documents (pre-OTP, registration_token-scoped) ──
// Uploaded between `initiate()` and `complete()`, while registration_token
// is still valid (it's deleted once OTP verification succeeds).

export interface PresignRegistrationDocumentRequest {
  registration_token: string;
  file_name: string;
  content_type: string;
}

export interface RegistrationDocumentRequest {
  registration_token: string;
  document_type: string;
  file_name: string;
  file_size: number;
  file_url: string;
  mime_type: string;
}

// ── Distributor invitations (supplier side) ───────────────────────

export interface CreateInvitationRequest {
  distributor_name: string;
  email: string;
  phone?: string;
  contact_person: string;
  location: string;
  assurance_amount?: number;
}

export interface Invitation {
  id?: string;
  email?: string;
  distributor_name?: string;
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

// ── Distributor public onboarding ───────────────────────────────

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
  next_action?: "verify_email";
  otp_resend_after_seconds?: number;
  distributor?: Distributor;
  dev_otp?: string;
}

export interface DistributorVerifyOtpRequest {
  email: string;
  otp_code: string;
}

export interface DistributorBusinessProfileRequest {
  registered_business_name: string;
  cac_number: string;
  tin: string;
  business_address: string;
  business_phone_number: string;
  country: string;
  state: string;
  city: string;
  operational_regions: string[];
  primary_contact_person: string;
}

// ── Distributor authenticated onboarding (JWT-bound) ──────────────

export interface DistributorDocumentType {
  document_type: string;
  document_name: string;
  required: boolean;
  allowed_file_types: string[];
  max_file_size_mb: number;
  audience: "supplier" | "distributor" | "both";
}

export interface DistributorOnboardingDocument {
  id?: string;
  document_type?: string;
  file_name?: string;
  file_size?: number;
  file_url?: string;
  mime_type?: string;
  status?: string;
  created_at?: number | string;
  updated_at?: number | string;
}

export interface DistributorOnboardingDocumentRequest {
  document_type: string;
  file_name: string;
  file_size: number;
  file_url: string;
  mime_type: string;
}

export interface PresignUploadUrlRequest {
  file_name: string;
  content_type: string;
}

export interface PresignUploadUrlResult {
  upload_url: string;
  public_url: string;
  method: string;
  headers?: Record<string, string>;
  key?: string;
  expires_at?: string;
}

export interface DistributorOnboardingSummary {
  distributor?: Distributor;
  documents?: DistributorOnboardingDocument[];
  required_documents?: DistributorDocumentType[];
}

export interface DistributorOnboardingSubmitResult {
  distributor: Distributor;
  kyc_status: string;
  status: string;
}
