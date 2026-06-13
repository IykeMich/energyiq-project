import { useEffect, useState } from 'react';
import {
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import {
  KYC_REJECT_REASONS,
  type ReviewQueueItem,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycRejectDocumentModalProps {
  item: ReviewQueueItem | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { reason: string; comments: string }) => void;
}

/** Reject a document submission — captures a reason + optional comments before confirming. */
export function KycRejectDocumentModal({
  item,
  onOpenChange,
  onConfirm,
}: KycRejectDocumentModalProps) {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (item) {
      setReason('');
      setComments('');
    }
  }, [item]);

  const canReject = reason.trim().length > 0;

  return (
    <Modal
      open={item !== null}
      onOpenChange={onOpenChange}
      title="Reject Document"
      onBack={() => onOpenChange(false)}
      size="sm"
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">
          You are about to reject this document submission. Please provide a reason for the
          rejection.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">Reason for Rejection:</label>
          <Select value={reason} onValueChange={(value) => setReason(value ?? '')}>
            <SelectTrigger className="data-[size=default]:h-[52px] w-full cursor-pointer rounded-xl border-[#3A3A3A] bg-[#FFFFFF0F] px-4 text-foreground hover:border-brand">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {KYC_REJECT_REASONS.map((rejectReason) => (
                <SelectItem key={rejectReason} value={rejectReason}>
                  {rejectReason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">Comments/ Feedback:</label>
          <textarea
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            rows={4}
            placeholder="Add context for the distributor (optional)"
            className="resize-none rounded-xl border border-[#3A3A3A] bg-[#FFFFFF0F] p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="tap-effect h-12 shrink-0 rounded-full bg-foreground/10 px-8 text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => canReject && onConfirm({ reason, comments })}
            disabled={!canReject}
            className="h-12 flex-1 rounded-full bg-danger text-sm font-semibold text-danger-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </Modal>
  );
}
