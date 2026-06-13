import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const FILTER_CHIPS = ['Product', 'Payment methods', 'Today'] as const;
const BULK_CHIPS = ['Send Order', 'All Orders'] as const;

export function OrderFilterBar() {
  return (
    <div className="bg-surface-card rounded-[18px] px-4 py-3 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground mr-2">
        <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" />
        </span>
        Filter By:
      </div>

      {FILTER_CHIPS.map((label) => (
        <FilterChip key={label} label={label} />
      ))}

      <div className="flex-1" />

      {BULK_CHIPS.map((label) => (
        <FilterChip key={label} label={label} variant="primary" />
      ))}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  variant?: 'default' | 'primary';
}

function FilterChip({ label, variant = 'default' }: FilterChipProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      type="button"
      className={
        isPrimary
          ? 'h-7 px-3 rounded-full bg-brand/20 text-brand text-xs font-semibold flex items-center gap-1.5'
          : 'h-7 px-3 rounded-full bg-foreground/10 text-foreground text-xs font-medium flex items-center gap-1.5'
      }
    >
      {label}
      <ChevronDown className="w-3 h-3" />
    </button>
  );
}
