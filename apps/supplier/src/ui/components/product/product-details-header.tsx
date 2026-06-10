import { X } from 'lucide-react';
import { SheetTitle } from '@energyiq/ui';
import type { Product } from '@/ui/pages/product/mocks';
import { ProductStatusBadge } from './product-status-badge';

interface ProductDetailsHeaderProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
  onPause: () => void;
}

/** Fixed sheet header: title bar with close, then product identity and Edit / Pause actions. */
export function ProductDetailsHeader({ product, onClose, onEdit, onPause }: ProductDetailsHeaderProps) {
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
          className="tap-effect flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-[#FAFAFA]">{product.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[14px] bg-[#FFFFFF1A] px-3 py-1 text-xs font-medium text-[#FAFAFA]">
              {product.sku} {product.category}
            </span>
            <ProductStatusBadge value={product.status} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="tap-effect h-8 rounded-full bg-[#FBC02D] px-4 text-xs font-semibold text-[#121212]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onPause}
            className="tap-effect h-8 rounded-full border border-[#FBC02D] px-4 text-xs font-semibold text-[#FBC02D]"
          >
            Pause Product
          </button>
        </div>
      </div>
    </div>
  );
}
