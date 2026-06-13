import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuditLogsExportProgressProps {
  /** Total record count being exported. */
  recordTotal: number;
  onCancel: () => void;
  onComplete: () => void;
}

const NUMBER = new Intl.NumberFormat('en-NG');
const TICK_PERCENT = 4;
const TICK_MS = 120;

/**
 * Floating panel that reports export progress over the audit log. The percentage is
 * simulated client-side for now; `onComplete` fires once it reaches 100%.
 * TODO(orval): drive the percentage from the real export job.
 */
export function AuditLogsExportProgress({
  recordTotal,
  onCancel,
  onComplete,
}: AuditLogsExportProgressProps) {
  const [percent, setPercent] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (percent >= 100) {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        onComplete();
      }
      return;
    }
    const timeoutId = window.setTimeout(
      () => setPercent((current) => Math.min(100, current + TICK_PERCENT)),
      TICK_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [percent, onComplete]);

  const processed = Math.round((recordTotal * percent) / 100);

  return (
    <div className="fixed left-1/2 top-32 z-50 w-[560px] max-w-[92vw] -translate-x-1/2 rounded-3xl border border-[#FFFFFF1F] bg-[#1A1A1A] p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#FAFAFA]">Audit log</span>
          <span className="text-xs text-[#9E9E9E]">Generating export...</span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="tap-effect h-8 rounded-full border border-[#616161B2] px-4 text-xs font-medium text-[#FAFAFA]"
        >
          Cancel
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#FBC02D]" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#FAFAFA]">Building your export file</span>
          <span className="text-xs text-[#9E9E9E]">
            Processing {NUMBER.format(recordTotal)} records · This may take a moment
          </span>
        </div>
      </div>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#FFFFFF1A]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#FBC02D] transition-all duration-100"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-[#9E9E9E]">
        <span>
          {NUMBER.format(processed)} / {NUMBER.format(recordTotal)} records processed
        </span>
        <span>{percent}%</span>
      </div>
    </div>
  );
}
