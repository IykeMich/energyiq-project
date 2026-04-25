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
