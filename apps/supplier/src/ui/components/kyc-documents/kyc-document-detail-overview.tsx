import { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { shared } from '@energyiq/domain';
import { Avatar, AvatarFallback, ConfirmDialog, LoadingOverlay, toast, notifyNoAccess } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import {
  useGetV1DocumentReadId,
  usePostV1DocumentApproveId,
  usePostV1DocumentRejectId,
  getGetV1DocumentReadIdQueryKey,
  getGetV1DocumentOverviewQueryKey,
  getGetV1DocumentComplianceQueryKey,
} from '@energyiq/api/generated/documents/documents';
import { KycDocumentsTierBadge } from './kyc-documents-tier-badge';
import { KycRejectDocumentModal } from './kyc-reject-document-modal';
import type { KycDocumentFilterOption } from './kyc-documents-types';

const { DomainError, ResponseCodes } = shared;

interface KycDocumentDetailOverviewProps {
  documentId: string;
}

/** "View Document" — the single-document detail page reached from the dashboard's
 * Pending Review / Expiring Soon rows. Approve/Reject only show while still pending. */
export function KycDocumentDetailOverview({ documentId }: KycDocumentDetailOverviewProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = 'demo' } = useParams<{ slug: string }>();

  const { data, isLoading } = useGetV1DocumentReadId(documentId);
  const document = data?.data.data;

  const [rejecting, setRejecting] = useState(false);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

  const approveDocument = usePostV1DocumentApproveId();
  const rejectDocument = usePostV1DocumentRejectId();

  const goToDashboard = () => navigate(`/${slug}/kyc-documents`);

  const refreshAfterReview = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetV1DocumentReadIdQueryKey(documentId) });
    await queryClient.invalidateQueries({ queryKey: getGetV1DocumentOverviewQueryKey() });
    await queryClient.invalidateQueries({ queryKey: getGetV1DocumentComplianceQueryKey() });
  };

  const notifyIfForbidden = (error: unknown): boolean => {
    if (error instanceof DomainError && error.code === ResponseCodes.FORBIDDEN) {
      notifyNoAccess('You do not have the permission to review this document.');
      return true;
    }
    return false;
  };

  const handleConfirmApprove = async () => {
    setApproveConfirmOpen(false);
    setProcessingMessage('Confirming approval...');
    try {
      await approveDocument.mutateAsync({ id: documentId });
      await refreshAfterReview();
      toast.success('Document approved', {
        description: `${document?.distributor_name ?? 'The distributor'}'s ${document?.file_name ?? 'document'} has been approved.`,
      });
    } catch (error) {
      if (!notifyIfForbidden(error)) {
        toast.error('Could not approve document', { description: 'Please try again.' });
      }
    } finally {
      setProcessingMessage(null);
    }
  };

  const handleConfirmReject = async ({ reason, comments }: { reason: string; comments: string }) => {
    const reasonLabel =
      document?.rejection_reason_options?.find((option) => option.value === reason)?.label ?? reason;
    setRejecting(false);
    setProcessingMessage('Confirming rejection...');
    try {
      await rejectDocument.mutateAsync({
        id: documentId,
        data: { reason: comments ? `${reasonLabel}: ${comments}` : reasonLabel },
      });
      await refreshAfterReview();
      toast.error('Document rejected', {
        description: `${document?.distributor_name ?? 'The distributor'}'s ${document?.file_name ?? 'document'} was rejected (${reasonLabel}).`,
      });
    } catch (error) {
      if (!notifyIfForbidden(error)) {
        toast.error('Could not reject document', { description: 'Please try again.' });
      }
    } finally {
      setProcessingMessage(null);
    }
  };

  const BackButton = (
    <button
      type="button"
      onClick={goToDashboard}
      aria-label="Back to KYC documents"
      className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  if (isLoading || !document) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3.5">{BackButton}</div>
        <p className="py-16 text-center text-sm text-gray-400">
          {isLoading ? 'Loading document…' : 'Document not found.'}
        </p>
      </section>
    );
  }

  const isPending = document.status === 'pending';
  const reasonOptions: KycDocumentFilterOption[] = (document.rejection_reason_options ?? []).map(
    (option) => ({ value: option.value ?? '', label: option.label ?? '' }),
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3.5">
        {BackButton}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-white">
            {document.preview_title ?? document.document_type_label ?? 'Document'}
          </h1>
          <span className="w-fit rounded-full bg-[#FFFFFF14] px-3 py-0.5 text-xs font-medium text-gray-300">
            {document.status_label ?? document.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-[#252525] bg-[#1A1A1A] p-8">
            <div className="mx-auto flex h-55 max-w-87.5 flex-col items-center justify-center rounded-2xl border border-[#333] bg-white/[0.04]">
              {document.file_url ? (
                <img
                  src={document.file_url}
                  alt={document.file_name ?? 'Document'}
                  className="h-full w-full rounded-2xl object-contain"
                />
              ) : (
                <>
                  <FileText className="mb-3 h-12 w-12 text-gray-500" aria-hidden="true" />
                  <p className="max-w-[80%] truncate text-sm text-gray-400">{document.file_name}</p>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
                  {document.distributor_initials || getInitials(document.distributor_name ?? '')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">{document.distributor_name}</span>
              <KycDocumentsTierBadge tier={document.tier_label} />
            </div>
          </div>

          <div className="rounded-3xl border border-[#252525] bg-[#161616] p-6">
            <div className="grid gap-y-5 text-sm sm:grid-cols-2">
              <div>
                <p className="text-gray-500">Document Type</p>
                <p className="mt-1 text-white">{document.document_type_label ?? '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Distributor</p>
                <p className="mt-1 text-white">{document.distributor_name ?? '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Submitted On</p>
                <p className="mt-1 text-white">{document.submitted_at_label ?? '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Valid Until</p>
                <p className="mt-1 text-[#F4B400]">{document.expires_at_label ?? '-'}</p>
              </div>
              {document.status_note && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500">Status</p>
                  <p className="mt-1 text-white">{document.status_note}</p>
                </div>
              )}
              {document.rejection_reason && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500">Rejection Reason</p>
                  <p className="mt-1 text-[#FF6666]">{document.rejection_reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isPending && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setApproveConfirmOpen(true)}
              className="tap-effect rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white"
            >
              {document.approve_action_label ?? 'Approve'}
            </button>
            <button
              type="button"
              onClick={() => setRejecting(true)}
              className="tap-effect rounded-full border border-[#D30A0A] px-6 py-3 text-sm font-semibold text-[#D30A0A]"
            >
              {document.reject_action_label ?? 'Reject'}
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        title="Approve Document"
        message={
          <>
            Are you sure you want to approve this document?
            <br />
            <span className="text-muted-foreground">
              Once approved, the document status will be updated and the distributor will be notified.
            </span>
          </>
        }
        confirmLabel="Confirm Approval"
        intent="primary"
        onConfirm={handleConfirmApprove}
      />

      <KycRejectDocumentModal
        item={rejecting ? { id: documentId, distributor: document.distributor_name ?? '', fileName: document.file_name ?? '', submittedAgo: '' } : null}
        reasons={reasonOptions}
        onOpenChange={(open) => !open && setRejecting(false)}
        onConfirm={handleConfirmReject}
      />

      {processingMessage && <LoadingOverlay message={processingMessage} />}
    </section>
  );
}
