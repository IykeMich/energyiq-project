import { Calendar, ChevronDown, ListFilter, SlidersHorizontal, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { AUDIT_FILTERS } from './audit-logs-mocks';
import type { AuditFilter } from './audit-logs-mocks';

/** Map of filter id -> currently selected option (or null when unset). */
export type AuditFilterSelection = Record<string, string | null>;

/** Leading icon shown inside each filter chip, keyed by the filter id. */
const FILTER_ICON: Record<string, LucideIcon> = {
  event: ListFilter,
  user: Users,
  'from-date': Calendar,
  'to-date': Calendar,
};

interface AuditLogsFilterChipProps extends AuditFilter {
  selected: string | null;
  onSelect: (option: string | null) => void;
}

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
function AuditLogsFilterChip({
  id,
  label,
  options,
  selected,
  onSelect,
}: AuditLogsFilterChipProps) {
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
            // Re-selecting the active option clears the filter (back to the "All …" default).
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

interface AuditLogsFilterChipsProps {
  selection: AuditFilterSelection;
  onChange: (filterId: string, option: string | null) => void;
}

/** "Filter By:" label followed by the category dropdown chips. */
export function AuditLogsFilterChips({ selection, onChange }: AuditLogsFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      <span className="text-xs text-white">Filter By:</span>
      {AUDIT_FILTERS.map((filter) => (
        <AuditLogsFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(option) => onChange(filter.id, option)}
        />
      ))}
    </div>
  );
}
