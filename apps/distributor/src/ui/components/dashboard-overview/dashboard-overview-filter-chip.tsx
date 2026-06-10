import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import type { DashboardFilter } from './dashboard-overview-mocks';

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
export function DashboardOverviewFilterChip({ label, options }: DashboardFilter) {
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
