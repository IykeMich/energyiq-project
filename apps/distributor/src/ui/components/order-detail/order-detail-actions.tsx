import { Button } from '@energyiq/ui';

interface OrderDetailActionsProps {
  canModify: boolean;
  canCancel: boolean;
  canReceive: boolean;
  onModify: () => void;
  onCancel: () => void;
  onReceive: () => void;
}

/** Right-card action buttons — rendered conditionally based on order status. */
export function OrderDetailActions({
  canModify,
  canCancel,
  canReceive,
  onModify,
  onCancel,
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
            className="h-[40px] rounded-full border-brand bg-transparent text-sm font-medium text-brand hover:bg-brand/10"
          >
            Modify Order
          </Button>
        )}
        {canCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-[40px] rounded-full border-danger bg-transparent text-sm font-medium text-danger hover:bg-danger/10"
          >
            Cancel Order
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
    </div>
  );
}
