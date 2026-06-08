import { cn } from '@energyiq/shared';
import type { DistributorStatus } from '../mocks';

const STATUS_STYLE: Record<DistributorStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: 'bg-success/20', text: 'text-success', label: 'Active' },
  pending:  { bg: 'bg-warning/20', text: 'text-warning', label: 'Pending' },
  cold:     { bg: 'bg-brand/20',   text: 'text-brand',   label: 'Cold' },
  inactive: { bg: 'bg-danger/20',  text: 'text-danger',  label: 'Inactive' },
};

export function DistributorStatusBadge({ value }: { value: DistributorStatus }) {
  const s = STATUS_STYLE[value];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] px-3 py-1 text-xs font-semibold',
        s.bg,
        s.text,
      )}
    >
      {s.label}
    </span>
  );
}
