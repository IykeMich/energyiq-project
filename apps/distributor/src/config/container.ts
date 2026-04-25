import { auth } from '@energyiq/domain';
import {
  AuthApiAdapter,
  configureClient,
  configureEnv,
  configureFetcher,
} from '@energyiq/api';
import { configureStore } from '@energyiq/store';
import { LocalTokenStorage } from '@/adapter/storage/token';
import { LocalUserStorage } from '@/adapter/storage/user';
import { env } from './env';

// ════════════════════════════════════════════════════════════════
// Composition root — wire adapters to domain use cases.
// The ONLY place that knows about concrete implementations.
// Everything else depends on ports.
// ════════════════════════════════════════════════════════════════

// Inject the API base URL into @energyiq/api before any HTTP call.
configureEnv(env.apiBaseUrl);

// Adapters
const tokenStorage = new LocalTokenStorage();
const userStorage = new LocalUserStorage();
const authApi = new AuthApiAdapter();

// Domain use cases
export const authUseCases = new auth.AuthUseCases(authApi, tokenStorage, userStorage);

// Wire token getter + refresh into both HTTP clients (manual + Orval).
configureClient(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);
configureFetcher(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);

// Hand the use-cases instance to @energyiq/store so its thunks can call them.
configureStore(authUseCases);
