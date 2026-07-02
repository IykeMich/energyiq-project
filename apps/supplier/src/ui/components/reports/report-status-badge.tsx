import { cn } from '@energyiq/shared';

type ReportStatus =
  | 'verified'
  | 'pending'
  | 'expired'
  | 'expiring-soon'
  | 'under-review'
  | 'needs-review'
  | 'low-stock'
  | 'critical'
  | 'active'
  | 'suspended'
  | 'gold'
  | 'silver'
  | 'bronze';

interface ReportStatusBadgeProps {
  status: ReportStatus | string;
  className?: string;
  children?: React.ReactNode;
}

const STATUS_STYLES: Record<string, string> = {
  verified: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  expired: 'bg-red-500/15 text-red-500 border-red-500/30',
  'expiring-soon': 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  'under-review': 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  'needs-review': 'bg-red-500/15 text-red-500 border-red-500/30',
  'low-stock': 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  critical: 'bg-red-500/15 text-red-500 border-red-500/30',
  active: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  suspended: 'bg-red-500/15 text-red-500 border-red-500/30',
  gold: 'bg-[#FBC02D]/15 text-[#FBC02D] border-[#FBC02D]/30',
  silver: 'bg-gray-400/15 text-gray-300 border-gray-400/30',
  bronze: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

export function ReportStatusBadge({ status, className, children }: ReportStatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  const style = STATUS_STYLES[normalized] ?? STATUS_STYLES.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        style,
        className,
      )}
    >
      {children ?? status}
    </span>
  );
}
