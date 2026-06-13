import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { ORDER_FILTERS } from './orders-mocks';
import type { OrderFilter } from './orders-mocks';

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
function OrdersFilterChip({ label, options }: OrderFilter) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap-effect flex items-center gap-1 rounded-[14px] border-[1.5px] border-[#616161B2] px-3 py-1 text-xs text-white"
        >
          {selected ?? label}
          <ChevronDown className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => setSelected(option)}
            className={option === selected ? 'text-[#FBC02D]' : undefined}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** "Filter By:" label followed by the category dropdown chips. */
export function OrdersFilterChips() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      <span className="text-xs text-white">Filter By:</span>
      {ORDER_FILTERS.map((filter) => (
        <OrdersFilterChip key={filter.id} {...filter} />
      ))}
    </div>
  );
}
