import { SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import {
  KYC_DOCUMENT_FILTERS,
  type KycDocumentFilter,
  type KycDocumentFilterSelection,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentsFilterChipProps extends KycDocumentFilter {
  selected: string | null;
  onSelect: (option: string | null) => void;
}

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
function KycDocumentsFilterChip({
  label,
  options,
  selected,
  onSelect,
}: KycDocumentsFilterChipProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="tap-effect inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#FFFFFF0A] px-4 py-1.5 text-xs font-medium text-gray-200"
        >
          {selected ?? label}
          <span className="h-1.5 w-1.5 rounded-full bg-[#FBC02D]" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
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

interface KycDocumentsFilterBarProps {
  selection: KycDocumentFilterSelection;
  onChange: (filterId: string, option: string | null) => void;
}

/** "Filter By" chip row above the Document Lists table — filters the table client-side. */
export function KycDocumentsFilterBar({ selection, onChange }: KycDocumentsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 text-sm text-gray-300">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" aria-hidden="true" />
        Filter By:
      </span>
      {KYC_DOCUMENT_FILTERS.map((filter) => (
        <KycDocumentsFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(option) => onChange(filter.id, option)}
        />
      ))}
    </div>
  );
}
