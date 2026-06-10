import { cn } from '@energyiq/shared';

type ApplicationPillTone = 'warning' | 'success' | 'danger';

const TONE_STYLE: Record<ApplicationPillTone, string> = {
  warning: 'border-warning text-warning',
  success: 'border-success text-success',
  danger: 'border-danger text-danger',
};

interface DistributorApplicationPillProps {
  label: string;
  tone: ApplicationPillTone;
}

export function DistributorApplicationPill({ label, tone }: DistributorApplicationPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border bg-transparent px-3 py-1 text-xs font-medium',
        TONE_STYLE[tone],
      )}
    >
      {label}
    </span>
  );
}
