import { cn } from '@energyiq/shared';
import type { approval } from '@energyiq/domain';

const STATUS_STYLE: Record<approval.ApprovalStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-[#FB8C1C4D]', text: 'text-[#FB8C1C]', label: 'Pending Review' },
  approved: { bg: 'bg-[#388E3C4D]', text: 'text-[#388E3C]', label: 'Approved' },
  rejected: { bg: 'bg-danger/30', text: 'text-danger', label: 'Rejected' },
  cancelled: { bg: 'bg-[#6161614D]', text: 'text-[#9E9E9E]', label: 'Cancelled' },
  expired: { bg: 'bg-[#6161614D]', text: 'text-[#9E9E9E]', label: 'Expired' },
};

export function ProductAuthorizationStatusBadge({
  status,
  label,
  className,
}: {
  status: approval.ApprovalStatus | string | undefined;
  /** Prefer the server's own status_label when available. */
  label?: string;
  className?: string;
}) {
  const style = STATUS_STYLE[status as approval.ApprovalStatus] ?? STATUS_STYLE.pending;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[22px] px-[9px] py-[9px] text-xs font-medium whitespace-nowrap',
        style.bg,
        style.text,
        className,
      )}
    >
      {label ?? style.label}
    </span>
  );
}
