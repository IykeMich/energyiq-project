import type { DisplayDocumentStatus } from './document-mappers';

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-[#1D3B26] text-[#56D17D]',
  verified: 'bg-[#1D3B26] text-[#56D17D]',
  rejected: 'bg-[#4A1B1B] text-[#FF6666]',
  pending: 'bg-[#4A3512] text-[#F5BF2A]',
  in_review: 'bg-[#4A3512] text-[#F5BF2A]',
  expiring: 'bg-[#303030] text-[#B5B5B5]',
  expiring_soon: 'bg-[#303030] text-[#B5B5B5]',
  expired: 'bg-[#2A2A2A] text-[#8A8A8A]',
  incomplete: 'bg-[#2A2A2A] text-[#8A8A8A]',
};
const DEFAULT_STATUS_STYLE = 'bg-[#2A2A2A] text-[#8A8A8A]';

/**
 * `status` is the raw enum value (drives the color); `label` is the text shown —
 * defaults to `status` itself so `document-management-card.tsx`'s existing
 * `<StatusBadge status={status} />` call (no label) keeps its prior look.
 */
export function StatusBadge({
  status,
  label,
}: {
  status: DisplayDocumentStatus | string;
  label?: string;
}) {
  const className = STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;

  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${className}`}>
      {label ?? status}
    </span>
  );
}
