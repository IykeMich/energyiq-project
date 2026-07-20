import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog, toast } from '@energyiq/ui';
import {
  useDeleteV1DocumentDeleteId,
  getGetV1DocumentListQueryKey,
} from '@energyiq/api/generated/documents/documents';
import type { DomainDocument } from '@energyiq/api/generated/schemas';
import { StatusBadge } from './document-status-badge';
import { toDisplayStatus, formatDate } from './document-mappers';

interface Props {
  documents: DomainDocument[];
  isLoading?: boolean;
  onViewDocument: (document: DomainDocument) => void;
}

export function DocumentManagementCard({ documents, isLoading, onViewDocument }: Props) {
  const queryClient = useQueryClient();
  const [removeTarget, setRemoveTarget] = useState<DomainDocument | null>(null);
  const deleteDocument = useDeleteV1DocumentDeleteId();

  const handleConfirmRemove = async () => {
    if (!removeTarget?.id) return;
    await deleteDocument.mutateAsync({ id: removeTarget.id });
    await queryClient.invalidateQueries({ queryKey: getGetV1DocumentListQueryKey() });
    toast.success('Document removed', {
      description: `${removeTarget.file_name} has been removed.`,
    });
    setRemoveTarget(null);
  };

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-[28px] font-semibold text-white">Document Management</h1>

        <p className="mt-1 text-sm text-[#8A8A8A]">Compliance Centre</p>
      </div>

      <div className="relative rounded-[18px] border border-[#3A3A3A] bg-[#111111] p-4">
        <div className="absolute -top-2.5 left-3 bg-[#111111] px-2">
          <span className="text-[12px] font-medium text-white">KYC / IDENTITY</span>
        </div>

        <div className="absolute -top-2.25 right-3 bg-[#111111] px-2">
          <span className="text-[11px] text-[#727272]">{documents.length} Documents</span>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <p className="py-10 text-center text-sm text-[#8A8A8A]">Loading documents…</p>
          )}

          {!isLoading && documents.length === 0 && (
            <p className="py-10 text-center text-sm text-[#8A8A8A]">
              You haven&apos;t uploaded any documents yet.
            </p>
          )}

          {documents.map((document) => {
            const status = toDisplayStatus(document);
            const needsReupload = status === 'rejected' || status === 'expiring' || status === 'expired';

            return (
              <div
                key={document.id}
                className="rounded-xl bg-[#191919] px-5 py-4"
              >
                <div className="flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] text-white">{document.document_type}</h3>

                      <StatusBadge status={status} />
                    </div>

                    <div className="mt-1 text-[11px] text-[#A5A5A5]">{document.file_name}</div>

                    <div className="mt-1 text-[10px] text-[#757575]">
                      Uploaded {formatDate(document.created_at)}
                      {document.expires_at && ` • Expires ${formatDate(document.expires_at)}`}
                    </div>

                    {status === 'rejected' && document.rejection_reason && (
                      <div className="mt-2 inline-flex rounded bg-[#421414] px-3 py-1 text-[10px] text-[#E45B5B]">
                        {document.rejection_reason}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => onViewDocument(document)}
                      className={`h-8 rounded-full px-5 text-[11px] font-medium ${
                        status === 'approved' || status === 'pending'
                          ? 'bg-[#F4BE2A] text-black'
                          : 'border border-[#F4BE2A] text-[#F4BE2A]'
                      }`}
                    >
                      {needsReupload ? 'Re-Upload Document' : 'View Document'}
                    </button>

                    {status === 'pending' && (
                      <button
                        onClick={() => setRemoveTarget(document)}
                        className="h-8 rounded-full border border-[#D30A0A] px-4 text-[11px] font-medium text-[#D30A0A]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove Document"
        message={
          <>
            Are you sure you want to remove &apos;{removeTarget?.file_name}&apos;?
            <br />
            <span className="text-muted-foreground">
              This document hasn&apos;t been reviewed yet — removing it means you&apos;ll need to
              submit it again.
            </span>
          </>
        }
        confirmLabel="Remove"
        intent="danger"
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
