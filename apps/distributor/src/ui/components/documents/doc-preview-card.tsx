import { Download, Eye } from 'lucide-react';
import type { DomainDocumentDetail } from '@energyiq/api/generated/schemas';

interface Props {
  document: DomainDocumentDetail;
}

export function DocumentPreviewCard({ document }: Props) {
  return (
    <div className="rounded-3xl border border-[#252525] bg-[#1A1A1A] p-8">
      <div className="mx-auto flex h-55 max-w-87.5 flex-col items-center justify-center rounded-2xl border border-[#333] bg-[#111]">
        <div className="mb-4 h-12 w-12 rounded-xl bg-[#F4B400]" />

        <p className="text-sm text-white">{document.file_name}</p>

        <p className="mt-2 text-xs text-gray-500">Uploaded {document.submitted_at_label ?? ''}</p>

        <div className="mt-6 flex gap-3">
          <a
            href={document.file_url}
            target="_blank"
            rel="noreferrer"
            download
            className="flex items-center gap-2 rounded-full border border-[#F4B400] px-5 py-2 text-xs text-[#F4B400]"
          >
            <Download size={14} />
            Download
          </a>

          <a
            href={document.file_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#F4B400] px-5 py-2 text-xs text-black"
          >
            <Eye size={14} />
            Preview
          </a>
        </div>
      </div>
    </div>
  );
}
