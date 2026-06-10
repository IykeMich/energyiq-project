import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Order } from '@/ui/pages/order/mocks';

interface OrderActionsCellProps {
  order: Order;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

export function OrderActionsCell({ order, onView, onEdit, onDelete }: OrderActionsCellProps) {
  return (
    <div className="flex items-center justify-center gap-3 h-full">
      <button
        type="button"
        onClick={() => onView?.(order)}
        aria-label={`View ${order.id}`}
        className="text-foreground hover:text-brand"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onEdit?.(order)}
        aria-label={`Edit ${order.id}`}
        className="text-foreground hover:text-brand"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete?.(order)}
        aria-label={`Delete ${order.id}`}
        className="text-foreground hover:text-danger"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
