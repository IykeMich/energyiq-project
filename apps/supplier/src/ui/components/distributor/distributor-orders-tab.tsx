import type { DistributorDetail } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsKycKpis } from './distributor-details-kyc-kpis';
import { DistributorOrderRow } from './distributor-order-row';

/** Orders tab — compliance KPIs above the distributor's recent orders. */
export function DistributorOrdersTab({ detail }: { detail: DistributorDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <DistributorDetailsKycKpis kyc={detail.kyc} />
      <div className="flex flex-col gap-3">
        {detail.orders.map((order) => (
          <DistributorOrderRow key={order.ref} order={order} />
        ))}
      </div>
    </div>
  );
}
