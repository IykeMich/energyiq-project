import { UploadCloud } from 'lucide-react';
import { ComplaintUploadProgressRow } from './complaint-upload-progress-row';
import type { RaiseComplaintDraft } from './complaints-mocks';

interface RaiseComplaintEvidenceStepProps {
  draft: RaiseComplaintDraft;
  onChange: (patch: Partial<RaiseComplaintDraft>) => void;
}

/** Step 3 — upload supporting evidence. Uploads are presentational until the API lands. */
export function RaiseComplaintEvidenceStep({ draft, onChange }: RaiseComplaintEvidenceStepProps) {
  const handleAddFile = () => {
    // TODO(orval): replace the mock append with a real upload to the evidence endpoint.
    const next = draft.files.length + 1;
    onChange({ files: [...draft.files, { name: `evidence_${next}.jpg`, size: '1.0MB' }] });
  };

  const handleRemoveFile = (name: string) => {
    onChange({ files: draft.files.filter((file) => file.name !== name) });
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-[#FFFFFFCC]">
        Upload pictures, videos, waybills, or any supporting documents. Strong evidence accelerates
        resolution.
      </p>

      <button
        type="button"
        onClick={handleAddFile}
        className="tap-effect flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#FFFFFF33] bg-[#FFFFFF0D] px-6 py-10"
      >
        <UploadCloud className="h-7 w-7 text-[#FBC02D]" aria-hidden="true" />
        <p className="text-sm">
          <span className="font-semibold text-[#FBC02D]">Click to upload</span>
          <span className="text-[#FFFFFFCC]"> or drag and drop</span>
        </p>
        <p className="text-xs text-[#FFFFFFCC]">JPG, PNG, PDF, MP4 - Max 25MB per file</p>
      </button>

      {draft.files.length > 0 && (
        <div className="flex flex-col gap-3">
          {draft.files.map((file) => (
            <ComplaintUploadProgressRow
              key={file.name}
              name={file.name}
              size={file.size}
              progress={100}
              onRemove={() => handleRemoveFile(file.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
