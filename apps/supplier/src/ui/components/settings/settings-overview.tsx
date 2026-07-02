import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SettingsTabs, type SettingsTab } from './settings-tabs';
import { SettingsCompanyProfile } from './settings-company-profile';
import { SettingsUserProfile } from './settings-user-profile';
import { SettingsNotifications } from './settings-notifications';
import { SettingsSecurity } from './settings-security';
import { SettingsEmptyProfile } from './settings-empty-profile';

export function SettingsOverview() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profileView, setProfileView] = useState<'company' | 'user'>('company');
  const [isProfileEmpty, setIsProfileEmpty] = useState(
    searchParams.get('state') === 'empty',
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#FFFFFFCC] mt-1">
          Manage your account and security preferences.
        </p>
      </header>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'profile' && (
        <>
          {isProfileEmpty ? (
            <SettingsEmptyProfile onFillProfile={() => setIsProfileEmpty(false)} />
          ) : profileView === 'company' ? (
            <SettingsCompanyProfile onSwitchToUser={() => setProfileView('user')} />
          ) : (
            <SettingsUserProfile onSwitchToCompany={() => setProfileView('company')} />
          )}
        </>
      )}

      {activeTab === 'notifications' && <SettingsNotifications />}

      {activeTab === 'security' && <SettingsSecurity />}
    </section>
  );
}
