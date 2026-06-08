import { cn } from '@energyiq/shared';
import type { OrderStatus, PaymentStatus } from '../mocks';

type AnyStatus = OrderStatus | PaymentStatus;

const STATUS_STYLE: Record<AnyStatus, { bg: string; text: string; label: string }> = {
  // OrderStatus
  pending:   { bg: 'bg-warning/20', text: 'text-warning', label: 'Pending' },
  approved:  { bg: 'bg-success/20', text: 'text-success', label: 'Approved' },
  rejected:  { bg: 'bg-danger/20',  text: 'text-danger',  label: 'Rejected' },
  modified:  { bg: 'bg-brand/20',   text: 'text-brand',   label: 'Modified' },
  disputed:  { bg: 'bg-danger/20',  text: 'text-danger',  label: 'Disputed' },
  cancelled: { bg: 'bg-foreground/10', text: 'text-muted-foreground', label: 'Cancelled' },
  // PaymentStatus
  paid:      { bg: 'bg-success/20', text: 'text-success', label: 'Paid' },
  unpaid:    { bg: 'bg-foreground/10', text: 'text-muted-foreground', label: 'Unpaid' },
  failed:    { bg: 'bg-danger/20',  text: 'text-danger',  label: 'Failed' },
};

interface OrderStatusBadgeProps {
  value: AnyStatus;
  className?: string;
}

export function OrderStatusBadge({ value, className }: OrderStatusBadgeProps) {
  const s = STATUS_STYLE[value];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] px-3 py-1 text-xs font-semibold whitespace-nowrap',
        s.bg,
        s.text,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
