import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { formatNaira, type CreateOrderDeliveryMethod } from './create-order-mocks';

interface CreateOrderDeliveryOptionProps {
  method: CreateOrderDeliveryMethod;
  selected: boolean;
  onSelect: () => void;
}

/** A selectable delivery-method card (radio behaviour, gold ring when active). */
export function CreateOrderDeliveryOption({
  method,
  selected,
  onSelect,
}: CreateOrderDeliveryOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'tap-effect flex items-start justify-between gap-4 rounded-[14px] border bg-[#FFFFFF0D] p-5 text-left transition-colors',
        selected ? 'border-[#FBC02D]' : 'border-[#FFFFFF1A] hover:border-[#FFFFFF33]',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
            selected ? 'border-[#FBC02D] bg-[#FBC02D] text-[#121212]' : 'border-[#FFFFFF4D]',
          )}
        >
          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{method.title}</span>
          <span className="text-xs text-[#FFFFFFCC]">{method.description}</span>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold text-foreground">
        {method.fee === 0 ? 'Free' : formatNaira(method.fee)}
      </span>
    </button>
  );
}
