import { Download, Eye } from 'lucide-react';

interface Props {
  document: any;
}

export function DocumentPreviewCard({
  document,
}: Props) {
  return (
    <div className="rounded-3xl border border-[#252525] bg-[#1A1A1A] p-8">
      <div className="mx-auto flex h-[220px] max-w-[350px] flex-col items-center justify-center rounded-2xl border border-[#333] bg-[#111]">
        <div className="mb-4 h-12 w-12 rounded-xl bg-[#F4B400]" />

        <p className="text-sm text-white">
          {document.file}
        </p>

        <p className="mt-2 text-xs text-gray-500">
          2.4 MB • Uploaded {document.uploaded}
        </p>

        <div className="mt-6 flex gap-3">
          <button className="flex items-center gap-2 rounded-full border border-[#F4B400] px-5 py-2 text-xs text-[#F4B400]">
            <Download size={14} />
            Download
          </button>

          <button className="flex items-center gap-2 rounded-full bg-[#F4B400] px-5 py-2 text-xs text-black">
            <Eye size={14} />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}