// Branding payload from GET /v1/public/branding/{slug}.
// All visual fields are optional — the provider falls back to EnergyIQ defaults.
export interface Branding {
  slug: string;
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
}

// Defaults applied when no slug is in the URL, or when a fetch fails.
export const DEFAULT_BRANDING: Branding = {
  slug: '',
  companyName: 'EnergyIQ',
  logoUrl: undefined,
  faviconUrl: undefined,
  primaryColor: undefined,
};
