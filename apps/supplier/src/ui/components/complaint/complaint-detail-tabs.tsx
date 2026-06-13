import { cn } from '@energyiq/shared';

export type ComplaintTab = 'threads' | 'timeline' | 'documents';

const TABS: { id: ComplaintTab; label: string }[] = [
  { id: 'threads', label: 'Threads' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'documents', label: 'Documents' },
];

interface ComplaintDetailTabsProps {
  activeTab: ComplaintTab;
  onChange: (tab: ComplaintTab) => void;
}

/** Threads / Timeline / Documents switcher with a gold active underline. */
export function ComplaintDetailTabs({ activeTab, onChange }: ComplaintDetailTabsProps) {
  return (
    <div className="flex items-center gap-8 pb-3">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="tap-effect relative pb-2"
          >
            <span
              className={cn('text-sm transition-colors', isActive ? 'text-[#FBC02D]' : 'text-[#FAFAFA]')}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-[13px] left-0 h-[3px] w-full rounded-full bg-[#FBC02D]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
