import { Calendar, ChevronDown, Filter } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { ORDER_FILTERS } from './orders-mocks';
import type { OrderFilter } from './orders-mocks';

/** Map of filter id -> currently selected option (or null when unset). */
export type OrderFilterSelection = Record<string, string | null>;

/** Leading icon shown inside each filter chip, keyed by the filter id. */
const FILTER_ICON: Record<string, LucideIcon> = {
  date: Calendar,
};

interface OrdersFilterChipProps extends OrderFilter {
  selected: string | null;
  onSelect: (option: string | null) => void;
}

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
function OrdersFilterChip({ id, label, options, selected, onSelect }: OrdersFilterChipProps) {
  const LeadingIcon = FILTER_ICON[id];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap-effect flex items-center gap-1.5 rounded-[14px] border-[1.5px] border-[#616161B2] px-3 py-1 text-[10px] text-white"
        >
          {LeadingIcon && <LeadingIcon className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />}
          {selected ?? label}
          <ChevronDown className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            // Re-selecting the active option clears the filter.
            onSelect={() => onSelect(option === selected ? null : option)}
            className={option === selected ? 'text-[#FBC02D]' : undefined}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface OrdersFilterChipsProps {
  selection: OrderFilterSelection;
  onChange: (filterId: string, option: string | null) => void;
  /** Distributor names for the "Distributor" chip — sourced from the real distributor list. */
  distributorOptions: string[];
}

/** "Filter By:" label followed by the category dropdown chips. */
export function OrdersFilterChips({ selection, onChange, distributorOptions }: OrdersFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 self-start rounded-[10px] bg-[#6161611A] px-4 py-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <Filter className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      <span className="text-xs text-white">Filter By:</span>
      {orderedFilters(distributorOptions).map((filter) => (
        <OrdersFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(option) => onChange(filter.id, option)}
        />
      ))}
    </div>
  );
}

/** Static Date/Payment Status filters plus the dynamic Distributor filter, in the design's on-screen order. */
function orderedFilters(distributorOptions: string[]): OrderFilter[] {
  const byId = new Map(ORDER_FILTERS.map((filter) => [filter.id, filter]));
  return [
    byId.get('date')!,
    { id: 'distributor', label: 'Distributor', options: distributorOptions },
    byId.get('payment')!,
  ];
}
