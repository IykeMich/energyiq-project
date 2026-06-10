import { cn } from '@energyiq/shared';
import { ORDER_STATUS_TABS } from './orders-mocks';

interface OrdersStatusTabsProps {
  activeLabel: string;
  onChange: (label: string) => void;
}

/** Horizontal status summary tabs (All, Pending, Approved, …) with count pills. */
export function OrdersStatusTabs({ activeLabel, onChange }: OrdersStatusTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-[#616161B2] pb-3">
      {ORDER_STATUS_TABS.map((tab) => {
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
            <span className="flex h-[14px] min-w-[14px] items-center justify-center rounded bg-[#616161B2] px-1 text-[8px] font-semibold text-white">
              {tab.count}
            </span>
            {isActive && (
              <span className="absolute -bottom-[13px] left-0 h-[3px] w-9 rounded-full bg-[#FBC02D]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
