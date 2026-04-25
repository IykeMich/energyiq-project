import type { AuthApi, TokenStorage, UserStorage } from './ports';
import type {
  InitiateRequest,
  InitiateResult,
  CompleteRequest,
  CompleteResult,
  LoginRequest,
  LoginResult,
  AuthState,
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

    this.tokens.setTokens(result.access_token, result.refresh_token);
    this.user.setUser(result.user);

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
}
