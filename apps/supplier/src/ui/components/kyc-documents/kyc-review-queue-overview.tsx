import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, toast, notifyNoAccess } from '@energyiq/ui';
import { KycReviewQueueCard } from './kyc-review-queue-card';
import { KycDocumentPreviewModal } from './kyc-document-preview-modal';
import { KycRejectDocumentModal } from './kyc-reject-document-modal';
import {
  REVIEW_QUEUE_ITEMS,
  mockReviewAction,
  type ReviewQueueItem,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/**
 * Compliance Centre "Review Queue": distributor documents awaiting review. Each card
 * opens a Preview Document pane and runs through an approve/reject confirmation flow
 * (confirm → "Confirming…" overlay → toast). Approving a restricted item surfaces the
 * "No Access" permission error. Swap REVIEW_QUEUE_ITEMS for the queue query once it lands.
 */
export function KycReviewQueueOverview() {
  const navigate = useNavigate();
  const { slug = 'demo' } = useParams<{ slug: string }>();
  const [items, setItems] = useState<ReviewQueueItem[]>(REVIEW_QUEUE_ITEMS);
  const [previewItem, setPreviewItem] = useState<ReviewQueueItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReviewQueueItem | null>(null);
  const [approveTarget, setApproveTarget] = useState<ReviewQueueItem | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);

  const removeFromQueue = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
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

  const handleConfirmReject = async ({ reason }: { reason: string; comments: string }) => {
    const item = rejectTarget;
    if (!item) return;
    setRejectTarget(null);
    setProcessingMessage('Confirming rejection...');
    // TODO(orval): replace with the reject-document mutation (sending reason + comments).
    await mockReviewAction();
    setProcessingMessage(null);
    removeFromQueue(item.id);
    toast.error('Document rejected', {
      description: `${item.distributor}'s ${item.fileName} was rejected (${reason}).`,
    });
  };

  const handleConfirmApprove = async () => {
    const item = approveTarget;
    if (!item) return;
    setApproveTarget(null);
    setProcessingMessage('Confirming approval...');
    // TODO(orval): replace with the approve-document mutation (server enforces permission).
    await mockReviewAction();
    setProcessingMessage(null);
    if (item.restricted) {
      notifyNoAccess('You do not have the permission to approve this document.');
      return;
    }
    removeFromQueue(item.id);
    toast.success('Document approved', {
      description: `${item.distributor}'s ${item.fileName} has been approved.`,
    });
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
        {items.length === 0 ? (
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
