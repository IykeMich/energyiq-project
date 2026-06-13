import { ClipboardList } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { OrderDispatchSummary } from '@/ui/pages/order/mocks';

const NGN = new Intl.NumberFormat('en-NG');

interface OrderSummaryCardProps {
  summary: OrderDispatchSummary;
}

/** "Order Summary" card for the dispatch flow (totals + payment/inventory status). */
export function OrderSummaryCard({ summary }: OrderSummaryCardProps) {
  return (
    <section className="bg-surface-card rounded-[28px] p-7 flex flex-col gap-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <ClipboardList className="h-5 w-5 text-brand" aria-hidden="true" />
        Order Summary
      </h2>
      <dl className="flex flex-col gap-4 text-sm text-foreground">
        <Row label="Order Total:" value={<span className="font-semibold text-brand">₦{NGN.format(summary.orderTotalNGN)}</span>} />
        <Row label="Total Items:" value={<span className="font-semibold">{summary.totalItems}</span>} />
        <Row label="Payment:" value={<StatusPill label={summary.paymentLabel} />} />
        <Row label="Inventory:" value={<StatusPill label={summary.inventoryLabel} />} />
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[14px] bg-success/20 px-3 py-1 text-xs font-semibold text-success',
        className,
      )}
    >
      {label}
    </span>
  );
}
