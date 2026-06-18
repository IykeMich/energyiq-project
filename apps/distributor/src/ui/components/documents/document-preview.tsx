import {
  ArrowLeft,
  Download,
  FileText,
  Search,
} from 'lucide-react';

interface Props {
  document: any;
  onBack: () => void;
}

export function DocumentPreview({
  document,
  onBack,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#F4B400]"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-white">
          {document.title}
        </h1>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Regulatory • Required document
          </span>

          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
            Approved
          </span>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* LEFT CARD */}
        <div className="rounded-[32px] bg-[#161616] p-6">
          <div className="flex h-[220px] flex-col items-center justify-center rounded-2xl border border-[#333] bg-[#1E1E1E]">
            <div className="mb-3 h-10 w-10 rounded-lg bg-[#F4B400]" />

            <p className="text-sm text-white">
              {document.file}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              2.4 MB • Uploaded{' '}
              {document.uploaded}
            </p>

            <div className="mt-5 flex gap-3">
              <button className="rounded-full border border-[#F4B400] px-4 py-2 text-xs text-[#F4B400]">
                Download
              </button>

              <button className="rounded-full bg-[#F4B400] px-4 py-2 text-xs text-black">
                Preview
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Document Type
              </span>

              <span className="text-white">
                {document.type}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Uploaded On
              </span>

              <span className="text-white">
                {document.uploaded}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Reviewed By
              </span>

              <span className="text-white">
                {document.reviewedBy}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Approved On
              </span>

              <span className="text-white">
                {document.approvedOn}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Valid Until
              </span>

              <span className="text-[#F4B400]">
                {document.validUntil}
              </span>
            </div>
          </div>
        </div>

        {/* PDF VIEWER */}
        <div className="rounded-[32px] bg-[#161616] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-lg bg-[#1E1E1E] px-3 py-2">
              <FileText
                size={14}
                className="text-[#F4B400]"
              />

              <span className="text-xs text-white">
                {document.file}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="rounded-lg bg-[#1E1E1E] p-2">
                <Search size={14} />
              </button>

              <button className="rounded-full border border-[#333] px-4 py-2 text-xs text-white">
                <Download
                  size={14}
                  className="mr-2 inline"
                />
                Download
              </button>
            </div>
          </div>

          {/* PDF PREVIEW AREA */}
          <div className="flex min-h-[650px] items-center justify-center rounded-[32px] border border-[#333] bg-[#111] p-10">
            {/* If image */}
            <img
              src="/images/license-preview.png"
              alt=""
              className="max-h-[550px] rounded-lg"
            />

            {/* If pdf use iframe instead */}
            {/*
            <iframe
              src={document.url}
              className="h-[650px] w-full rounded-2xl"
            />
            */}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Preview Only • Uploaded{' '}
            {document.uploaded}
          </p>
        </div>
      </div>
    </div>
  );
}