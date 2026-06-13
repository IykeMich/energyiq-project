import { OrderDetailSection } from './order-detail-section';
import { OrderDetailRow } from './order-detail-row';
import { OrderDetailItems } from './order-detail-items';
import { OrderDetailTimeline } from './order-detail-timeline';
import { OrdersStatusBadge } from '../orders/orders-status-badge';
import type { OrderDetailData } from './order-detail-mocks';

interface OrderDetailInfoCardProps {
  data: OrderDetailData;
}

/** Left card: Info → Items → Timeline. */
export function OrderDetailInfoCard({ data }: OrderDetailInfoCardProps) {
  const { info, items, timeline } = data;

  return (
    <div className="flex flex-col gap-8 rounded-[18px] bg-[#6161611A] p-8">
      <OrderDetailSection title="Info">
        <div className="flex flex-col gap-3">
          <OrderDetailRow label="Order ID:" value={info.orderId} />
          <OrderDetailRow label="Date of Purchase:" value={info.purchaseDate} />
          <OrderDetailRow
            label="Payment Status:"
            value={
              <OrdersStatusBadge label={info.paymentStatus.label} color={info.paymentStatus.color} />
            }
          />
          <OrderDetailRow label="Amount:" value={info.amount} />
          <OrderDetailRow label="Payment Method:" value={info.paymentMethod} />
          <OrderDetailRow
            label="Delivery Status:"
            value={
              <OrdersStatusBadge
                label={info.deliveryStatus.label}
                color={info.deliveryStatus.color}
              />
            }
          />
          <OrderDetailRow label="Estimated Delivery Date:" value={info.estimatedDeliveryDate} />
        </div>
      </OrderDetailSection>

      <OrderDetailSection title="Items">
        <OrderDetailItems items={items} />
      </OrderDetailSection>

      <OrderDetailSection title="Timeline">
        <OrderDetailTimeline steps={timeline} />
      </OrderDetailSection>
    </div>
  );
}
