import { cn } from '@energyiq/shared';
import type { product } from '@energyiq/domain';

type BadgeStatus = 'active' | 'inactive' | 'draft' | 'pending_review' | 'paused' | 'retired';

const STATUS_STYLE: Record<BadgeStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-success/30', text: 'text-success', label: 'Active' },
  inactive: { bg: 'bg-danger/30', text: 'text-danger', label: 'Inactive' },
  draft: { bg: 'bg-[#9E9E9E4D]', text: 'text-[#9E9E9E]', label: 'Draft' },
  pending_review: { bg: 'bg-amber-500/30', text: 'text-amber-500', label: 'Pending Review' },
  paused: { bg: 'bg-amber-500/30', text: 'text-amber-500', label: 'Paused' },
  retired: { bg: 'bg-danger/30', text: 'text-danger', label: 'Retired' },
};

/** The `product.ProductStatus` enum the backend expects, paired with their display labels. */
export const PRODUCT_STATUS_OPTIONS: { value: product.ProductStatus; label: string }[] = [
  'draft',
  'pending_review',
  'active',
  'paused',
  'retired',
].map((value) => ({ value: value as product.ProductStatus, label: STATUS_STYLE[value as BadgeStatus].label }));

export function ProductStatusBadge({ value, className }: { value: string; className?: string }) {
  const style = STATUS_STYLE[value as BadgeStatus] ?? STATUS_STYLE.draft;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] px-3 py-1 text-xs font-semibold whitespace-nowrap',
        style.bg,
        style.text,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
