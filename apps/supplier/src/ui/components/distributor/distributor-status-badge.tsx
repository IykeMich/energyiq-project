import { cn } from '@energyiq/shared';
import type { DistributorStatus } from '@/ui/pages/distributor/mocks';

const STATUS_STYLE: Record<DistributorStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:   { bg: 'bg-success/20', text: 'text-success', dot: 'bg-success', label: 'Active' },
  pending:  { bg: 'bg-warning/20', text: 'text-warning', dot: 'bg-warning', label: 'Pending' },
  cold:     { bg: 'bg-brand/20',   text: 'text-brand',   dot: 'bg-brand',   label: 'Cold' },
  inactive: { bg: 'bg-danger/20',  text: 'text-danger',  dot: 'bg-danger',  label: 'Inactive' },
};

interface DistributorStatusBadgeProps {
  value: DistributorStatus;
  /** Show a leading status dot (used by the details-sheet header pill). */
  withDot?: boolean;
}

export function DistributorStatusBadge({ value, withDot = false }: DistributorStatusBadgeProps) {
  const style = STATUS_STYLE[value];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-[14px] px-3 py-1 text-xs font-semibold',
        style.bg,
        style.text,
      )}
    >
      {withDot && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', style.dot)} />}
      {style.label}
    </span>
  );
}
