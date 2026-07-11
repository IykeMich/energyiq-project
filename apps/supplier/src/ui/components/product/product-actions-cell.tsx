import { Pencil, Trash2 } from 'lucide-react';
import type { product as productDomain } from '@energyiq/domain';

interface ProductActionsCellProps {
  product: productDomain.Product;
  onEdit?: (product: productDomain.Product) => void;
  onDelete?: (product: productDomain.Product) => void;
}

export function ProductActionsCell({ product, onEdit, onDelete }: ProductActionsCellProps) {
  return (
    <div className="flex items-center gap-4 h-full">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit?.(product);
        }}
        aria-label={`Edit ${product.name}`}
        className="tap-effect text-brand hover:opacity-80"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete?.(product);
        }}
        aria-label={`Delete ${product.name}`}
        className="tap-effect text-danger hover:opacity-80"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
