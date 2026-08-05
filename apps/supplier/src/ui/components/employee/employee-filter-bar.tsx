import { FilterBarContainer, FilterTrigger } from '@/ui/components/table/table-filter-bar';

const FILTER_CHIPS = ['Role', 'Status'] as const;

export function EmployeeFilterBar() {
  return (
    <FilterBarContainer className="w-full">
      {FILTER_CHIPS.map((label) => (
        <FilterTrigger key={label} label={label} isActive={false} />
      ))}

      <div className="flex-1" />

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
    </FilterBarContainer>
  );
}
