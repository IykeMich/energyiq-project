import type { Branding } from './types';

// Sets the CSS vars that the rest of the app reads via Tailwind/theme.css.
// Called once per tenant fetch. Safe to call multiple times — each call
// overwrites the previous. No-op on server-side.
export function applyBranding(b: Branding): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (b.primaryColor) {
    root.style.setProperty('--brand-primary', b.primaryColor);
  } else {
    root.style.removeProperty('--brand-primary');
  }

  if (b.faviconUrl) {
    const link = ensureFaviconLink();
    link.href = b.faviconUrl;
  }

  if (b.companyName) {
    document.title = b.companyName;
  }
}

function ensureFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  return link;
}
