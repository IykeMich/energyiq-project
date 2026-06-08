import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { OrderStatusBadge } from './order-status-badge';
import type {
  OrderDelivery,
  OrderLineItem,
  OrderTimelineEvent,
  PaymentStatus,
} from '../mocks';

const NGN = new Intl.NumberFormat('en-NG');

interface OrderInfoCardProps {
  orderId: string;
  purchaseDate: string;
  amountNGN: number;
  payment: { method: string; status: PaymentStatus };
  delivery: OrderDelivery;
  lineItems: OrderLineItem[];
  timeline: OrderTimelineEvent[];
}

export function OrderInfoCard({
  orderId,
  purchaseDate,
  amountNGN,
  payment,
  delivery,
  lineItems,
  timeline,
}: OrderInfoCardProps) {
  return (
    <section className="bg-surface-card rounded-[28px] p-7 flex flex-col gap-8">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-5">Info</h2>
        <dl className="flex flex-col gap-3 text-sm text-foreground">
          <Row label="Order ID:" value={<span className="font-semibold">{orderId}</span>} />
          <Row label="Date of Purchase:" value={<span className="font-semibold">{purchaseDate}</span>} />
          <Row label="Payment Status:" value={<OrderStatusBadge value={payment.status} />} />
          <Row label="Amount:" value={<span className="font-semibold">₦{NGN.format(amountNGN)}</span>} />
          <Row label="Payment Method:" value={<span className="font-semibold">{payment.method}</span>} />
          <Row label="Delivery Status:" value={<DeliveryBadge status={delivery.status} />} />
          <Row
            label="Estimated Delivery Date:"
            value={<span className="font-semibold">{delivery.estimatedDate}</span>}
          />
        </dl>
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Items</h2>
        <ul className="flex flex-col gap-4">
          {lineItems.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-foreground">
                  {item.name} – {item.quantityLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Unit Price: ₦{NGN.format(item.unitPriceNGN)}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                ₦{NGN.format(item.totalNGN)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Timeline</h2>
        <ol className="flex flex-col">
          {timeline.map((event, idx) => {
            const isLast = idx === timeline.length - 1;
            return (
              <li key={`${event.label}-${idx}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <TimelineIcon status={event.status} />
                  {!isLast && <div className="w-px flex-1 bg-border-subtle min-h-[28px]" />}
                </div>
                <div className={cn('pb-4 flex flex-col', isLast && 'pb-0')}>
                  <p className="text-sm text-foreground">{event.label}</p>
                  {event.timestamp && (
                    <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function DeliveryBadge({ status }: { status: OrderDelivery['status'] }) {
  const cfg =
    status === 'delivered'
      ? { bg: 'bg-success/20', text: 'text-success', label: 'Delivered' }
      : status === 'in_transit'
      ? { bg: 'bg-brand/20', text: 'text-brand', label: 'In Transit' }
      : { bg: 'bg-warning/20', text: 'text-warning', label: 'Pending' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[14px] px-2.5 py-1 text-xs font-semibold',
        cfg.bg,
        cfg.text,
      )}
    >
      {cfg.label}
    </span>
  );
}

function TimelineIcon({ status }: { status: OrderTimelineEvent['status'] }) {
  if (status === 'completed')
    return <CheckCircle2 className="w-5 h-5 text-success shrink-0" />;
  if (status === 'rejected') return <XCircle className="w-5 h-5 text-danger shrink-0" />;
  return <Circle className="w-5 h-5 text-muted-foreground shrink-0" />;
}
