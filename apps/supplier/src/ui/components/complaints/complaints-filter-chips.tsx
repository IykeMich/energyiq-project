import { Calendar, ChevronDown, Layers, Package, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { COMPLAINT_FILTERS } from './complaints-mocks';
import type { ComplaintFilter } from './complaints-mocks';

/** Map of filter id -> currently selected option (or null when unset). */
export type ComplaintFilterSelection = Record<string, string | null>;

/** Leading icon shown inside each filter chip, keyed by the filter id. */
const FILTER_ICON: Record<string, LucideIcon> = {
  'from-date': Calendar,
  'to-date': Calendar,
  type: Layers,
  product: Package,
  status: SlidersHorizontal,
  severity: ShieldAlert,
};

interface ComplaintsFilterChipProps extends ComplaintFilter {
  selected: string | null;
  onSelect: (option: string | null) => void;
}

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
function ComplaintsFilterChip({ id, label, options, selected, onSelect }: ComplaintsFilterChipProps) {
  const LeadingIcon = FILTER_ICON[id];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap-effect flex items-center gap-1.5 rounded-[14px] border-[1.5px] border-[#616161B2] px-3 py-1 text-xs text-white"
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

interface ComplaintsFilterChipsProps {
  selection: ComplaintFilterSelection;
  onChange: (filterId: string, option: string | null) => void;
}

/** "Filter By:" label followed by the category dropdown chips. */
export function ComplaintsFilterChips({ selection, onChange }: ComplaintsFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      <span className="text-xs text-white">Filter By:</span>
      {COMPLAINT_FILTERS.map((filter) => (
        <ComplaintsFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(option) => onChange(filter.id, option)}
        />
      ))}
    </div>
  );
}
