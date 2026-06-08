import { WifiOff } from 'lucide-react';

interface NoConnectionBannerProps {
  onRetry?: () => void;
}

export function NoConnectionBanner({ onRetry }: NoConnectionBannerProps) {
  return (
    <div className="bg-[#1F1F1F] border border-[#616161B2] rounded-[16px] px-6 py-5 flex items-start gap-3">
      <WifiOff className="w-5 h-5 text-[#FBC02D] shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#FAFAFA]">No Connection</p>
        <p className="text-xs text-[#FAFAFA]">
          Your entry is saved locally and will post automatically when you’re back online.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="text-xs text-[#FBC02D] font-semibold self-start mt-1 underline"
        >
          Retry Now
        </button>
      </div>
    </div>
  );
}
