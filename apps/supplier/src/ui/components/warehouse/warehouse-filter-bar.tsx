import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import type { WarehouseStatus } from '@/ui/pages/inventory/mocks';

export type WarehouseStatusFilter = 'all' | WarehouseStatus;

const STATUS_ITEMS: { value: WarehouseStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface WarehouseFilterBarProps {
  status: WarehouseStatusFilter;
  onStatusChange: (status: WarehouseStatusFilter) => void;
}

/** "Filter By: Status" chip row for the Warehouse Inventory page (controlled). */
export function WarehouseFilterBar({ status, onStatusChange }: WarehouseFilterBarProps) {
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
    </div>
  );
}
