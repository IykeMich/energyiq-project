import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { KycDocumentTypeConfigCard } from './kyc-document-type-config-card';
import { DOCUMENT_TYPE_CONFIGS } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/**
 * "Document Types" configuration page: lists every document distributors must
 * submit, with an entry point to add a new type. Edit is stubbed until the
 * document-type mutation endpoint lands.
 */
export function KycDocumentTypesOverview() {
  const navigate = useNavigate();
  const { slug = 'demo' } = useParams<{ slug: string }>();

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/kyc-documents`)}
            aria-label="Back to KYC documents"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-white">Document Types</h1>
            <p className="text-sm text-gray-400">
              Configure which documents distributors must submit.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/${slug}/kyc-documents/types/new`)}
          className="tap-effect inline-flex items-center gap-1.5 rounded-full bg-[#FBC02D] px-5 py-2.5 text-sm font-semibold text-[#121212]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add new type
        </button>
      </header>

      <div className="flex flex-col gap-4">
        {DOCUMENT_TYPE_CONFIGS.map((config) => (
          <KycDocumentTypeConfigCard
            key={config.id}
            config={config}
            onEdit={() => {
              // TODO(orval): open the edit-document-type flow once the endpoint lands.
            }}
          />
        ))}
      </div>
    </section>
  );
}
