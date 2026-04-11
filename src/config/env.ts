export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  appName: import.meta.env.VITE_APP_NAME ?? 'EnergyIQ',
  isDev: import.meta.env.DEV,
} as const;
