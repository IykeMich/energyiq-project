import { ArrowLeft } from 'lucide-react';
import { useGetV1DocumentReadId } from '@energyiq/api/generated/documents/documents';
import { DocumentActivity } from './document-activity';
import { DocumentPreviewCard } from './doc-preview-card';
import { StatusBadge } from './document-status-badge';
import { buildDetailActivity } from './document-mappers';

interface Props {
  documentId: string;
  onBack: () => void;
}

export function DocumentDetails({ documentId, onBack }: Props) {
  const { data, isLoading } = useGetV1DocumentReadId(documentId);
  const document = data?.data.data;

  const BackButton = (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-[#F4B400]"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );

  if (isLoading || !document) {
    return (
      <div className="space-y-6">
        {BackButton}
        <p className="text-sm text-gray-400">
          {isLoading ? 'Loading document…' : 'Document not found.'}
        </p>
      </div>
    );
  }

  const isExpiring = document.status === 'expiring' || document.status === 'expiring_soon';

  return (
    <div className="space-y-6">
      {BackButton}

      <div>
        <h1 className="text-xl font-semibold text-white">
          {document.preview_title ?? document.document_type_label}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm text-gray-500">Regulatory • Required document</span>

          <StatusBadge status={document.status ?? ''} label={document.status_label} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <DocumentPreviewCard document={document} />

          <div className="rounded-3xl border border-[#252525] bg-[#161616] p-6">
            <div className="grid gap-y-5 text-sm lg:grid-cols-2">
              <div>
                <p className="text-gray-500">Document Type</p>

                <p className="mt-1 text-white">{document.document_type_label ?? '-'}</p>
              </div>

              <div>
                <p className="text-gray-500">Uploaded On</p>

                <p className="mt-1 text-white">{document.submitted_at_label ?? '-'}</p>
              </div>

              <div>
                <p className="text-gray-500">Distributor</p>

                <p className="mt-1 text-white">{document.distributor_name ?? '-'}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>

                <p className="mt-1 text-white">{document.status_note ?? document.status_label ?? '-'}</p>
              </div>

              <div>
                <p className="text-gray-500">Valid Until</p>

                <p className="mt-1 text-[#F4B400]">{document.expires_at_label ?? '-'}</p>
              </div>

              <div>
                <p className="text-gray-500">Replacement</p>

                <p className="mt-1 text-white">None</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DocumentActivity activity={buildDetailActivity(document)} />

          {isExpiring && (
            <div className="rounded-3xl border border-[#2A2A2A] bg-[#121212] p-5">
              <p className="text-xs text-gray-500">Expiry</p>

              <h2 className="mt-2 text-2xl font-bold text-[#F4B400]">
                {document.expires_at_label ?? '-'}
              </h2>

              <p className="text-xs text-gray-500">Valid until this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
