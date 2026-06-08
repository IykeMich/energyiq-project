import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { OrdersStatusBadge } from './orders-status-badge';
import { ORDER_STATUS_COLOR, PAYMENT_STATUS_COLOR } from './orders-mocks';
import type { OrderRow } from './orders-mocks';

const ROW_ACTIONS = ['View Details', 'Track Order', 'Download Invoice'];

function OrderRowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Order actions"
          className="tap-effect inline-flex h-8 w-8 items-center justify-center rounded-full text-[#FAFAFA] hover:bg-[#6161611A]"
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[170px]">
        {ROW_ACTIONS.map((action) => (
          <DropdownMenuItem key={action}>{action}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ORDER_COLUMNS: Column<OrderRow>[] = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Date', accessor: 'date', sortable: true },
  { header: 'Supplier', accessor: 'supplier', sortable: true },
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
    render: () => <OrderRowActions />,
  },
];

interface OrdersTableProps {
  orders: OrderRow[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <DefaultTable
      columns={ORDER_COLUMNS}
      data={orders}
      itemsPerPage={6}
      getRowId={(row) => row.id}
      noDataMessage="No orders match your filters"
    />
  );
}
