import { MapPin } from 'lucide-react';
import type { OrderDispatchDelivery } from '@/ui/pages/order/mocks';

interface OrderDeliveryDetailsCardProps {
  delivery: OrderDispatchDelivery;
}

/** "Delivery Details" card for the dispatch flow (recipient + address). */
export function OrderDeliveryDetailsCard({ delivery }: OrderDeliveryDetailsCardProps) {
  return (
    <section className="bg-surface-card rounded-[28px] p-7 flex flex-col gap-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <MapPin className="h-5 w-5 text-brand" aria-hidden="true" />
        Delivery Details
      </h2>
      <dl className="flex flex-col gap-4 text-sm text-foreground">
        <Row label="Recipient:" value={delivery.recipient} />
        <Row label="Address:" value={delivery.address} />
        <Row label="City:" value={delivery.city} />
        <Row label="Phone Number:" value={delivery.phone} />
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-foreground">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}
