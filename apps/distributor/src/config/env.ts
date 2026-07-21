export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  appName: import.meta.env.VITE_APP_NAME ?? 'EnergyIQ',
  isDev: import.meta.env.DEV,
} as const;
// Package-local env. Each app injects its base URL at bootstrap via configure().
// We avoid reading import.meta.env here so this package is framework-agnostic
// and testable in isolation.
let apiBaseUrl = 'https://api-dev.energyiq.com/';

export function configureEnv(baseUrl: string) {
  apiBaseUrl = baseUrl;
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}
