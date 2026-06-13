import type { DocumentTypeSummary } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentTypeSummaryCardProps {
  summary: DocumentTypeSummary;
  onEdit: () => void;
}

/** A single document-type tile inside the dashboard "Document Types" panel. */
export function KycDocumentTypeSummaryCard({ summary, onEdit }: KycDocumentTypeSummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#FBC02D] bg-[#FBC02D0D] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{summary.name}</span>
            {summary.mandatory && (
              <span className="text-[11px] font-light text-gray-400">Mandatory</span>
            )}
          </div>
          <span className="text-xs text-gray-400">{summary.category}</span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="tap-effect rounded-full bg-[#FBC02D] px-4 py-1.5 text-xs font-semibold text-[#121212]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
