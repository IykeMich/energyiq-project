import { useMemo } from 'react';
import { Pencil, XCircle } from 'lucide-react';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { OrdersStatusBadge } from './orders-status-badge';
import { ORDER_STATUS_COLOR, PAYMENT_STATUS_COLOR } from './orders-mocks';
import type { OrderRow } from './orders-mocks';

interface OrderRowActionsProps {
  onEdit: () => void;
  onCancel: () => void;
}

/** Per-row edit + cancel controls shown in the Action column. */
function OrderRowActions({ onEdit, onCancel }: OrderRowActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit order"
        className="tap-effect text-[#FBC02D]"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel order"
        className="tap-effect text-[#FBC02D]"
      >
        <XCircle className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

function buildColumns(
  onEdit: (order: OrderRow) => void,
  onCancel: (order: OrderRow) => void,
): Column<OrderRow>[] {
  return [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Distributor', accessor: 'distributor', sortable: true },
    { header: 'Items', accessor: 'items', align: 'center', sortable: true },
    {
      header: 'Amount (₦)',
      accessor: 'amount',
      sortable: true,
      render: (value) => (value as number).toLocaleString('en-NG'),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (_value, row) => (
        <OrdersStatusBadge label={row.status} color={ORDER_STATUS_COLOR[row.status]} />
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment',
      render: (_value, row) => (
        <OrdersStatusBadge label={row.payment} color={PAYMENT_STATUS_COLOR[row.payment]} />
      ),
    },
    {
      header: 'Action',
      accessor: 'id',
      align: 'center',
      render: (_value, row) => (
        <OrderRowActions onEdit={() => onEdit(row)} onCancel={() => onCancel(row)} />
      ),
    },
  ];
}

interface OrdersTableProps {
  orders: OrderRow[];
  onEdit: (order: OrderRow) => void;
  onCancel: (order: OrderRow) => void;
}

export function OrdersTable({ orders, onEdit, onCancel }: OrdersTableProps) {
  const columns = useMemo(() => buildColumns(onEdit, onCancel), [onEdit, onCancel]);

  return (
    <DefaultTable
      columns={columns}
      data={orders}
      itemsPerPage={6}
      getRowId={(row) => row.id}
      noDataMessage="No orders match your filters"
    />
  );
}
