import { SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { EMPLOYEE_FILTERS } from './team-permissions-mocks';
import type { EmployeeFilter } from './team-permissions-mocks';

/** Map of filter id -> currently selected option (or null when unset). */
export type EmployeeFilterSelection = Record<string, string | null>;

interface TeamPermissionsFilterChipProps extends EmployeeFilter {
  selected: string | null;
  onSelect: (option: string | null) => void;
}

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
function TeamPermissionsFilterChip({
  label,
  options,
  selected,
  onSelect,
}: TeamPermissionsFilterChipProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap-effect flex items-center gap-1.5 rounded-[14px] border-[1.5px] border-[#616161B2] px-3 py-1 text-xs text-white"
        >
          {selected ?? label}
          <span className="h-1.5 w-1.5 rounded-full bg-[#FBC02D]" aria-hidden="true" />
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

interface TeamPermissionsFilterChipsProps {
  selection: EmployeeFilterSelection;
  onChange: (filterId: string, option: string | null) => void;
}

/** "Filter By:" label followed by the Role and Status dropdown chips. */
export function TeamPermissionsFilterChips({ selection, onChange }: TeamPermissionsFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      <span className="text-xs text-white">Filter By:</span>
      {EMPLOYEE_FILTERS.map((filter) => (
        <TeamPermissionsFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(option) => onChange(filter.id, option)}
        />
      ))}
    </div>
  );
}
