/** Color per distributor tier label — full hue for the text, same hue tinted for the pill. */
const TIER_COLOR: Record<string, string> = {
  gold: '#D4A017',
  silver: '#9CA3AF',
  bronze: '#B45309',
};
const DEFAULT_TIER_COLOR = '#9CA3AF';

/** Small pill badge for the distributor tier column — `tier` is the API's free-text `tier_label`. */
export function KycDocumentsTierBadge({ tier }: { tier?: string }) {
  if (!tier) return null;
  const color = TIER_COLOR[tier.toLowerCase()] ?? DEFAULT_TIER_COLOR;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-3 py-0.5 text-[11px] font-medium"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {tier}
    </span>
  );
}
