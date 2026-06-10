import { Minus, Plus } from 'lucide-react';

interface CreateOrderQuantityStepperProps {
  value: number;
  /** Unit suffix shown after the value, e.g. "L". */
  unitAbbrev: string;
  /** Increment/decrement amount and lower bound (the product MOQ). */
  step: number;
  onChange: (value: number) => void;
}

/**
 * Compact `−  100L  +` pill used in the products table. Clamps to the MOQ
 * (`step`) so the quantity can never drop below the minimum order quantity.
 */
export function CreateOrderQuantityStepper({
  value,
  unitAbbrev,
  step,
  onChange,
}: CreateOrderQuantityStepperProps) {
  const decrement = () => onChange(Math.max(step, value - step));
  const increment = () => onChange(value + step);

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[#FFFFFF33] px-2 py-1.5">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= step}
        aria-label="Decrease quantity"
        className="tap-effect flex h-6 w-6 items-center justify-center rounded-full bg-[#FFFFFF1A] text-foreground disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="min-w-[52px] text-center text-sm font-semibold text-foreground">
        {value.toLocaleString()}
        {unitAbbrev}
      </span>
      <button
        type="button"
        onClick={increment}
        aria-label="Increase quantity"
        className="tap-effect flex h-6 w-6 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
