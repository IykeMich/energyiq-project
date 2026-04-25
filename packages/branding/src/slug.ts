// Slug is the first URL path segment: supplier.energyiq.io/acme/... → "acme".
// Returns null for the root (`/` or `/login` with no tenant).
// Reserved paths (public routes that don't carry a slug) return null.
const RESERVED = new Set(['login', 'signup', 'forgot-password', 'reset-password']);

export function slugFromPathname(pathname: string): string | null {
  const first = pathname.split('/').filter(Boolean)[0];
  if (!first) return null;
  if (RESERVED.has(first)) return null;
  return first;
}
