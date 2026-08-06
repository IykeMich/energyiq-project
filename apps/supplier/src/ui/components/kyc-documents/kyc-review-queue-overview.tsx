import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { shared } from '@energyiq/domain';
import { ConfirmDialog, LoadingOverlay, toast, notifyNoAccess } from '@energyiq/ui';
import {
  useGetV1DocumentList,
  useGetV1DocumentOverview,
  usePostV1DocumentApproveId,
  usePostV1DocumentRejectId,
  getGetV1DocumentListQueryKey,
  getGetV1DocumentOverviewQueryKey,
  getGetV1DocumentComplianceQueryKey,
} from '@energyiq/api/generated/documents/documents';
import { KycReviewQueueCard } from './kyc-review-queue-card';
import { KycDocumentPreviewModal } from './kyc-document-preview-modal';
import { KycRejectDocumentModal } from './kyc-reject-document-modal';
import { mapDocumentsToReviewQueueItems, mapRejectionReasonOptions } from './kyc-documents-mappers';
import type { ReviewQueueItem } from './kyc-documents-types';

const { DomainError, ResponseCodes } = shared;

/**
 * Compliance Centre "Review Queue": distributor documents awaiting review. Each card
 * opens a Preview Document pane and runs through an approve/reject confirmation flow
 * (confirm → "Confirming…" overlay → toast). A 403 from the approve/reject mutation
 * surfaces the "No Access" permission error instead of the generic toast.
 */
export function KycReviewQueueOverview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = 'demo' } = useParams<{ slug: string }>();

  const { data, isLoading } = useGetV1DocumentList({ status: 'pending' });
  const items = useMemo(() => mapDocumentsToReviewQueueItems(data?.data?.data ?? []), [data]);

  // Reject reasons live on the dashboard-overview payload, not the plain document list.
  const { data: overviewResponse } = useGetV1DocumentOverview();
  const rejectionReasons = useMemo(
    () => mapRejectionReasonOptions(overviewResponse?.data.data),
    [overviewResponse],
  );

  const [previewItem, setPreviewItem] = useState<ReviewQueueItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReviewQueueItem | null>(null);
  const [approveTarget, setApproveTarget] = useState<ReviewQueueItem | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);

  const approveDocument = usePostV1DocumentApproveId();
  const rejectDocument = usePostV1DocumentRejectId();

  const refreshQueue = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetV1DocumentListQueryKey({ status: 'pending' }) });
    // Prefix-matches every `/v1/document/overview` query regardless of filter params,
    // so both this page's own fetch and the dashboard's KPIs refresh after a review.
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

  // Opening a confirm/reject modal closes the preview pane so they never stack.
  const openReject = (item: ReviewQueueItem) => {
    setPreviewItem(null);
    setRejectTarget(item);
  };

  const openApprove = (item: ReviewQueueItem) => {
    setPreviewItem(null);
    setApproveTarget(item);
  };

  const handleConfirmReject = async ({ reason, comments }: { reason: string; comments: string }) => {
    const item = rejectTarget;
    if (!item) return;
    // `reason` is the selected option's `value` — resolve it to its human-readable
    // `label` so both the server-stored reason and the toast show real text, not a code.
    const reasonLabel = rejectionReasons.find((option) => option.value === reason)?.label ?? reason;
    setRejectTarget(null);
    setProcessingMessage('Confirming rejection...');
    try {
      await rejectDocument.mutateAsync({
        id: item.id,
        data: { reason: comments ? `${reasonLabel}: ${comments}` : reasonLabel },
      });
      await refreshQueue();
      toast.error('Document rejected', {
        description: `${item.distributor}'s ${item.fileName} was rejected (${reasonLabel}).`,
      });
    } catch (error) {
      if (!notifyIfForbidden(error)) {
        toast.error('Could not reject document', { description: 'Please try again.' });
      }
    } finally {
      setProcessingMessage(null);
    }
  };

  const handleConfirmApprove = async () => {
    const item = approveTarget;
    if (!item) return;
    setApproveTarget(null);
    setProcessingMessage('Confirming approval...');
    try {
      await approveDocument.mutateAsync({ id: item.id });
      await refreshQueue();
      toast.success('Document approved', {
        description: `${item.distributor}'s ${item.fileName} has been approved.`,
      });
    } catch (error) {
      if (!notifyIfForbidden(error)) {
        toast.error('Could not approve document', { description: 'Please try again.' });
      }
    } finally {
      setProcessingMessage(null);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(`/${slug}/kyc-documents`)}
          aria-label="Back to KYC documents"
          className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-white">Review Queue</h1>
          <p className="text-sm text-gray-400">Compliance Centre</p>
        </div>
      </header>

      <div className="rounded-[18px] border border-[#27272A] p-4 sm:p-6">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-gray-400">Loading review queue…</p>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">
            The review queue is empty — every document has been reviewed.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <KycReviewQueueCard
                key={item.id}
                item={item}
                onPreview={() => setPreviewItem(item)}
                onApprove={() => openApprove(item)}
                onReject={() => openReject(item)}
              />
            ))}
          </div>
        )}
      </div>

      <KycDocumentPreviewModal
        item={previewItem}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        onApprove={() => previewItem && openApprove(previewItem)}
        onReject={() => previewItem && openReject(previewItem)}
      />

      <KycRejectDocumentModal
        item={rejectTarget}
        reasons={rejectionReasons}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onConfirm={handleConfirmReject}
      />

      <ConfirmDialog
        open={approveTarget !== null}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        title="Approve Document"
        message={
          <>
            Are you sure you want to approve this document?
            <br />
            <span className="text-muted-foreground">
              Once approved, the document status will be updated and the distributor will be
              notified.
            </span>
          </>
        }
        confirmLabel="Confirm Approval"
        intent="primary"
        onConfirm={handleConfirmApprove}
      />

      {processingMessage && <LoadingOverlay message={processingMessage} />}
    </section>
  );
}
