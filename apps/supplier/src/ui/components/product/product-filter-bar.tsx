import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { CircleChevronDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@energyiq/shared';
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

// `asChild` on DropdownMenuTrigger clones this element and merges its own onClick/onPointerDown/
// aria-*/ref props onto it — must forward them all to the underlying <button>, or the trigger never
// actually opens the dropdown.
const FilterTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; isActive: boolean }
>(({ label, isActive, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'tap-effect h-7 px-3 rounded-[14px] text-xs font-normal flex items-center gap-1 transition-colors',
        isActive
          ? 'bg-brand text-brand-foreground hover:opacity-90'
          : 'border-[1.5px] border-[#616161B2] text-foreground hover:bg-foreground/10',
        className,
      )}
      {...props}
    >
      {label}
      <CircleChevronDown className={cn('w-3 h-3', isActive ? 'text-brand-foreground' : 'text-brand')} />
    </button>
  );
});
FilterTrigger.displayName = 'FilterTrigger';

function FilterMenuItem({
  isSelected,
  children,
  onClick,
}: {
  isSelected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        'rounded-none px-3 py-1.5 text-[10px] font-medium',
        isSelected
          ? 'bg-brand text-brand-foreground focus:bg-brand focus:text-brand-foreground'
          : 'text-[#FAFAFA] focus:bg-foreground/10 focus:text-foreground',
      )}
    >
      {children}
    </DropdownMenuItem>
  );
}

const MENU_CONTENT_CLASSNAME = 'bg-[#212121] border-none rounded-[8px] p-0 shadow-lg overflow-hidden';

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
    <div className="self-start inline-flex flex-wrap items-center gap-2 bg-[#6161611A] px-[19px] py-[9px] m-2 rounded-[15px]!">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground mr-2">
        <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" />
        </span>
        Filter By:
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={selectedStatusLabel} isActive={selectedStatus !== undefined} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={MENU_CONTENT_CLASSNAME}>
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
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger label={selectedCategoryName} isActive={Boolean(selectedCategoryId)} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={MENU_CONTENT_CLASSNAME}>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
