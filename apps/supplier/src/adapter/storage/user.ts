import type { UserStorage } from '@energyiq/domain/auth';
import type { AuthUser } from '@energyiq/domain/auth';

const USER_KEY = 'eiq_user';

// LocalStorage adapter implementing UserStorage port
export class LocalUserStorage implements UserStorage {
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }
}
