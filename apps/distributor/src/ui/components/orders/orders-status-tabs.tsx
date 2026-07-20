import { cn } from '@energyiq/shared';
import type { order } from '@energyiq/domain';

interface OrdersStatusTabsProps {
  activeLabel: string;
  onChange: (label: string) => void;
  stats?: order.OrderStats;
}

interface OrderStatusTab {
  label: string;
  count: number;
}

function buildTabs(stats?: order.OrderStats): OrderStatusTab[] {
  return [
    { label: 'All', count: stats?.total ?? 0 },
    { label: 'Pending', count: (stats?.submitted ?? 0) + (stats?.draft ?? 0) },
    { label: 'Approved', count: stats?.approved ?? 0 },
    { label: 'Rejected', count: stats?.rejected ?? 0 },
    { label: 'Delivered', count: (stats?.received ?? 0) + (stats?.completed ?? 0) },
    { label: 'Dispatched', count: stats?.dispatched ?? 0 },
    { label: 'Cancelled', count: stats?.cancelled ?? 0 },
  ];
}

/** Horizontal status summary tabs (All, Pending, Approved, …) with count pills. */
export function OrdersStatusTabs({ activeLabel, onChange, stats }: OrdersStatusTabsProps) {
  const tabs = buildTabs(stats);

  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-[#616161B2] pb-3">
      {tabs.map((tab) => {
        const isActive = tab.label === activeLabel;
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onChange(tab.label)}
            className="tap-effect relative flex items-center gap-1.5 pb-2"
          >
            <span
              className={cn(
                'text-xs transition-colors',
                isActive ? 'text-[#FBC02D]' : 'text-[#FAFAFA]',
              )}
            >
              {tab.label}
            </span>
            <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded bg-[#616161B2] px-1 text-[8px] font-semibold text-white">
              {tab.count}
            </span>
            {isActive && (
              <span className="absolute -bottom-3.25 left-0 h-0.75 w-9 rounded-full bg-[#FBC02D]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
