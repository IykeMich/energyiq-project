import { Loader2 } from 'lucide-react';

interface SavingOverlayProps {
  message?: string;
}

export function SavingOverlay({ message = 'Saving Reading...' }: SavingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm"
    >
      <Loader2 className="w-20 h-20 text-[#FBC02D] animate-spin" />
      <p className="text-base text-[#FAFAFA] font-medium">{message}</p>
    </div>
  );
}
