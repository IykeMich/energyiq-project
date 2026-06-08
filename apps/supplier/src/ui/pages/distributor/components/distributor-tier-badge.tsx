import { cn } from '@energyiq/shared';
import type { DistributorTier } from '../mocks';

const TIER_STYLE: Record<DistributorTier, string> = {
  Bronze: 'bg-warning/20 text-warning',
  Silver: 'bg-foreground/15 text-foreground',
  Gold:   'bg-brand/20 text-brand',
};

export function DistributorTierBadge({ value }: { value: DistributorTier }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] px-3 py-1 text-xs font-semibold',
        TIER_STYLE[value],
      )}
    >
      {value}
    </span>
  );
}
