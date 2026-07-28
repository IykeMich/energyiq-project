import { SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import type {
  KycDocumentFilter,
  KycDocumentFilterSelection,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentsFilterChipProps extends KycDocumentFilter {
  selected: string | null;
  onSelect: (value: string | null) => void;
}

/** A single pill-style filter dropdown. Shows its category label until an option is picked. */
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
        <button
          type="button"
          className="tap-effect inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#FFFFFF0A] px-4 py-1.5 text-xs font-medium text-gray-200"
        >
          {selectedLabel ?? label}
          <span className="h-1.5 w-1.5 rounded-full bg-[#FBC02D]" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            // Re-selecting the active option clears the filter.
            onSelect={() => onSelect(option.value === selected ? null : option.value)}
            className={option.value === selected ? 'text-[#FBC02D]' : undefined}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface KycDocumentsFilterBarProps {
  filters: KycDocumentFilter[];
  selection: KycDocumentFilterSelection;
  onChange: (filterId: string, value: string | null) => void;
}

/** "Filter By" chip row above the Document Lists table — filters sent to `GET /v1/document/overview`. */
export function KycDocumentsFilterBar({ filters, selection, onChange }: KycDocumentsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 text-sm text-gray-300">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" aria-hidden="true" />
        Filter By:
      </span>
      {filters.map((filter) => (
        <KycDocumentsFilterChip
          key={filter.id}
          {...filter}
          selected={selection[filter.id] ?? null}
          onSelect={(value) => onChange(filter.id, value)}
        />
      ))}
    </div>
  );
}
