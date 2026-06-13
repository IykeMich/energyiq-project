import type { DistributorTier } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/** Color per distributor tier — full hue for the text, same hue tinted for the pill. */
const TIER_COLOR: Record<DistributorTier, string> = {
  Gold: '#D4A017',
  Silver: '#9CA3AF',
  Bronze: '#B45309',
};

/** Small pill badge for the distributor tier column (Gold / Silver / Bronze). */
export function KycDocumentsTierBadge({ tier }: { tier: DistributorTier }) {
  const color = TIER_COLOR[tier];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-3 py-0.5 text-[11px] font-medium"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {tier}
    </span>
  );
}
