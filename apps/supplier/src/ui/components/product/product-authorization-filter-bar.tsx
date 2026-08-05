import { DropdownMenu, DropdownMenuTrigger } from '@energyiq/ui';
import type { approval } from '@energyiq/domain';
import {
  FilterBarContainer,
  FilterMenuContent,
  FilterMenuItem,
  FilterTrigger,
} from '@/ui/components/table/table-filter-bar';

const STATUS_OPTIONS: { value: approval.ApprovalStatus; label: string }[] = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
];

interface ProductAuthorizationFilterBarProps {
  selectedStatus?: approval.ApprovalStatus;
  onStatusChange: (status: approval.ApprovalStatus | undefined) => void;
}

export function ProductAuthorizationFilterBar({
  selectedStatus,
  onStatusChange,
}: ProductAuthorizationFilterBarProps) {
  const statusLabel = STATUS_OPTIONS.find((option) => option.value === selectedStatus)?.label ?? 'All';

  return (
    <FilterBarContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={statusLabel} isActive={selectedStatus !== undefined} />
        </DropdownMenuTrigger>
        <FilterMenuContent>
          <FilterMenuItem isSelected={selectedStatus === undefined} onClick={() => onStatusChange(undefined)}>
            All
          </FilterMenuItem>
          {STATUS_OPTIONS.map((option) => (
            <FilterMenuItem
              key={option.value}
              isSelected={option.value === selectedStatus}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </FilterMenuItem>
          ))}
        </FilterMenuContent>
      </DropdownMenu>
    </FilterBarContainer>
  );
}
