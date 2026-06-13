import { X } from 'lucide-react';
import { OrdersStatusBadge } from '../orders/orders-status-badge';
import { CreateOrderQuantityStepper } from './create-order-quantity-stepper';
import { formatNaira, SUCCESS_HUE, type CreateOrderProductOption } from './create-order-mocks';

interface CreateOrderProductRowProps {
  product: CreateOrderProductOption;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onRemove: () => void;
}

/** One line in the products table: details, unit price, quantity stepper, sub-total. */
export function CreateOrderProductRow({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CreateOrderProductRowProps) {
  const subtotal = product.unitPrice * quantity;

  return (
    <div className="grid grid-cols-1 items-center gap-4 rounded-[14px] bg-[#FFFFFF0D] p-4 lg:grid-cols-[2fr_1fr_auto_1fr]">
      {/* Product */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{product.name}</span>
        <span className="text-xs text-[#FFFFFFCC]">
          {product.code} · {formatNaira(product.unitPrice)} per {product.unit}
        </span>
        {product.available && (
          <span className="mt-1 w-fit">
            <OrdersStatusBadge label="Available" color={SUCCESS_HUE} />
          </span>
        )}
      </div>

      {/* Unit Price */}
      <div className="flex flex-col gap-0.5 lg:items-start">
        <span className="text-sm font-semibold text-foreground">
          {formatNaira(product.unitPrice)}.00
        </span>
        {product.goldDiscount && <span className="text-xs text-[#FBC02D]">Gold: 10% off</span>}
      </div>

      {/* Quantity */}
      <CreateOrderQuantityStepper
        value={quantity}
        unitAbbrev={product.unitAbbrev}
        step={product.moq}
        onChange={onQuantityChange}
      />

      {/* Sub-Total + remove */}
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <span className="text-sm font-semibold text-foreground">{formatNaira(subtotal)}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${product.name}`}
          className="tap-effect flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A] text-[#FFFFFFCC] hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
