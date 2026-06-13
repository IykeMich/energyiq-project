import { Check } from 'lucide-react';
import type { OrderLineItem } from './order-detail-mocks';

interface OrderDetailItemsProps {
  items: OrderLineItem[];
}

/** Order line items: name + unit price on the left, amount on the right. */
export function OrderDetailItems({ items }: OrderDetailItemsProps) {
  return (
    <div className="flex flex-col gap-5">
      {items.map((item) => (
        <div key={item.name} className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-foreground">{item.name}</span>
              {item.confirmed && <Check className="h-3 w-3 text-[#388E3C]" aria-hidden="true" />}
            </div>
            <span className="text-xs font-normal text-[#FFFFFFCC]">Unit Price: {item.unitPrice}</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{item.amount}</span>
        </div>
      ))}
    </div>
  );
}
