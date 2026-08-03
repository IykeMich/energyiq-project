import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { PRODUCT_STATUS_OPTIONS } from './product-status-badge';

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
    <div className="self-start inline-flex flex-wrap items-center gap-3 bg-[#6161611A] pl-4 pr-8 py-4 m-2 rounded-[18px]!">
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
            className="tap-effect h-7 px-3 rounded-full bg-foreground/10 text-foreground text-xs font-medium flex items-center gap-2 hover:bg-foreground/20 transition-colors"
          >
            {selectedStatusLabel}
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onStatusChange(undefined)}>All Statuses</DropdownMenuItem>
          {PRODUCT_STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onStatusChange(option.value)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="tap-effect h-7 px-3 rounded-full bg-foreground/10 text-foreground text-xs font-medium flex items-center gap-2 hover:bg-foreground/20 transition-colors"
          >
            {selectedCategoryName}
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onCategoryChange(undefined)}>
            All Categories
          </DropdownMenuItem>
          {categories
            .filter((category) => category.id && category.name)
            .map((category) => (
              <DropdownMenuItem key={category.id} onClick={() => onCategoryChange(category.id)}>
                {category.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
