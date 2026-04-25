import { apiGet } from '@energyiq/api';
import type { Branding } from './types';

// Fetches the public branding for a slug. Returns null (not error) when the
// slug doesn't exist so the UI can gracefully fall back to defaults.
export async function fetchBranding(slug: string): Promise<Branding | null> {
  if (!slug) return null;
  try {
    return await apiGet<Branding>(`v1/public/branding/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}
