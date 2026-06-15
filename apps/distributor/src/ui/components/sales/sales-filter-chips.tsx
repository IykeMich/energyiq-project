import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { SALES_FILTERS } from './sales-mocks';
import type { SalesFilter } from './sales-mocks';

function SalesFilterChip({ label, options }: SalesFilter) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap-effect flex items-center gap-1 rounded-[14px] border border-[#616161B2] px-3 py-1 text-xs text-white"
        >
          {selected ?? label}

          <ChevronDown
            className="h-3.5 w-3.5 text-[#FBC02D]"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => setSelected(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SalesFilterChips() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal
          className="h-3.5 w-3.5 text-white"
          aria-hidden="true"
        />
      </span>

      {SALES_FILTERS.map((filter) => (
        <SalesFilterChip
          key={filter.id}
          {...filter}
        />
      ))}
    </div>
  );
}