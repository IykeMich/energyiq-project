import { Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../mocks';

interface ProductActionsCellProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductActionsCell({ product, onEdit, onDelete }: ProductActionsCellProps) {
  return (
    <div className="flex items-center gap-4 h-full">
      <button
        type="button"
        onClick={() => onEdit?.(product)}
        aria-label={`Edit ${product.name}`}
        className="text-brand hover:opacity-80"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete?.(product)}
        aria-label={`Delete ${product.name}`}
        className="text-danger hover:opacity-80"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
