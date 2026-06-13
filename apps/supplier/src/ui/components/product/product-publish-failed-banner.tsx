import { X, XCircle } from 'lucide-react';
import { DISTRIBUTOR_NETWORK_SIZE } from '@/ui/pages/product/mocks';

interface ProductPublishFailedBannerProps {
  productName: string;
  onRetry: () => void;
  onDismiss: () => void;
}

/** Red banner shown at the top of the wizard when publishing the product fails. */
export function ProductPublishFailedBanner({
  productName,
  onRetry,
  onDismiss,
}: ProductPublishFailedBannerProps) {
  return (
    <div className="bg-danger text-danger-foreground rounded-[16px] px-5 py-4 flex items-start gap-3">
      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5 flex-1">
        <p className="text-sm font-semibold">Product Publish Failed</p>
        <p className="text-xs text-danger-foreground/90">
          Your product {productName} couldn’t be published and available to {DISTRIBUTOR_NETWORK_SIZE}{' '}
          distributors in your network due to network issues.{' '}
          <button type="button" onClick={onRetry} className="underline font-semibold">
            Try again.
          </button>
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-danger-foreground/80 hover:text-danger-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
