import type {
  InitiateRequest,
  InitiateResult,
  CompleteRequest,
  CompleteResult,
  LoginRequest,
  LoginResult,
  RefreshResult,
  AuthUser,
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
