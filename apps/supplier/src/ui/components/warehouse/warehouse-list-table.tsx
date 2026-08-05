import { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Warehouse } from '@/ui/pages/inventory/mocks';
import { DefaultTable, type Column } from '@/ui/components/table/default-table';
import { WarehouseStockLevelCell } from './warehouse-stock-level-cell';

interface WarehouseListTableProps {
  rows: Warehouse[];
  isLoading?: boolean;
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
  onTransferHistory?: () => void;
}

export function WarehouseListTable({
  rows,
  isLoading,
  onEdit,
  onDelete,
  onTransferHistory,
}: WarehouseListTableProps) {
  const columns = useMemo<Column<Warehouse>[]>(
    () => [
      { header: 'Warehouse Name', accessor: 'name', sortable: true },
      { header: 'Location', accessor: 'location' },
      {
        header: 'Stock Level',
        accessor: 'stockLevelPercent',
        sortable: true,
        render: (value) => <WarehouseStockLevelCell percent={Number(value)} />,
      },
      { header: 'Last Updated', accessor: 'lastUpdated' },
      {
        header: 'Status',
        accessor: 'status',
        render: (value) => <StatusBadge status={value as Warehouse['status']} />,
      },
      {
        header: 'Action',
        accessor: 'id',
        width: '110px',
        render: (_value, row) => (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onEdit?.(row)}
              aria-label={`Edit ${row.name}`}
              className="tap-effect text-brand hover:opacity-80"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(row)}
              aria-label={`Delete ${row.name}`}
              className="tap-effect text-danger hover:opacity-80"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <DefaultTable<Warehouse>
      columns={columns}
      data={rows}
      entityLabel="Warehouses"
      isLoading={isLoading}
      noDataMessage="No warehouses match."
      getRowId={(row) => row.id}
      header={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 rounded-full bg-brand" />
            <h2 className="text-base font-semibold text-foreground">Warehouse List</h2>
          </div>
          <button
            type="button"
            onClick={onTransferHistory}
            className="tap-effect text-sm font-semibold text-brand underline"
          >
            Transfer History
          </button>
        </div>
      }
    />
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
