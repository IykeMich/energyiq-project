import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const FILTER_CHIPS = ['Role', 'Status'] as const;

export function EmployeeFilterBar() {
  return (
    <div className="bg-surface-card rounded-[18px] px-4 py-3 flex flex-wrap items-center gap-3">
      {/* Filter Label */}
      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10">
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </span>

        <span>Filter By:</span>
      </div>

      {/* Filter Chips */}
      {FILTER_CHIPS.map((label) => (
        <FilterChip key={label} label={label} />
      ))}

      {/* Push actions to right */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-10 rounded-full border border-brand px-5 text-sm font-medium text-brand transition-colors hover:bg-brand/5"
        >
          Manage Access
        </button>

        <button
          type="button"
          className="h-10 rounded-full bg-brand px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          + Invite Member
        </button>
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
}

function FilterChip({ label }: FilterChipProps) {
  return (
    <button
      type="button"
      className="flex h-8 items-center gap-1.5 rounded-full bg-foreground/10 px-3 text-xs font-medium text-foreground"
    >
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}