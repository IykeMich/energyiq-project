// Package-local env. Each app injects its base URL at bootstrap via configure().
// We avoid reading import.meta.env here so this package is framework-agnostic
// and testable in isolation.
let apiBaseUrl = '';

export function configureEnv(baseUrl: string) {
  apiBaseUrl = baseUrl;
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}
