import { useParams } from 'react-router-dom';
import { OrderDetailOverview } from '@/ui/components/order-detail/order-detail-overview';
import { getOrderDetail } from '@/ui/components/order-detail/order-detail-mocks';

export function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const data = getOrderDetail(id);

  return <OrderDetailOverview data={data} />;
}
