import { ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SheetTitle,
} from '@energyiq/ui';
import type { product as productDomain } from '@energyiq/domain';
import { useProductCategoriesQuery } from '@/hooks/use-product-categories';
import { ProductStatusBadge } from './product-status-badge';

const STATUS_OPTIONS: { value: productDomain.ProductStatusUpdateValue; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'scheduled', label: 'Scheduled' },
];

/** Contextual trigger label matching the design (e.g. "Pause Product" when active). */
function statusActionLabel(status?: string): string {
  if (status === 'active') return 'Pause Product';
  if (status === 'paused') return 'Activate Product';
  return 'Change Status';
}

interface ProductDetailsHeaderProps {
  product: productDomain.Product;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: productDomain.ProductStatusUpdateValue) => void;
  statusChanging?: boolean;
}

/** Fixed sheet header: title bar with close, then product identity and Edit / Change Status actions. */
export function ProductDetailsHeader({ product, onClose, onEdit, onStatusChange, statusChanging }: ProductDetailsHeaderProps) {
  const categoriesQuery = useProductCategoriesQuery();
  const categoryName = categoriesQuery.data?.find((category) => category.id === product.category_id)?.name;
  const skuLabel = categoryName ? `${product.sku}, ${categoryName}` : product.sku;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-5 w-1 rounded-full bg-[#FBC02D]" />
          <SheetTitle className="text-lg font-semibold text-[#FAFAFA]">Product Details</SheetTitle>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="tap-effect flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212] transition-opacity hover:opacity-90"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-[#FAFAFA]">{product.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[14px] bg-[#FBC02D1A] px-3 py-1 text-xs font-medium text-[#FBC02D]">
              {skuLabel}
            </span>
            {product.status && <ProductStatusBadge value={product.status} />}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="tap-effect h-8 rounded-full bg-[#FBC02D] px-4 text-xs font-semibold text-[#121212] transition-opacity hover:opacity-90"
          >
            Edit
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={statusChanging}
                className="tap-effect inline-flex h-8 items-center gap-1 rounded-full border border-[#FBC02D] px-4 text-xs font-semibold text-[#FBC02D] transition-colors hover:bg-[#FBC02D]/10 disabled:opacity-50"
              >
                {statusChanging ? 'Updating...' : statusActionLabel(product.status)}
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  disabled={product.status === option.value}
                  onSelect={() => onStatusChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
