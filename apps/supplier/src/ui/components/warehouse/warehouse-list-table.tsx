import { Pencil, Trash2 } from 'lucide-react';
import type { Warehouse } from '@/ui/pages/inventory/mocks';
import { WarehouseStockLevelCell } from './warehouse-stock-level-cell';

const GRID = 'grid grid-cols-[1.5fr_1fr_1.4fr_1fr_0.9fr_0.7fr] items-center gap-4';
const ITEMS_PER_PAGE = 10;

interface WarehouseListTableProps {
  rows: Warehouse[];
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
  onTransferHistory?: () => void;
}

export function WarehouseListTable({ rows, onEdit, onDelete, onTransferHistory }: WarehouseListTableProps) {
  const total = rows.length;
  const showingText = total > 0 ? `Showing 1 to ${total} of ${total} Entries` : 'Showing 0 to 0 of 0 Entries';

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

      <div className="flex flex-col rounded-[16px] border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className={`${GRID} bg-[#1F1F1F] px-5 py-4`}>
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
          rows.map((warehouse, index) => (
            <div
              key={warehouse.id}
              className={`${GRID} px-5 py-4 ${index !== rows.length - 1 ? 'border-b border-border-subtle' : ''}`}
            >
              <span className="text-sm text-foreground">{warehouse.name}</span>
              <span className="text-sm text-foreground">{warehouse.location}</span>
              <WarehouseStockLevelCell percent={warehouse.stockLevelPercent} />
              <span className="text-sm text-foreground">{warehouse.lastUpdated}</span>
              <StatusBadge status={warehouse.status} />
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

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{showingText}</p>
        {total > ITEMS_PER_PAGE && (
          <div className="flex items-center gap-2">
            <PaginationButton disabled>Prev</PaginationButton>
            <PaginationButton active>1</PaginationButton>
            {total > ITEMS_PER_PAGE && <PaginationButton>2</PaginationButton>}
            <PaginationButton>Next</PaginationButton>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Warehouse['status'] }) {
  const isActive = status === 'active';
  return (
    <span
      className={`self-start inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isActive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function PaginationButton({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`h-8 min-w-[2rem] px-2 rounded-lg text-xs font-semibold transition-colors ${
        active
          ? 'bg-brand text-brand-foreground'
          : disabled
            ? 'bg-foreground/5 text-muted-foreground cursor-not-allowed'
            : 'bg-foreground/5 text-foreground hover:bg-foreground/10'
      }`}
    >
      {children}
    </button>
  );
}
