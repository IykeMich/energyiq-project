import { cn } from '@energyiq/shared';
import type { OrderStatus, OrderStatusCount } from '../mocks';

export type OrderStatusFilter = OrderStatus | 'all';

interface OrderStatusTabsProps {
  counts: OrderStatusCount[];
  value: OrderStatusFilter;
  onChange: (next: OrderStatusFilter) => void;
}

export function OrderStatusTabs({ counts, value, onChange }: OrderStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Order status filter"
      className="bg-surface-card rounded-[18px] p-1.5 flex flex-wrap gap-1 self-start"
    >
      {counts.map((c) => {
        const active = c.status === value;
        return (
          <button
            key={c.status}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.status)}
            className={cn(
              'h-9 px-4 rounded-[12px] text-xs font-semibold transition-colors flex items-center gap-2',
              active
                ? 'bg-brand text-brand-foreground'
                : 'text-foreground hover:bg-foreground/5',
            )}
          >
            <span>{c.label}</span>
            <span
              className={cn(
                'min-w-[20px] h-[18px] rounded-full px-1.5 text-[10px] flex items-center justify-center',
                active ? 'bg-brand-foreground/15 text-brand-foreground' : 'bg-foreground/10 text-foreground',
              )}
            >
              {c.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
