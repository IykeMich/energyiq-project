import { Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import type { TransferStatus } from '@/ui/pages/inventory/mocks';

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
    <div className="bg-surface-card rounded-[18px] px-4 py-3 flex flex-wrap items-center gap-3 self-start">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground mr-2">
        <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" />
        </span>
        Filter By:
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-7 px-3 rounded-full bg-foreground/10 text-foreground text-xs font-medium flex items-center gap-2"
          >
            {status === 'all' ? 'Status' : activeLabel}
            {status !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-36 rounded-[14px]">
          {STATUS_ITEMS.map((item) => (
            <DropdownMenuItem key={item.value} onClick={() => onStatusChange(item.value)}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DateChip label="From Date" value={fromDate} onChange={onFromDateChange} />
      <DateChip label="To Date" value={toDate} onChange={onToDateChange} />
    </div>
  );
}

interface DateChipProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

function DateChip({ label, value, onChange }: DateChipProps) {
  return (
    <label className="relative h-7 px-3 rounded-full bg-foreground/10 text-foreground text-xs font-medium flex items-center gap-2 cursor-pointer">
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
