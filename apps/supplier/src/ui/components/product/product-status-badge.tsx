import { cn } from '@energyiq/shared';
import type { product } from '@energyiq/domain';

type BadgeStatus = 'active' | 'inactive' | 'draft' | 'pending_review' | 'paused' | 'retired';

const STATUS_STYLE: Record<BadgeStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-[#388E3C4D]', text: 'text-[#388E3C]', label: 'Active' },
  inactive: { bg: 'bg-danger/30', text: 'text-danger', label: 'Inactive' },
  draft: { bg: 'bg-[#9E9E9E4D]', text: 'text-[#9E9E9E]', label: 'Draft' },
  pending_review: { bg: 'bg-[#FB8C1C4D]', text: 'text-[#FB8C1C]', label: 'Pending Review' },
  paused: { bg: 'bg-[#9E9E9E4D]', text: 'text-[#9E9E9E]', label: 'Paused' },
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
        'inline-flex items-center justify-center rounded-[22px] px-3 py-1 text-xs font-medium whitespace-nowrap',
        style.bg,
        style.text,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
