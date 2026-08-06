import { DropdownMenu, DropdownMenuTrigger } from '@energyiq/ui';
import type { DistributorStatus, DistributorTier } from '@/ui/pages/distributor/mocks';
import {
  FilterBarContainer,
  FilterMenuContent,
  FilterMenuItem,
  FilterTrigger,
} from '@/ui/components/table/table-filter-bar';

const TIER_OPTIONS: DistributorTier[] = ['Bronze', 'Silver', 'Gold'];
const STATUS_OPTIONS: { value: DistributorStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'inactive', label: 'Inactive' },
];

interface DistributorFilterBarProps {
  selectedTier?: DistributorTier;
  onTierChange: (tier: DistributorTier | undefined) => void;
  selectedStatus?: DistributorStatus;
  onStatusChange: (status: DistributorStatus | undefined) => void;
}

export function DistributorFilterBar({
  selectedTier,
  onTierChange,
  selectedStatus,
  onStatusChange,
}: DistributorFilterBarProps) {
  const statusLabel = STATUS_OPTIONS.find((option) => option.value === selectedStatus)?.label ?? 'Status';

  return (
    <FilterBarContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={selectedTier ?? 'Tier'} isActive={Boolean(selectedTier)} />
        </DropdownMenuTrigger>
        <FilterMenuContent>
          <FilterMenuItem isSelected={!selectedTier} onClick={() => onTierChange(undefined)}>
            All Tiers
          </FilterMenuItem>
          {TIER_OPTIONS.map((tier) => (
            <FilterMenuItem key={tier} isSelected={tier === selectedTier} onClick={() => onTierChange(tier)}>
              {tier}
            </FilterMenuItem>
          ))}
        </FilterMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={statusLabel} isActive={Boolean(selectedStatus)} />
        </DropdownMenuTrigger>
        <FilterMenuContent>
          <FilterMenuItem isSelected={!selectedStatus} onClick={() => onStatusChange(undefined)}>
            All Statuses
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
