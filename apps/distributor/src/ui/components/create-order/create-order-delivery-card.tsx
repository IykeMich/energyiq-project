import { Truck } from 'lucide-react';
import { CreateOrderCard } from './create-order-card';
import { CreateOrderDeliveryOption } from './create-order-delivery-option';
import { CreateOrderDeliveryContact } from './create-order-delivery-contact';
import {
  DELIVERY_METHODS,
  DELIVERY_NOTICE,
  type CreateOrderDeliveryContact as DeliveryContact,
} from './create-order-mocks';

interface CreateOrderDeliveryCardProps {
  selectedMethodId: string;
  onMethodChange: (methodId: string) => void;
  contact: DeliveryContact;
  onContactChange: (contact: DeliveryContact) => void;
}

/** "Delivery Method" section: option cards, contact details, and the SLA notice. */
export function CreateOrderDeliveryCard({
  selectedMethodId,
  onMethodChange,
  contact,
  onContactChange,
}: CreateOrderDeliveryCardProps) {
  return (
    <CreateOrderCard
      title="Delivery Method"
      subtitle="Choose how you'll receive your goods."
      icon={Truck}
    >
      <div role="radiogroup" aria-label="Delivery method" className="flex flex-col gap-4">
        {DELIVERY_METHODS.map((method) => (
          <CreateOrderDeliveryOption
            key={method.id}
            method={method}
            selected={method.id === selectedMethodId}
            onSelect={() => onMethodChange(method.id)}
          />
        ))}
      </div>

      <CreateOrderDeliveryContact contact={contact} onChange={onContactChange} />

      <p className="rounded-[14px] bg-[#FBC02D14] p-4 text-xs leading-relaxed text-[#FFFFFFCC]">
        {DELIVERY_NOTICE}
      </p>
    </CreateOrderCard>
  );
}
