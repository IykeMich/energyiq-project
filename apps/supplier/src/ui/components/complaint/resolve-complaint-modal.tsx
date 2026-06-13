import { useEffect, useState } from 'react';
import { Clock, UploadCloud } from 'lucide-react';
import {
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import { RESOLUTION_TYPES, type ComplaintDetail } from '@/ui/pages/complaint/mocks';

interface ResolveComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: ComplaintDetail;
  onSubmit: (data: { resolutionType: string; amount: string; message: string }) => void;
  onSaveDraft: () => void;
}

/** "Propose Resolution" form modal opened by the Resolve Complaint action. */
export function ResolveComplaintModal({
  open,
  onOpenChange,
  detail,
  onSubmit,
  onSaveDraft,
}: ResolveComplaintModalProps) {
  const [resolutionType, setResolutionType] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (open) {
      setResolutionType('');
      setAmount('');
      setMessage('');
      setSubmitAttempted(false);
    }
  }, [open]);

  const resolutionTypeError = submitAttempted && !resolutionType ? 'Select a resolution type' : '';
  const messageError = submitAttempted && message.trim().length === 0 ? 'Enter a response message' : '';
  const canSubmit = resolutionType.length > 0 && message.trim().length > 0;

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!canSubmit) return;
    onSubmit({ resolutionType, amount, message });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Propose Resolution"
      onBack={() => onOpenChange(false)}
      size="md"
    >
      <div className="flex flex-col gap-6">
        <p className="-mt-2 text-sm text-[#FFFFFFCC]">Responding as {detail.responder}</p>

        <div className="flex items-center gap-2 rounded-xl bg-[#3D2E0A] px-4 py-2.5 text-sm font-medium text-[#FBC02D]">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          {detail.responseDeadlineNote}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Resolution Type:</label>
          <Select value={resolutionType} onValueChange={(value) => setResolutionType(value ?? '')}>
            <SelectTrigger
              className={cn(
                'bg-surface-card border-border-strong data-[size=default]:h-[52px] w-full cursor-pointer rounded-[28px] px-5 text-foreground transition-colors hover:border-brand',
                resolutionTypeError && 'border-destructive focus:ring-destructive',
              )}
            >
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={6}
              alignItemWithTrigger={false}
              className="w-(--anchor-width) rounded-[20px] border border-border-strong bg-surface-modal p-1.5"
            >
              {RESOLUTION_TYPES.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="h-11 rounded-[14px] pl-4 text-sm text-foreground"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {resolutionTypeError && <p className="text-destructive text-xs">{resolutionTypeError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Refund/Credit Amount:</label>
          <div className="flex items-stretch overflow-hidden rounded-[28px] border border-[#616161B2] bg-[#6161611A]">
            <span className="flex w-14 items-center justify-center border-r border-[#616161B2] text-[#FFFFFFCC]">
              #
            </span>
            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="h-[52px] w-full bg-transparent px-5 text-sm text-[#FAFAFA] placeholder:text-[#FFFFFFCC] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Response Message:</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder="Type your message..."
            className={cn(
              'resize-none rounded-[28px] border border-[#616161B2] bg-[#6161611A] p-5 text-sm text-[#FAFAFA] placeholder:text-[#FFFFFFCC] focus:border-[#FBC02D] focus:outline-none',
              messageError && 'border-destructive focus:border-destructive',
            )}
          />
          {messageError && <p className="text-destructive text-xs">{messageError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Supporting evidence (Optional):</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#616161B2] px-6 py-10 text-center transition-colors hover:border-[#FBC02D]">
            <UploadCloud className="h-7 w-7 text-[#FFFFFFCC]" aria-hidden="true" />
            <p className="text-sm text-[#FAFAFA]">
              <span className="font-medium text-[#FBC02D]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-[#FFFFFFCC]">PDF, JPG,PNG . Max 10MB</p>
            {/* TODO(orval): upload supporting evidence once the documents endpoint lands. */}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onSaveDraft}
            className="tap-effect h-[53px] rounded-[28px] bg-[#616161B2] text-sm font-semibold text-[#FAFAFA]"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="tap-effect h-[53px] rounded-[28px] bg-[#FBC02D] text-sm font-semibold text-[#121212] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Response
          </button>
        </div>
      </div>
    </Modal>
  );
}
