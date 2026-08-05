import { FilterBarContainer, FilterTrigger } from '@/ui/components/table/table-filter-bar';

const CHIPS = ['Status', 'Tier'] as const;

export function DistributorFilterBar() {
  return (
    <FilterBarContainer>
      {CHIPS.map((label) => (
        <FilterTrigger key={label} label={label} isActive={false} />
      ))}
    </FilterBarContainer>
  );
}
