import { Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import type { TransferStatus } from '@/ui/pages/inventory/mocks';
import {
  FilterBarContainer,
  FilterMenuContent,
  FilterMenuItem,
  FilterTrigger,
} from '@/ui/components/table/table-filter-bar';

export type TransferStatusFilter = 'all' | TransferStatus;

const STATUS_ITEMS: { value: TransferStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

interface TransferHistoryFilterBarProps {
  status: TransferStatusFilter;
  fromDate: string;
  toDate: string;
  onStatusChange: (status: TransferStatusFilter) => void;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export function TransferHistoryFilterBar({
  status,
  fromDate,
  toDate,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
}: TransferHistoryFilterBarProps) {
  const activeLabel = STATUS_ITEMS.find((item) => item.value === status)?.label ?? 'Status';

  return (
    <FilterBarContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={activeLabel} isActive={status !== 'all'} />
        </DropdownMenuTrigger>
        <FilterMenuContent>
          {STATUS_ITEMS.map((item) => (
            <FilterMenuItem
              key={item.value}
              isSelected={item.value === status}
              onClick={() => onStatusChange(item.value)}
            >
              {item.label}
            </FilterMenuItem>
          ))}
        </FilterMenuContent>
      </DropdownMenu>

      <DateChip label="From Date" value={fromDate} onChange={onFromDateChange} />
      <DateChip label="To Date" value={toDate} onChange={onToDateChange} />
    </FilterBarContainer>
  );
}

interface DateChipProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

/** Date-range picker styled to match `FilterTrigger`'s pill (not a plain dropdown filter). */
function DateChip({ label, value, onChange }: DateChipProps) {
  return (
    <label
      className={cn(
        'tap-effect relative h-7 px-3 rounded-[14px] text-xs font-normal flex items-center gap-1.5 cursor-pointer transition-colors',
        'border-[1.5px] border-[#616161B2] text-foreground hover:bg-foreground/10',
      )}
    >
      <Calendar className="w-3 h-3 text-brand" />
      {value || label}
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>
  );
}
