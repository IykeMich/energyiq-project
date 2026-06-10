import { useState } from 'react';
import { Sheet, SheetContent } from '@energyiq/ui';
import { buildDistributorDetail, type Distributor } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsHeader } from './distributor-details-header';
import {
  DistributorDetailsTabs,
  type DistributorDetailTab,
  type DistributorDetailTabItem,
} from './distributor-details-tabs';
import { DistributorInviteDetailsTab } from './distributor-invite-details-tab';
import { DistributorOverviewTab } from './distributor-overview-tab';
import { DistributorOrdersTab } from './distributor-orders-tab';
import { DistributorComplaintsTab } from './distributor-complaints-tab';
import { DistributorTierHistoryTab } from './distributor-tier-history-tab';

const PENDING_TABS: DistributorDetailTabItem[] = [{ id: 'invite', label: 'Invite Details' }];

const ACTIVE_TABS: DistributorDetailTabItem[] = [
  { id: 'invite', label: 'Invite Details' },
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'complaints', label: 'Complaints' },
  { id: 'tier-history', label: 'Tier History' },
];

interface DistributorDetailsSheetProps {
  distributor: Distributor | null;
  onOpenChange: (open: boolean) => void;
}

/** Right slide-over showing a single distributor's full detail across tabs. */
export function DistributorDetailsSheet({ distributor, onOpenChange }: DistributorDetailsSheetProps) {
  return (
    <Sheet open={distributor !== null} onOpenChange={onOpenChange}>
      {/* Tall frame: a fixed header + tab nav over a scrolling body whose content
          cuts crisply behind solid top/bottom bands (never touching the edges). */}
      <SheetContent
        side="right"
        showClose={false}
        overlayClassName="bg-[#121212]/40"
        className="inset-y-3 mr-4 h-auto w-full gap-0 overflow-hidden rounded-[28px] border-l-0 bg-[#121212] p-0 sm:max-w-[600px]"
      >
        {distributor && (
          <DistributorDetailsBody
            key={distributor.id}
            distributor={distributor}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface DistributorDetailsBodyProps {
  distributor: Distributor;
  onClose: () => void;
}

/** Inner content, keyed by distributor id so tab/revoke state resets per selection. */
function DistributorDetailsBody({ distributor, onClose }: DistributorDetailsBodyProps) {
  // TODO(orval): each tab below fetches its own query (enabled when active) so the
  // sheet never loads every nested resource at once.
  const detail = buildDistributorDetail(distributor);
  const isActive = distributor.status === 'active';
  const [activeTab, setActiveTab] = useState<DistributorDetailTab>('invite');

  return (
    <>
      <div className="flex shrink-0 flex-col gap-6 px-8 pt-8 pb-4">
        <DistributorDetailsHeader
          distributor={distributor}
          detail={detail}
          isActive={isActive}
          onClose={onClose}
          onSuspend={() => undefined}
        />
        <DistributorDetailsTabs
          tabs={isActive ? ACTIVE_TABS : PENDING_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto overscroll-contain px-8 py-6">
          {activeTab === 'invite' && <DistributorInviteDetailsTab detail={detail} isActive={isActive} />}
          {activeTab === 'overview' && <DistributorOverviewTab detail={detail} />}
          {activeTab === 'orders' && <DistributorOrdersTab detail={detail} />}
          {activeTab === 'complaints' && <DistributorComplaintsTab detail={detail} />}
          {activeTab === 'tier-history' && <DistributorTierHistoryTab detail={detail} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]" />
      </div>
    </>
  );
}
