import { Button } from '@energyiq/ui';

interface OrderDetailActionsProps {
  onModify: () => void;
  onReject: () => void;
  onApprove: () => void;
}

/** Right-card action buttons: Modify / Reject (outline) and Approve (filled gold). */
export function OrderDetailActions({ onModify, onReject, onApprove }: OrderDetailActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onModify}
          className="h-[44px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
        >
          Modify Order
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReject}
          className="h-[44px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
        >
          Reject Order
        </Button>
      </div>
      <Button
        type="button"
        onClick={onApprove}
        className="h-[44px] rounded-full bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
      >
        Approve Order
      </Button>
    </div>
  );
}
