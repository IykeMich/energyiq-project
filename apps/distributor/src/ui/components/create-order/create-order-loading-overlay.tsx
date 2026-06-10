import { Loader2 } from 'lucide-react';

/**
 * Full-screen submitting overlay: a #121212 scrim at 40% opacity with a centred
 * gold spinner. Shown while an order is being submitted/saved.
 */
export function CreateOrderLoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Submitting order"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#121212]/40"
    >
      <Loader2 className="h-12 w-12 animate-spin text-[#FBC02D]" aria-hidden="true" />
    </div>
  );
}
