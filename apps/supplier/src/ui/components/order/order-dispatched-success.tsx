import { Check } from 'lucide-react';
import type { OrderDispatchSuccess, DispatchedQuantity } from '@/ui/pages/order/mocks';

const NGN = new Intl.NumberFormat('en-NG');

interface OrderDispatchedSuccessProps {
  success: OrderDispatchSuccess;
  quantities: DispatchedQuantity[];
  onGoHome: () => void;
  onBackToOrders: () => void;
}

/** Final dispatch stage: inline success panel beside the gold order summary card. */
export function OrderDispatchedSuccess({
  success,
  quantities,
  onGoHome,
  onBackToOrders,
}: OrderDispatchedSuccessProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
      <section className="bg-surface-card rounded-[28px] p-10 flex flex-col items-center gap-5 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/15">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Check className="h-6 w-6" aria-hidden="true" />
          </span>
        </span>
        <h2 className="text-2xl font-semibold text-foreground">Order Dispatched!</h2>
        <p className="max-w-[360px] text-sm text-muted-foreground">
          Orders has been dispatched to <span className="font-semibold text-brand">{success.recipient}</span>. Stocks
          has been auto-adjusted across both systems.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="h-11 rounded-full border border-brand px-6 text-sm font-semibold text-brand"
          >
            Go to Home
          </button>
          <button
            type="button"
            onClick={onBackToOrders}
            className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground"
          >
            Back to Orders
          </button>
        </div>
      </section>

      <section className="rounded-[28px] bg-brand p-7 text-brand-foreground flex flex-col gap-5">
        <header className="flex flex-col gap-1">
          <span className="text-xs font-medium text-brand-foreground/70">Order Summary</span>
          <span className="text-lg font-semibold">{success.recipient}</span>
          <span className="text-xs text-brand-foreground/70">{success.contactName}</span>
        </header>

        <dl className="flex flex-col gap-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-brand-foreground/80">Quantity:</dt>
            <dd className="flex flex-col items-end gap-1 font-semibold text-right">
              {quantities.map((quantity) => (
                <span key={quantity.id}>{quantity.label}</span>
              ))}
            </dd>
          </div>
          <Row label="Order Total:" value={`₦${NGN.format(success.orderTotalNGN)}`} />
          <Row label="Phone Number:" value={success.phone} />
          <Row label="Requested On:" value={success.requestedOn} />
          <Row label="Order Placed:" value={success.orderPlaced} />
        </dl>

        <div className="rounded-[16px] border border-brand-foreground/20 p-4">
          <p className="text-xs text-brand-foreground/70">Address:</p>
          <p className="mt-1 text-sm font-medium">{success.address}</p>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-brand-foreground/80">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}
