import { Button } from '@energyiq/ui';

interface OrderDetailActionsProps {
  canModify: boolean;
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canDispatch: boolean;
  canReceive: boolean;
  onModify: () => void;
  onReject: () => void;
  onApprove: () => void;
  onCancel: () => void;
  onDispatch: () => void;
  onReceive: () => void;
}

/** Right-card action buttons — rendered conditionally based on order status. */
export function OrderDetailActions({
  canModify,
  canApprove,
  canReject,
  canCancel,
  canDispatch,
  canReceive,
  onModify,
  onReject,
  onApprove,
  onCancel,
  onDispatch,
  onReceive,
}: OrderDetailActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {canModify && (
          <Button
            type="button"
            variant="outline"
            onClick={onModify}
            className="h-[44px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
          >
            Modify Order
          </Button>
        )}
        {canReject && (
          <Button
            type="button"
            variant="outline"
            onClick={onReject}
            className="h-[44px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
          >
            Reject Order
          </Button>
        )}
        {canCancel && !canReject && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-[44px] rounded-full border-danger bg-transparent text-sm font-medium text-danger hover:bg-danger/10"
          >
            Cancel Order
          </Button>
        )}
        {canDispatch && (
          <Button
            type="button"
            variant="outline"
            onClick={onDispatch}
            className="h-[44px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
          >
            Dispatch
          </Button>
        )}
        {canReceive && (
          <Button
            type="button"
            variant="outline"
            onClick={onReceive}
            className="h-[44px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
          >
            Mark Received
          </Button>
        )}
      </div>
      {canApprove && (
        <Button
          type="button"
          onClick={onApprove}
          className="h-[44px] rounded-full bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          Approve Order
        </Button>
      )}
    </div>
  );
}
