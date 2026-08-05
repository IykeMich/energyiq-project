import { DropdownMenu, DropdownMenuTrigger } from '@energyiq/ui';
import type { WarehouseStatus } from '@/ui/pages/inventory/mocks';
import {
  FilterBarContainer,
  FilterMenuContent,
  FilterMenuItem,
  FilterTrigger,
} from '@/ui/components/table/table-filter-bar';

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

/** "Filter By: Status" bar for the Warehouse Inventory page (controlled). */
export function WarehouseFilterBar({ status, onStatusChange }: WarehouseFilterBarProps) {
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
    </FilterBarContainer>
  );
}
