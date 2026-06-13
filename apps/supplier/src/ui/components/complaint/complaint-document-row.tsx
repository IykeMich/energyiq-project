import { FileText } from 'lucide-react';
import type { ComplaintDocument } from '@/ui/pages/complaint/mocks';

interface ComplaintDocumentRowProps {
  document: ComplaintDocument;
  onDownload: (document: ComplaintDocument) => void;
}

/** A single attachment row: file-icon tile, name + meta, and a gold outlined Download button. */
export function ComplaintDocumentRow({ document, onDownload }: ComplaintDocumentRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#FFFFFF0A] p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBC02D]">
        <FileText className="h-5 w-5 text-[#121212]" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-sm font-medium text-[#FAFAFA]">{document.name}</p>
        <p className="truncate text-xs text-[#FFFFFFCC]">
          {document.kind} .{document.size}. From {document.from} .{document.date}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDownload(document)}
        className="tap-effect shrink-0 rounded-lg border border-[#FBC02D] px-4 py-1.5 text-xs font-medium text-[#FBC02D]"
      >
        Download
      </button>
    </div>
  );
}
