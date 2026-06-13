import { cn } from '@energyiq/shared';
import { stockLevelTone } from '@/ui/pages/inventory/mocks';

const TONE_BAR: Record<ReturnType<typeof stockLevelTone>, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

interface WarehouseStockLevelCellProps {
  percent: number;
}

/** "{percent}% Full" label above a thin colour-coded fill bar. */
export function WarehouseStockLevelCell({ percent }: WarehouseStockLevelCellProps) {
  const tone = stockLevelTone(percent);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-foreground">{percent}% Full</span>
      <div className="h-1.5 w-full rounded-full bg-foreground/10">
        <div
          className={cn('h-full rounded-full', TONE_BAR[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
