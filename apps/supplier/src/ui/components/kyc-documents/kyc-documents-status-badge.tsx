import type { DocumentStatus } from './kyc-documents-types';

/** Color per document status — full hue for the text, same hue tinted for the pill. */
const STATUS_COLOR: Record<DocumentStatus, string> = {
  verified: '#2E7D32',
  in_review: '#9CA3AF',
  incomplete: '#D30A0A',
  expiring_soon: '#D4A017',
};

/** Pill badge for the document status column. */
export function KycDocumentsStatusBadge({ status, label }: { status: DocumentStatus; label: string }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium"
      style={{ color, backgroundColor: `${color}26` }}
    >
      {label}
    </span>
  );
}
