import { AuthUseCases } from '@/domain/auth/use-cases';
import { AuthApiAdapter } from '@/adapter/api/auth';
import { LocalTokenStorage } from '@/adapter/storage/token';
import { LocalUserStorage } from '@/adapter/storage/user';
import { configureClient } from '@/adapter/api/client';
import { configureFetcher } from '@/adapter/api/fetcher';

// ════════════════════════════════════════════════════════════════
// Composition root — wire adapters to domain use cases.
// This is the ONLY place that knows about concrete implementations.
// Everything else depends on interfaces (ports).
// ════════════════════════════════════════════════════════════════

// Adapters
const tokenStorage = new LocalTokenStorage();
const userStorage = new LocalUserStorage();
const authApi = new AuthApiAdapter();

// Domain use cases
export const authUseCases = new AuthUseCases(authApi, tokenStorage, userStorage);

// Wire token management into HTTP clients
// Manual client (for domain use-cases that bypass Orval)
configureClient(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);

// Orval-generated hooks client (same auth, same error handling)
configureFetcher(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);
