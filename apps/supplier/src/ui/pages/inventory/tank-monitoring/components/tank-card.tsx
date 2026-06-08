import { cn } from '@energyiq/shared';
import type { Tank, TankStatus } from '../mocks';

const STATUS_THEME: Record<
  TankStatus,
  {
    badgeBg: string;
    badgeText: string;
    barTrack: string;
    barFill: string;
    label: string;
  }
> = {
  adequate: {
    badgeBg: 'bg-[#388E3C33]',
    badgeText: 'text-[#388E3C]',
    barTrack: 'bg-[#388E3C66]',
    barFill: 'bg-[#388E3C]',
    label: 'Adequate',
  },
  warning: {
    badgeBg: 'bg-[#FB8C1C33]',
    badgeText: 'text-[#FB8C1C]',
    barTrack: 'bg-[#FB8C1C33]',
    barFill: 'bg-[#FB8C1C]',
    label: 'Warning',
  },
  critical: {
    badgeBg: 'bg-[#D30A0A33]',
    badgeText: 'text-[#D30A0A]',
    barTrack: 'bg-[#D30A0A33]',
    barFill: 'bg-[#D30A0A]',
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
    <div className="bg-[#6161611A] border border-[#9E9E9E] rounded-[28px] px-7 py-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-[#FAFAFA]">{tank.name}</h3>
          <p className="text-xs text-[#FAFAFA] font-normal">
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
        <div className="flex items-center gap-x-8 gap-y-2 flex-wrap text-xs text-[#FAFAFA]">
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
          'self-start rounded-[2px] px-2.5 py-1 text-xs font-medium text-[#121212]',
          orderRefillUrgent ? 'bg-[#FBC02D]' : 'bg-[#FBC02D33]',
        )}
      >
        Order Refill
      </button>
    </div>
  );
}
