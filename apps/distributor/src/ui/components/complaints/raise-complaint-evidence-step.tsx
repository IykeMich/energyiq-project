import { UploadCloud } from 'lucide-react';
import { ComplaintUploadProgressRow } from './complaint-upload-progress-row';
import type { RaiseComplaintDraft } from './complaints-mocks';

interface RaiseComplaintEvidenceStepProps {
  draft: RaiseComplaintDraft;
  onChange: (patch: Partial<RaiseComplaintDraft>) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value < 10 && index > 0 ? 1 : 0)} ${units[index]}`;
}

/** Step 3 — upload supporting evidence via a native file picker. */
export function RaiseComplaintEvidenceStep({ draft, onChange }: RaiseComplaintEvidenceStepProps) {
  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles = Array.from(selected).map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
    }));

    onChange({ files: [...draft.files, ...newFiles] });

    // Reset the input so the same file can be selected again.
    event.target.value = '';
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

      <div className="relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#FFFFFF33] bg-[#FFFFFF0D] px-6 py-10">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/jpg,application/pdf,video/mp4"
          onChange={handleFilesSelected}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="pointer-events-none flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-7 w-7 text-[#FBC02D]" aria-hidden="true" />
          <p className="text-sm">
            <span className="font-semibold text-[#FBC02D]">Click to upload</span>
            <span className="text-[#FFFFFFCC]"> or drag and drop</span>
          </p>
          <p className="text-xs text-[#FFFFFFCC]">JPG, PNG, PDF, MP4 - Max 25MB per file</p>
        </div>
      </div>

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
