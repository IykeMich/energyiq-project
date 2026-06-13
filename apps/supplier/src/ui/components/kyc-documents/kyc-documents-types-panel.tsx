import { KycDocumentTypeSummaryCard } from './kyc-document-type-summary-card';
import { DOCUMENT_TYPE_SUMMARIES } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentsTypesPanelProps {
  /** Navigate to the full Document Types configuration page. */
  onSeeAll: () => void;
  /** Open a document type for editing (stubbed until the endpoint lands). */
  onEditType: (typeName: string) => void;
}

/** Gold-bordered "Document Types" panel with a "See all" link and 3 type tiles. */
export function KycDocumentsTypesPanel({ onSeeAll, onEditType }: KycDocumentsTypesPanelProps) {
  return (
    <div className="rounded-[18px] border border-[#FBC02D80] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Document Types</h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="tap-effect text-sm font-medium text-[#FBC02D] hover:underline"
        >
          See all
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {DOCUMENT_TYPE_SUMMARIES.map((summary) => (
          <KycDocumentTypeSummaryCard
            key={summary.name}
            summary={summary}
            onEdit={() => onEditType(summary.name)}
          />
        ))}
      </div>
    </div>
  );
}
