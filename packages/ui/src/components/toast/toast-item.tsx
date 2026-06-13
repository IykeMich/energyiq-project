import { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { ToastEntry, ToastVariant } from './toast-store';

interface VariantStyle {
  container: string;
  icon: LucideIcon;
}

// Solid full-width banners matching the design; white text on a coloured surface.
const VARIANT_STYLE: Record<ToastVariant, VariantStyle> = {
  success: { container: 'bg-[#2E7D32]', icon: CheckCircle2 },
  error: { container: 'bg-[#D30A0A]', icon: AlertCircle },
  info: { container: 'bg-[#1565C0]', icon: Info },
  warning: { container: 'bg-[#B45309]', icon: AlertTriangle },
};

interface ToastItemProps {
  toast: ToastEntry;
  onDismiss: (id: number) => void;
}

/** A single full-width banner toast with slide-down/fade enter + exit transitions. */
export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [entered, setEntered] = useState(false);
  const style = VARIANT_STYLE[toast.variant];
  const Icon = style.icon;

  // Play the enter transition on the frame after mount.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = entered && !toast.closing;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl px-5 py-4 text-white shadow-lg transition-all duration-200 ease-out',
        style.container,
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="text-sm text-white/85">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="tap-effect -mr-1 shrink-0 text-white/80 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
