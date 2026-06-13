import type { DistributorDetail } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsKycKpis } from './distributor-details-kyc-kpis';
import { DistributorTierHistoryRow } from './distributor-tier-history-row';

/** Tier History tab — compliance KPIs above the tier promotion timeline. */
export function DistributorTierHistoryTab({ detail }: { detail: DistributorDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <DistributorDetailsKycKpis kyc={detail.kyc} />
      <div className="flex flex-col gap-3">
        {detail.tierHistory.map((item) => (
          <DistributorTierHistoryRow key={`${item.tier}-${item.date}`} item={item} />
        ))}
      </div>
    </div>
  );
}
