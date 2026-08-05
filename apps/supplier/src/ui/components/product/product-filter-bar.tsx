import { DropdownMenu, DropdownMenuTrigger } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { PRODUCT_STATUS_OPTIONS } from './product-status-badge';
import {
  FilterBarContainer,
  FilterMenuContent,
  FilterMenuItem,
  FilterTrigger,
} from '@/ui/components/table/table-filter-bar';

interface ProductFilterBarProps {
  categories: product.ProductCategory[];
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  selectedStatus?: product.ProductStatus;
  onStatusChange: (status: product.ProductStatus | undefined) => void;
}

export function ProductFilterBar({
  categories,
  selectedCategoryId,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: ProductFilterBarProps) {
  const selectedCategoryName =
    categories.find((category) => category.id === selectedCategoryId)?.name ?? 'Category';
  const selectedStatusLabel =
    PRODUCT_STATUS_OPTIONS.find((option) => option.value === selectedStatus)?.label ?? 'Status';

  return (
    <FilterBarContainer className="m-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={selectedStatusLabel} isActive={selectedStatus !== undefined} />
        </DropdownMenuTrigger>
        <FilterMenuContent>
          <FilterMenuItem isSelected={selectedStatus === undefined} onClick={() => onStatusChange(undefined)}>
            All Statuses
          </FilterMenuItem>
          {PRODUCT_STATUS_OPTIONS.map((option) => (
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={selectedCategoryName} isActive={Boolean(selectedCategoryId)} />
        </DropdownMenuTrigger>
        <FilterMenuContent>
          <FilterMenuItem isSelected={!selectedCategoryId} onClick={() => onCategoryChange(undefined)}>
            All Categories
          </FilterMenuItem>
          {categories
            .filter((category) => category.id && category.name)
            .map((category) => (
              <FilterMenuItem
                key={category.id}
                isSelected={category.id === selectedCategoryId}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </FilterMenuItem>
            ))}
        </FilterMenuContent>
      </DropdownMenu>
    </FilterBarContainer>
  );
}
