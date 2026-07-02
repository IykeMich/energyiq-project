import { cn } from '@energyiq/shared';

export type SettingsTab = 'profile' | 'notifications' | 'security';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const TABS: { value: SettingsTab; label: string }[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'security', label: 'Security' },
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-[#FFFFFF1A] rounded-xl">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'px-5 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === tab.value
              ? 'bg-[#FBC02D] text-[#121212]'
              : 'text-white hover:text-[#FBC02D]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
