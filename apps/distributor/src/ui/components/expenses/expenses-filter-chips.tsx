import { useState } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import {
  EXPENSE_FILTERS,
  type ExpenseFilter,
} from './expenses-mocks';

function ExpenseFilterChip({
  label,
  options,
}: ExpenseFilter) {
  const [selected, setSelected] =
    useState<string | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 rounded-[14px] border border-[#616161B2] px-3 py-1 text-xs text-white">
          {selected ?? label}

          <ChevronDown className="h-3.5 w-3.5 text-[#FBC02D]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() =>
              setSelected(option)
            }
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ExpensesFilterChips() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" />
      </span>

      <span className="text-xs text-white">
        Filter By:
      </span>

      {EXPENSE_FILTERS.map((filter) => (
        <ExpenseFilterChip
          key={filter.id}
          {...filter}
        />
      ))}
    </div>
  );
}