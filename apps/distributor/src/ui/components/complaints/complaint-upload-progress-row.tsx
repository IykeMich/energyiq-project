import { FileText, X } from 'lucide-react';

interface ComplaintUploadProgressRowProps {
  name: string;
  size: string;
  /** Upload completion 0–100; the bar and percent label are presentational for now. */
  progress: number;
  onRemove: () => void;
}

/** Uploaded-file row with a gold progress bar, used by the evidence step. */
export function ComplaintUploadProgressRow({
  name,
  size,
  progress,
  onRemove,
}: ComplaintUploadProgressRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#FFFFFF1A] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBC02D1A] text-[#FBC02D]">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-medium text-[#FAFAFA]">{name}</span>
        <span className="text-xs text-[#FFFFFFCC]">{size}</span>
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#FFFFFF1A]">
            <div className="h-full rounded-full bg-[#FBC02D]" style={{ width: `${progress}%` }} />
          </div>
          <span className="shrink-0 text-xs text-[#FFFFFFCC]">{progress}%</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="tap-effect flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#FFFFFFCC]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
