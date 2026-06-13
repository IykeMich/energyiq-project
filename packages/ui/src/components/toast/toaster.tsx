import { useSyncExternalStore } from 'react';
import { ToastItem } from './toast-item';
import { getToasts, subscribe, toast } from './toast-store';

/**
 * App-wide toast host. Mount once at the top of the content area; trigger toasts anywhere
 * with the re-exported `toast` helper (`toast.success(...)`, `toast.error(...)`).
 *
 * Renders full-width banners pinned to the top of its (positioned) container, styled per
 * variant for the EnergyIQ dark canvas, with slide/fade enter-and-exit transitions.
 */
export function Toaster() {
  const toasts = useSyncExternalStore(subscribe, getToasts, getToasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex flex-col gap-3 p-4">
      {toasts.map((entry) => (
        <ToastItem key={entry.id} toast={entry} onDismiss={toast.dismiss} />
      ))}
    </div>
  );
}

/**
 * Wide error banner for permission / "No Access" errors. The custom toast is already a
 * full-width banner, so this just maps to a standard error toast.
 */
export function notifyNoAccess(message: string, title = 'No Access.'): void {
  toast.error(title, { description: message, duration: 5000 });
}

// Re-export the trigger so call sites import everything toast-related from @energyiq/ui.
export { toast } from './toast-store';
