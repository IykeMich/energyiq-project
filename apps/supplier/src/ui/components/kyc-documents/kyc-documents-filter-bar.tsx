import { DropdownMenu, DropdownMenuTrigger } from '@energyiq/ui';
import type {
  KycDocumentFilter,
  KycDocumentFilterSelection,
} from './kyc-documents-types';
import {
  FilterBarContainer,
  FilterMenuContent,
  FilterMenuItem,
  FilterTrigger,
} from '@/ui/components/table/table-filter-bar';

interface KycDocumentsFilterChipProps extends KycDocumentFilter {
  selected: string | null;
  onSelect: (value: string | null) => void;
}

/** A single filter dropdown. Shows its category label until an option is picked. */
function KycDocumentsFilterChip({
  label,
  options,
  selected,
  onSelect,
}: KycDocumentsFilterChipProps) {
  const selectedLabel = options.find((option) => option.value === selected)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FilterTrigger label={selectedLabel ?? label} isActive={selected !== null} />
      </DropdownMenuTrigger>
      <FilterMenuContent>
        {options.map((option) => (
          <FilterMenuItem
            key={option.value}
            isSelected={option.value === selected}
            // Re-selecting the active option clears the filter.
            onClick={() => onSelect(option.value === selected ? null : option.value)}
          >
            {option.label}
          </FilterMenuItem>
        ))}
      </FilterMenuContent>
    </DropdownMenu>
  );
}

interface KycDocumentsFilterBarProps {
  filters: KycDocumentFilter[];
  selection: KycDocumentFilterSelection;
  onChange: (filterId: string, value: string | null) => void;
}

/** "Filter By" bar above the Document Lists table — filters sent to `GET /v1/document/overview`. */
export function KycDocumentsFilterBar({ filters, selection, onChange }: KycDocumentsFilterBarProps) {
  return (
    <FilterBarContainer>
      {filters.map((filter) => (
        <KycDocumentsFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(value) => onChange(filter.id, value)}
        />
      ))}
    </FilterBarContainer>
  );
}
