import { Pencil, Trash2 } from 'lucide-react';

export interface WarehouseAllocation {
  id: string;
  warehouseId: string;
  warehouseLabel: string;
  quantity: string;
  storageLocation: string;
}

interface ProductWarehouseAllocationRowProps {
  allocation: WarehouseAllocation;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

/** One row of the Inventory step's warehouse-allocation results table. */
export function ProductWarehouseAllocationRow({ allocation, onEdit, onRemove }: ProductWarehouseAllocationRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center px-3 py-3 border-b border-[#616161B2] last:border-b-0 text-sm text-foreground">
      <span className="truncate">{allocation.warehouseLabel}</span>
      <span className="truncate text-center">{allocation.quantity}L</span>
      <span className="truncate text-center">{allocation.storageLocation}</span>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(allocation.id)}
          aria-label="Edit warehouse allocation"
          className="tap-effect flex h-6 w-6 items-center justify-center text-brand hover:opacity-80"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(allocation.id)}
          aria-label="Remove warehouse allocation"
          className="tap-effect flex h-6 w-6 items-center justify-center text-brand hover:opacity-80"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
