import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import type { SalesSelectOption } from './sales-entry-mocks';

interface SalesEntryFormSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SalesSelectOption[];
}

/**
 * Labelled, full-width dropdown used in the Configure Export form. `alignItemWithTrigger`
 * is disabled so the list opens directly below the trigger and matches its width
 * (the EnergyIQ dropdown convention).
 */
export function SalesEntryFormSelect({
  label,
  value,
  onValueChange,
  options,
}: SalesEntryFormSelectProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[#FAFAFA]">{label}</span>
      <Select value={value} onValueChange={(next) => onValueChange(next ?? '')}>
        <SelectTrigger className="h-11 w-full rounded-lg border-[#616161B2] bg-transparent px-3.5 text-sm text-[#FAFAFA]">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
