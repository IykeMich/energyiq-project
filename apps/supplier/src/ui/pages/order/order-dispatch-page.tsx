import { useParams } from 'react-router-dom';
import { OrderDispatchFlow } from '@/ui/components/order/order-dispatch-flow';

export function OrderDispatchPage() {
  const { id = '' } = useParams<{ id: string }>();
  return <OrderDispatchFlow orderId={id} />;
}
