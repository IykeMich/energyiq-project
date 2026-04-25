import type { auth } from '@energyiq/domain';

// The store needs the concrete AuthUseCases instance, which the app
// composes in its own container. Instead of importing from the app
// (which would flip the dependency graph), the app calls configureStore()
// at bootstrap and hands us the instance.
let _auth: auth.AuthUseCases | null = null;

export function configureStore(authUseCases: auth.AuthUseCases) {
  _auth = authUseCases;
}

export function authUseCases(): auth.AuthUseCases {
  if (!_auth) {
    throw new Error('@energyiq/store: configureStore() must be called at bootstrap');
  }
  return _auth;
}
