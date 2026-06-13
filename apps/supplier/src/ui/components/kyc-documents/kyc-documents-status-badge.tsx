import type { DocumentStatus } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/** Color per document status — full hue for the text, same hue tinted for the pill. */
const STATUS_COLOR: Record<DocumentStatus, string> = {
  Verified: '#2E7D32',
  'In Review': '#9CA3AF',
  Incomplete: '#D30A0A',
  'Expiring soon': '#D4A017',
};

/** Pill badge for the document status column. */
export function KycDocumentsStatusBadge({ status }: { status: DocumentStatus }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {status}
    </span>
  );
}
