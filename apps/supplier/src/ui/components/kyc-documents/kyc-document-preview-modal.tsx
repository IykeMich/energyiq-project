import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ArrowLeft, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { KycDocumentsTierBadge } from './kyc-documents-tier-badge';
import { ApproveButton, RejectButton } from './kyc-review-action-buttons';
import type { ReviewQueueItem } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentPreviewModalProps {
  item: ReviewQueueItem | null;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
}

/** Neutral placeholder shown until the real document URL/stream is wired (TODO orval). */
function DocumentPlaceholder({ documentUrl, fileName }: { documentUrl?: string; fileName: string }) {
  if (documentUrl) {
    return (
      <img
        src={documentUrl}
        alt={fileName}
        className="h-full w-full rounded-[14px] bg-white object-contain"
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white/[0.04]">
      <FileText className="h-12 w-12 text-gray-500" aria-hidden="true" />
      <p className="text-sm text-gray-400">Document preview</p>
      <p className="max-w-[60%] truncate text-xs text-gray-500">{fileName}</p>
    </div>
  );
}

/**
 * "Preview Document" pane — a right-anchored overlay over the dimmed Review Queue.
 * Shows the submitting distributor, the file, the document image, and Approve/Reject.
 */
export function KycDocumentPreviewModal({
  item,
  onOpenChange,
  onApprove,
  onReject,
}: KycDocumentPreviewModalProps) {
  return (
    <DialogPrimitive.Root open={item !== null} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 right-4 z-50 flex max-h-[92vh] w-full max-w-[640px] -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-border-subtle bg-[#1A1A1A] outline-none data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-right-4 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-right-4 lg:right-10">
          {item && (
            <>
              <div className="flex items-center gap-3.5 px-6 pt-6">
                <DialogPrimitive.Close
                  aria-label="Back"
                  className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </DialogPrimitive.Close>
                <DialogPrimitive.Title className="m-0 text-xl font-semibold text-white">
                  Preview Document
                </DialogPrimitive.Title>
              </div>

              <div className="flex flex-col gap-5 overflow-y-auto px-6 pb-6 pt-5">
                <div className="flex flex-col gap-4 rounded-2xl bg-[#FFFFFF0A] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
                          {getInitials(item.distributor)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">{item.distributor}</span>
                      <KycDocumentsTierBadge tier={item.tier} />
                    </div>
                    <div className="flex items-center gap-3">
                      <ApproveButton onClick={onApprove} />
                      <RejectButton onClick={onReject} />
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#FBC02D1A] px-3 py-2 text-xs font-medium text-[#FBC02D]">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.fileName}
                  </span>
                </div>

                <div className="h-[460px] w-full rounded-[18px] border border-[#3A3A3A] p-3">
                  <DocumentPlaceholder documentUrl={item.documentUrl} fileName={item.fileName} />
                </div>

                <p className="text-center text-xs text-gray-500">Awaiting Approval. Reviewed by you.</p>
              </div>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
