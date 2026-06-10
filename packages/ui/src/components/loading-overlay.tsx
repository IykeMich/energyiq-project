import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

/** Full-screen spinner overlay shown while an action is in flight. */
export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-surface-overlay backdrop-blur-sm"
    >
      <Loader2 className="w-20 h-20 text-brand animate-spin" />
      <p className="text-base text-foreground font-medium">{message}</p>
    </div>
  );
}
