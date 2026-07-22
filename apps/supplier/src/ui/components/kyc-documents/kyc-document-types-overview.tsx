import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog, toast } from '@energyiq/ui';
import {
  useGetV1DocumentTypeList,
  useDeleteV1DocumentTypeDeleteId,
  getGetV1DocumentTypeListQueryKey,
} from '@energyiq/api/generated/document-types/document-types';
import { KycDocumentTypeConfigCard } from './kyc-document-type-config-card';
import { mapDocumentTypeToConfig } from './kyc-document-type-mappers';
import type { DocumentTypeConfig } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/** "Document Types" configuration page: lists every document distributors must submit. */
export function KycDocumentTypesOverview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = 'demo' } = useParams<{ slug: string }>();
  const [deactivateTarget, setDeactivateTarget] = useState<DocumentTypeConfig | null>(null);

  const { data, isLoading } = useGetV1DocumentTypeList();
  const deactivateDocumentType = useDeleteV1DocumentTypeDeleteId();
  const configs = (data?.data?.data ?? []).map(mapDocumentTypeToConfig);

  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget) return;
    await deactivateDocumentType.mutateAsync({ id: deactivateTarget.id });
    await queryClient.invalidateQueries({ queryKey: getGetV1DocumentTypeListQueryKey() });
    toast.success('Document type deactivated', {
      description: `'${deactivateTarget.name}' is no longer required from distributors.`,
    });
    setDeactivateTarget(null);
  };

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/kyc-documents/categories`)}
            className="tap-effect inline-flex items-center gap-1.5 rounded-full border border-[#FBC02D] px-5 py-2.5 text-sm font-semibold text-[#FBC02D]"
          >
            Manage Categories
          </button>
          <button
            type="button"
            onClick={() => navigate(`/${slug}/kyc-documents/types/new`)}
            className="tap-effect inline-flex items-center gap-1.5 rounded-full bg-[#FBC02D] px-5 py-2.5 text-sm font-semibold text-[#121212]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add new type
          </button>
        </div>
      </header>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-gray-400">Loading document types…</p>
      ) : configs.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">No document types configured yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {configs.map((config) => (
            <KycDocumentTypeConfigCard
              key={config.id}
              config={config}
              onEdit={() => navigate(`/${slug}/kyc-documents/types/${config.id}/edit`)}
              onDeactivate={() => setDeactivateTarget(config)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deactivateTarget !== null}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate Document Type"
        message={
          <>
            Are you sure you want to deactivate &apos;{deactivateTarget?.name}&apos;?
            <br />
            <span className="text-muted-foreground">
              Distributors will no longer be asked to submit this document. Existing submissions are
              kept for audit purposes.
            </span>
          </>
        }
        confirmLabel="Deactivate"
        intent="danger"
        onConfirm={handleConfirmDeactivate}
      />
    </section>
  );
}
