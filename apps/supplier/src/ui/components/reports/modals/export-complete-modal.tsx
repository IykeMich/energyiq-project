import { FileText, Download, X } from 'lucide-react';
import { Modal } from '@energyiq/ui';

interface ExportCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  fileName: string;
  fileSize: string;
  dateRange: string;
}

export function ExportCompleteModal({
  open,
  onOpenChange,
  reportName,
  fileName,
  fileSize,
  dateRange,
}: ExportCompleteModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm" showClose={false}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-[#9E9E9E]">Export File</span>
            <h2 className="text-lg font-semibold text-[#FAFAFA]">{reportName}</h2>
            <span className="text-xs text-[#9E9E9E]">{dateRange} · Exported as pdf</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#616161B2] bg-[#FFFFFF1A] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBC02D]/15">
            <FileText className="h-5 w-5 text-[#FBC02D]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#FAFAFA]">{fileName}</span>
            <span className="text-xs text-[#9E9E9E]">{fileSize}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="tap-effect ml-auto flex h-10 items-center gap-2 rounded-full bg-[#FBC02D] px-5 text-sm font-semibold text-[#121212]"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </Modal>
  );
}
