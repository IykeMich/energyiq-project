import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { TankSearchBar } from './tank-search-bar';
import { TankStatsTracker } from './tank-stats-tracker';
import { TankWarningBanner } from './tank-warning-banner';
import { TankLevelList } from './tank-level-list';
import { RecentDipForm } from './recent-dip-form';
import { SalesActionButton } from '../sales/sales-action-button';
import { VarianceAlertModal } from './variance-alert-modal';
import { AddTankModal} from './add-tank-modal';

export function TankMonitoringOverview() {
  const [varianceOpen, setVarianceOpen] =
    useState(false);
    const [addTankOpen, setAddTankOpen] =
  useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <section className="flex flex-col gap-6">
      <PageHeaderContent>
        <TankSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      </PageHeaderContent>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          Tank Monitoring
        </h1>

        <SalesActionButton
 label="Add Tank"
  icon={Plus}
  onClick={() =>
    setAddTankOpen(true)
  }
/>
      </div>

      <TankWarningBanner />

      <TankStatsTracker />

      <TankLevelList
        onVarianceClick={() =>
          setVarianceOpen(true)
        }
      />

      <RecentDipForm />

      <VarianceAlertModal
        open={varianceOpen}
        onOpenChange={setVarianceOpen}
      />
      <AddTankModal
  open={addTankOpen}
  onOpenChange={setAddTankOpen}
/>
    </section>
    
  );
}