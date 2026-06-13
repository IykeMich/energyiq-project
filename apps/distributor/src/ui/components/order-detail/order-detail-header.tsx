import { ArrowLeft, Send } from 'lucide-react';
import type { OrderDetailBadge } from './order-detail-mocks';

interface OrderDetailHeaderProps {
  status: OrderDetailBadge;
  onBack: () => void;
}

/** Body sub-header: back arrow + "Order Details" title, with a status pill on the right. */
export function OrderDetailHeader({ status, onBack }: OrderDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to orders"
          className="tap-effect flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-[#FBC02DB2] text-[#121212]"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Order Details</h1>
      </div>
      <span
        className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium"
        style={{ color: status.color, backgroundColor: `${status.color}4D` }}
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {status.label}
      </span>
    </div>
  );
}
