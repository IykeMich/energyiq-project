import type { ReactNode } from 'react';
import { OrderDetailSection } from './order-detail-section';
import { OrderDetailRow } from './order-detail-row';
import type { OrderDetailData } from './order-detail-mocks';

interface OrderDetailSummaryCardProps {
  data: OrderDetailData;
  /** Action buttons rendered at the bottom of the card. */
  actions: ReactNode;
}

/** Right card: Supplier Details + Payment Details + actions. */
export function OrderDetailSummaryCard({ data, actions }: OrderDetailSummaryCardProps) {
  const { supplier, payment, total } = data;

  return (
    <div className="flex flex-col gap-6 rounded-[18px] bg-[#6161611A] p-8">
      <OrderDetailSection title="Supplier Details:">
        <div className="flex flex-col gap-3">
          {supplier.map((row) => (
            <OrderDetailRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </OrderDetailSection>

      <OrderDetailSection title="Payment Details:">
        <div className="flex flex-col gap-3">
          {payment.map((row) => (
            <OrderDetailRow key={row.label} label={row.label} value={row.value} />
          ))}
          <div className="my-1 h-px w-full bg-[#FFFFFFCC]" />
          <OrderDetailRow label={total.label} value={total.value} />
        </div>
      </OrderDetailSection>

      {actions}
    </div>
  );
}
