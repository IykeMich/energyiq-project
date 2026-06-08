import { cn } from '@energyiq/shared';
import type { Tank, TankStatus } from '../mocks';

const STATUS_THEME: Record<
  TankStatus,
  { badgeBg: string; badgeText: string; barTrack: string; barFill: string; label: string }
> = {
  adequate: {
    badgeBg: 'bg-success/20',
    badgeText: 'text-success',
    barTrack: 'bg-success/40',
    barFill: 'bg-success',
    label: 'Adequate',
  },
  warning: {
    badgeBg: 'bg-warning/20',
    badgeText: 'text-warning',
    barTrack: 'bg-warning/20',
    barFill: 'bg-warning',
    label: 'Warning',
  },
  critical: {
    badgeBg: 'bg-danger/20',
    badgeText: 'text-danger',
    barTrack: 'bg-danger/20',
    barFill: 'bg-danger',
    label: 'Critical',
  },
};

interface TankCardProps {
  tank: Tank;
  onOrderRefill?: (tankId: string) => void;
}

export function TankCard({ tank, onOrderRefill }: TankCardProps) {
  const fillPercent = Math.round((tank.stockL / tank.capacityL) * 100);
  const theme = STATUS_THEME[tank.status];
  const orderRefillUrgent = tank.status === 'critical' || tank.status === 'warning';

  return (
    <div className="bg-surface-card border border-border-strong rounded-[28px] px-7 py-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-foreground">{tank.name}</h3>
          <p className="text-xs text-foreground font-normal">
            {tank.location}. {tank.product} · {tank.capacityL.toLocaleString()} L cap.
          </p>
        </div>
        <span
          className={cn(
            'rounded-[14px] px-2.5 py-1 text-xs font-normal whitespace-nowrap',
            theme.badgeBg,
            theme.badgeText,
          )}
        >
          {fillPercent}%: <span className="font-semibold">{theme.label}</span>
        </span>
      </div>

      <div className={cn('h-[7px] w-full rounded-full', theme.barTrack)}>
        <div
          className={cn('h-full rounded-full', theme.barFill)}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <div className="flex items-center gap-x-8 gap-y-2 flex-wrap text-xs text-foreground">
          <p>
            Stock: <span className="font-semibold">{tank.stockL.toLocaleString()} L</span>
          </p>
          <p>
            Coverage: <span className="font-semibold">{tank.coverageDays} days</span>
          </p>
          <p>
            Reorder: <span className="font-semibold">{tank.reorderDays} days</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOrderRefill?.(tank.id)}
        className={cn(
          'self-start rounded-[2px] px-2.5 py-1 text-xs font-medium text-brand-foreground',
          orderRefillUrgent ? 'bg-brand' : 'bg-brand/20',
        )}
      >
        Order Refill
      </button>
    </div>
  );
}
