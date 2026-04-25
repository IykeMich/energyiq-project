import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_BRANDING, type Branding } from './types';
import { fetchBranding } from './fetch';
import { applyBranding } from './apply';
import { slugFromPathname } from './slug';

// ════════════════════════════════════════════════════════════════
// BrandingProvider — sits near the top of the app tree.
// Watches the URL for a slug, fetches branding, applies CSS vars,
// and exposes the current branding via useBranding().
// ════════════════════════════════════════════════════════════════

interface BrandingContextValue {
  branding: Branding;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULT_BRANDING,
  isLoading: false,
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const slug = slugFromPathname(pathname);
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setBranding(DEFAULT_BRANDING);
      applyBranding(DEFAULT_BRANDING);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    fetchBranding(slug).then((b) => {
      if (cancelled) return;
      const next = b ?? { ...DEFAULT_BRANDING, slug };
      setBranding(next);
      applyBranding(next);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <BrandingContext.Provider value={{ branding, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding(): Branding {
  return useContext(BrandingContext).branding;
}

export function useBrandingLoading(): boolean {
  return useContext(BrandingContext).isLoading;
}
