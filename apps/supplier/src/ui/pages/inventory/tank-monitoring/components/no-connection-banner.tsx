import { WifiOff } from 'lucide-react';

interface NoConnectionBannerProps {
  onRetry?: () => void;
}

export function NoConnectionBanner({ onRetry }: NoConnectionBannerProps) {
  return (
    <div className="bg-surface-modal border border-border-subtle rounded-[16px] px-6 py-5 flex items-start gap-3">
      <WifiOff className="w-5 h-5 text-brand shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">No Connection</p>
        <p className="text-xs text-foreground">
          Your entry is saved locally and will post automatically when you’re back online.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="text-xs text-brand font-semibold self-start mt-1 underline"
        >
          Retry Now
        </button>
      </div>
    </div>
  );
}
