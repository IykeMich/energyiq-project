import { useEffect, useState } from 'react';
import {
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import { REJECTION_REASONS } from '@/ui/pages/complaint/mocks';

interface RejectComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { reason: string; note: string }) => void;
}

/** "Reject Complaint" form modal — captures the rejection reason and a required note. */
export function RejectComplaintModal({ open, onOpenChange, onConfirm }: RejectComplaintModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setNote('');
      setSubmitAttempted(false);
    }
  }, [open]);

  const reasonError = submitAttempted && !reason ? 'Select a reason' : '';
  const noteError = submitAttempted && note.trim().length === 0 ? 'Resolution note is required.' : '';
  const canConfirm = reason.length > 0 && note.trim().length > 0;

  const handleConfirm = () => {
    setSubmitAttempted(true);
    if (!canConfirm) return;
    onConfirm({ reason, note });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reject Complaint"
      onBack={() => onOpenChange(false)}
      size="md"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Reason for Rejection:</label>
          <Select value={reason} onValueChange={(value) => setReason(value ?? '')}>
            <SelectTrigger
              className={cn(
                'bg-surface-card border-border-strong data-[size=default]:h-[52px] w-full cursor-pointer rounded-[28px] px-5 text-foreground transition-colors hover:border-brand',
                reasonError && 'border-destructive focus:ring-destructive',
              )}
            >
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={6}
              alignItemWithTrigger={false}
              className="w-(--anchor-width) rounded-[20px] border border-border-strong bg-surface-modal p-1.5"
            >
              {REJECTION_REASONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="h-11 rounded-[14px] pl-4 text-sm text-foreground"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {reasonError && <p className="text-destructive text-xs">{reasonError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Additional Note:</label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            placeholder="Type your note..."
            className={cn(
              'resize-none rounded-[28px] border border-[#616161B2] bg-[#6161611A] p-5 text-sm text-[#FAFAFA] placeholder:text-[#FFFFFFCC] focus:border-[#FBC02D] focus:outline-none',
              noteError && 'border-destructive focus:border-destructive',
            )}
          />
          {noteError && <p className="text-destructive text-xs">{noteError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="tap-effect h-[53px] rounded-[28px] bg-[#616161B2] text-sm font-semibold text-[#FAFAFA] transition-opacity hover:opacity-90"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="tap-effect h-[53px] rounded-[28px] bg-danger text-sm font-semibold text-danger-foreground transition-opacity hover:opacity-90"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </Modal>
  );
}
