import { FileText, X } from 'lucide-react';
import type { AuditExportFile } from './audit-logs-mocks';

const NUMBER = new Intl.NumberFormat('en-NG');

export type AuditExportStatus = 'ready' | 'downloaded';

interface AuditLogsExportFileCardProps {
  file: AuditExportFile;
  status: AuditExportStatus;
  onDownload: () => void;
  onDismiss: () => void;
}

/**
 * "Export File" card shown after an export completes: file summary + a Download action that
 * flips to a "Downloaded" badge (with a dismiss control) once the file has been saved.
 */
export function AuditLogsExportFileCard({
  file,
  status,
  onDownload,
  onDismiss,
}: AuditLogsExportFileCardProps) {
  const isDownloaded = status === 'downloaded';

  return (
    <section className="relative flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
      {isDownloaded && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss export"
          className="tap-effect absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}

      <span className="text-xs font-medium uppercase tracking-wider text-[#9E9E9E]">
        Export File
      </span>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[#FAFAFA]">Audit log</h3>
          <p className="text-sm text-[#9E9E9E]">
            {NUMBER.format(file.entries)} entries · {file.dateRange}
          </p>
        </div>
        {isDownloaded ? (
          <span
            className="inline-flex items-center justify-center rounded-2xl px-4 py-1.5 text-sm font-medium"
            style={{ color: '#2E7D32', backgroundColor: '#2E7D3226' }}
          >
            Downloaded
          </span>
        ) : (
          <button
            type="button"
            onClick={onDownload}
            className="tap-effect h-10 rounded-full border border-[#616161B2] px-6 text-sm font-medium text-[#FAFAFA]"
          >
            Download
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-[#FFFFFF0A] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBC02D]">
          <FileText className="h-5 w-5 text-[#121212]" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#FAFAFA]">{file.name}</span>
          <span className="text-xs text-[#9E9E9E]">
            {NUMBER.format(file.rows)} rows · {file.size} · Generated {file.generatedAt}
          </span>
        </div>
      </div>
    </section>
  );
}
