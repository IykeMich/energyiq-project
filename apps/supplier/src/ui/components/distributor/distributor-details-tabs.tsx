import { cn } from '@energyiq/shared';

export type DistributorDetailTab = 'invite' | 'overview' | 'orders' | 'complaints' | 'tier-history';

export interface DistributorDetailTabItem {
  id: DistributorDetailTab;
  label: string;
}

interface DistributorDetailsTabsProps {
  tabs: DistributorDetailTabItem[];
  activeTab: DistributorDetailTab;
  onChange: (tab: DistributorDetailTab) => void;
}

/** Underline tab nav for the distributor details sheet (gold active state). */
export function DistributorDetailsTabs({ tabs, activeTab, onChange }: DistributorDetailsTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-[#616161B2]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="tap-effect relative pb-3"
          >
            <span
              className={cn(
                'text-sm transition-colors',
                isActive ? 'text-[#FBC02D]' : 'text-[#FAFAFA]',
              )}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-[#FBC02D]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
