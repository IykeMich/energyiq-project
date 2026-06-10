import { cn } from '@energyiq/shared';
import type { DistributorOrderItem, DistributorOrderStatus } from '@/ui/pages/distributor/mocks';

const ORDER_STATUS_STYLE: Record<DistributorOrderStatus, string> = {
  Pending: 'bg-warning/20 text-warning',
  Delivered: 'bg-success/20 text-success',
};

/** One order line in the Orders tab — product, reference, amount and status pill. */
export function DistributorOrderRow({ order }: { order: DistributorOrderItem }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#FFFFFF1A] bg-[#6161611A] px-4 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[#FAFAFA]">{order.product}</span>
        <span className="text-xs text-[#FFFFFFCC]">
          {order.ref} · {order.when}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#FAFAFA]">{order.amount}</span>
        <span
          className={cn(
            'rounded-[14px] px-3 py-1 text-xs font-semibold',
            ORDER_STATUS_STYLE[order.status],
          )}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
}
