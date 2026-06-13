import { Pencil, Trash2 } from 'lucide-react';
import type { Warehouse } from '@/ui/pages/inventory/mocks';
import { ProductStatusBadge } from '@/ui/components/product/product-status-badge';
import { WarehouseStockLevelCell } from './warehouse-stock-level-cell';

const GRID = 'grid grid-cols-[1.4fr_1fr_1.4fr_1fr_0.9fr_0.7fr] items-center gap-4';

interface WarehouseListTableProps {
  rows: Warehouse[];
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
  onTransferHistory?: () => void;
}

export function WarehouseListTable({ rows, onEdit, onDelete, onTransferHistory }: WarehouseListTableProps) {
  return (
    <div className="bg-surface-card rounded-[18px] p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-5 rounded-full bg-brand" />
          <h2 className="text-base font-semibold text-foreground">Warehouse List</h2>
        </div>
        <button
          type="button"
          onClick={onTransferHistory}
          className="text-sm font-semibold text-brand underline"
        >
          Transfer History
        </button>
      </div>

      <div className="flex flex-col">
        {/* Header */}
        <div className={`${GRID} rounded-[16px] border border-brand/30 bg-brand/10 px-5 py-4`}>
          <span className="text-sm font-semibold text-foreground">Warehouse Name</span>
          <span className="text-sm font-semibold text-foreground">Location</span>
          <span className="text-sm font-semibold text-foreground">Stock Level</span>
          <span className="text-sm font-semibold text-foreground">Last Updated</span>
          <span className="text-sm font-semibold text-foreground">Status</span>
          <span className="text-sm font-semibold text-foreground">Action</span>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No warehouses match.</p>
        ) : (
          rows.map((warehouse) => (
            <div key={warehouse.id} className={`${GRID} px-5 py-4`}>
              <span className="text-sm text-foreground">{warehouse.name}</span>
              <span className="text-sm text-foreground">{warehouse.location}</span>
              <WarehouseStockLevelCell percent={warehouse.stockLevelPercent} />
              <span className="text-sm text-foreground">{warehouse.lastUpdated}</span>
              <ProductStatusBadge value={warehouse.status} />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onEdit?.(warehouse)}
                  aria-label={`Edit ${warehouse.name}`}
                  className="text-brand hover:opacity-80"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(warehouse)}
                  aria-label={`Delete ${warehouse.name}`}
                  className="text-danger hover:opacity-80"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {rows.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing 1 to {rows.length} of {rows.length}
        </p>
      )}
    </div>
  );
}
