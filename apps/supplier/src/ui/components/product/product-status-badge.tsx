import { cn } from '@energyiq/shared';

type BadgeStatus = 'active' | 'inactive' | 'draft' | 'pending_review' | 'paused' | 'retired';

const STATUS_STYLE: Record<BadgeStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-success/20', text: 'text-success', label: 'Active' },
  inactive: { bg: 'bg-danger/20', text: 'text-danger', label: 'Inactive' },
  draft: { bg: 'bg-foreground/10', text: 'text-muted-foreground', label: 'Draft' },
  pending_review: { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'Pending Review' },
  paused: { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'Paused' },
  retired: { bg: 'bg-danger/20', text: 'text-danger', label: 'Retired' },
};

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
