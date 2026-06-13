import { CreateOrderField, ORDER_FIELD_CLASSES } from './create-order-field';
import type { CreateOrderDeliveryContact as DeliveryContact } from './create-order-mocks';

interface CreateOrderDeliveryContactProps {
  contact: DeliveryContact;
  onChange: (contact: DeliveryContact) => void;
}

/**
 * Editable delivery-contact fields: address (full width), then contact person +
 * email side by side. Controlled by the parent so the values persist with the order.
 */
export function CreateOrderDeliveryContact({ contact, onChange }: CreateOrderDeliveryContactProps) {
  return (
    <div className="flex flex-col gap-5 border-t border-[#FFFFFF1A] pt-6">
      <CreateOrderField label="Delivery Address:">
        <input
          type="text"
          value={contact.address}
          onChange={(event) => onChange({ ...contact, address: event.target.value })}
          className={ORDER_FIELD_CLASSES}
        />
      </CreateOrderField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <CreateOrderField label="Contact Person:">
          <input
            type="text"
            value={contact.contactPerson}
            onChange={(event) => onChange({ ...contact, contactPerson: event.target.value })}
            className={ORDER_FIELD_CLASSES}
          />
        </CreateOrderField>

        <CreateOrderField label="Email Address:">
          <input
            type="email"
            value={contact.email}
            onChange={(event) => onChange({ ...contact, email: event.target.value })}
            className={ORDER_FIELD_CLASSES}
          />
        </CreateOrderField>
      </div>
    </div>
  );
}
