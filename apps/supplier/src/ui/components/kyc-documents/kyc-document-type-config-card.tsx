import type { DocumentTypeConfig } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentTypeConfigCardProps {
  config: DocumentTypeConfig;
  onEdit: () => void;
}

/** A bullet dot separating meta segments in the card's detail line. */
function MetaDot() {
  return <span className="h-1 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />;
}

/** One configurable document-type row on the "Document Types" list page. */
export function KycDocumentTypeConfigCard({ config, onEdit }: KycDocumentTypeConfigCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FFFFFF0F] px-6 py-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-white">{config.name}</span>
          {config.required ? (
            <span className="rounded-full bg-[#FBC02D26] px-2.5 py-0.5 text-[10px] font-medium text-[#FBC02D]">
              Required
            </span>
          ) : (
            <span className="rounded-full bg-[#9CA3AF26] px-2.5 py-0.5 text-[10px] font-medium text-gray-300">
              Optional
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>{config.allowedFileTypes}</span>
          <MetaDot />
          <span>{config.renewal}</span>
          <MetaDot />
          <span>{config.reminder}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="tap-effect shrink-0 rounded-full border border-[#FBC02D] px-6 py-1.5 text-xs font-medium text-[#FBC02D]"
      >
        Edit
      </button>
    </div>
  );
}
