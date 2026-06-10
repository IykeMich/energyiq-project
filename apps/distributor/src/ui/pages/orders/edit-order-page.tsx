import { useParams } from 'react-router-dom';
import { CreateOrderOverview } from '@/ui/components/create-order/create-order-overview';

/** Edit an existing order — the create-order form seeded in edit mode. */
export function EditOrderPage() {
  const { id = '' } = useParams<{ id: string }>();
  return <CreateOrderOverview mode="edit" orderId={id} />;
}
