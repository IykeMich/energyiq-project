import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';

interface ExportProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  onComplete: () => void;
}

export function ExportProgressModal({
  open,
  onOpenChange,
  reportName,
  onComplete,
}: ExportProgressModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          clearInterval(interval);
          return 100;
        }
        return previous + 4;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm" showClose={false}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-[#FAFAFA]">{reportName}</h2>
            <span className="text-xs text-[#9E9E9E]">Generating export...</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="tap-effect rounded-full border border-[#616161B2] px-3 py-1 text-xs font-medium text-[#FAFAFA]"
          >
            Cancel
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FBC02D] border-t-transparent" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#FAFAFA]">Building your export file</span>
              <span className="text-xs text-[#9E9E9E]">Processing reports - This may take a moment</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#6161611A]">
            <div
              className="h-full rounded-full bg-[#FBC02D] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-[#9E9E9E]">{progress}%</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
