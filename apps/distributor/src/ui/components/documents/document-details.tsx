import { ArrowLeft } from 'lucide-react';
import { DocumentActivity } from './document-activity';
import { DocumentPreviewCard } from './doc-preview-card';
import { StatusBadge } from './document-status-badge';
// import { DocumentPreview } from './document-preview'

interface Props {
  document: any;
  onBack: () => void;
}

export function DocumentDetails({
  document,
  onBack,
}: Props) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#F4B400]"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div>
        <h1 className="text-xl font-semibold text-white">
          {document.title}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Regulatory • Required document
          </span>

          <StatusBadge
            status={document.status}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <DocumentPreviewCard
            document={document}
          />

          <div className="rounded-3xl border border-[#252525] bg-[#161616] p-6">
            <div className="grid gap-y-5 text-sm lg:grid-cols-2">
              <div>
                <p className="text-gray-500">
                  Document Type
                </p>

                <p className="mt-1 text-white">
                  {document.type}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Uploaded On
                </p>

                <p className="mt-1 text-white">
                  {document.uploaded}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Reviewed By
                </p>

                <p className="mt-1 text-white">
                  {document.reviewedBy ??
                    '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Approved On
                </p>

                <p className="mt-1 text-white">
                  {document.approvedOn ??
                    '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Valid Until
                </p>

                <p className="mt-1 text-[#F4B400]">
                  {document.validUntil ??
                    '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Replacement
                </p>

                <p className="mt-1 text-white">
                  {document.replacement ??
                    'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DocumentActivity
            activity={document.activity}
          />

          {document.status ===
            'expiring' && (
            <div className="rounded-3xl border border-[#2A2A2A] bg-[#121212] p-5">
              <p className="text-xs text-gray-500">
                Expiry Countdown
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#F4B400]">
                18
              </h2>

              <p className="text-xs text-gray-500">
                days remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}