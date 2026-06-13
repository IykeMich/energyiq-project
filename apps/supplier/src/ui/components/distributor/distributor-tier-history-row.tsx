import type { DistributorTierHistoryItem } from '@/ui/pages/distributor/mocks';
import { DistributorTierBadge } from './distributor-tier-badge';

/** One entry in the Tier History timeline — tier badge, reason and date. */
export function DistributorTierHistoryRow({ item }: { item: DistributorTierHistoryItem }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#FFFFFF1A] bg-[#6161611A] px-4 py-3">
      <div className="flex items-center gap-3">
        <DistributorTierBadge value={item.tier} />
        <span className="text-sm text-[#FAFAFA]">{item.label}</span>
      </div>
      <span className="shrink-0 text-xs text-[#FFFFFFCC]">{item.date}</span>
    </div>
  );
}
