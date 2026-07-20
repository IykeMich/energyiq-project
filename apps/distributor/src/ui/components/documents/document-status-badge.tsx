import type { DisplayDocumentStatus } from './document-mappers';

export function StatusBadge({
  status,
}: {
  status: DisplayDocumentStatus;
}) {
  const styles: Record<DisplayDocumentStatus, string> = {
    approved:
      'bg-[#1D3B26] text-[#56D17D]',
    rejected:
      'bg-[#4A1B1B] text-[#FF6666]',
    pending:
      'bg-[#4A3512] text-[#F5BF2A]',
    expiring:
      'bg-[#303030] text-[#B5B5B5]',
    expired:
      'bg-[#2A2A2A] text-[#8A8A8A]',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}