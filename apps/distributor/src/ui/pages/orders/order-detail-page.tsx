import { useParams } from 'react-router-dom';
import { useOrderQuery } from '@/hooks/use-orders';
import { OrderDetailOverview } from '@/ui/components/order-detail/order-detail-overview';
import { toOrderDetailData } from '@/ui/components/order-detail/order-detail-mapper';

export function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrderQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-[#FAFAFA]">Loading order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-red-500">Failed to load order details.</p>
      </div>
    );
  }

  return <OrderDetailOverview data={toOrderDetailData(order)} orderId={order.supplier_order_id ?? id} />;
}
