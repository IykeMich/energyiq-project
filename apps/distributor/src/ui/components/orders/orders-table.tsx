import { useMemo } from 'react';
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

function OrderRowActions({ onViewDetails }: { onViewDetails: () => void }) {
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
        <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
        <DropdownMenuItem>Track Order</DropdownMenuItem>
        <DropdownMenuItem>Download Invoice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns(onViewDetails: (order: OrderRow) => void): Column<OrderRow>[] {
  return [
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
      render: (_value, row) => <OrderRowActions onViewDetails={() => onViewDetails(row)} />,
    },
  ];
}

interface OrdersTableProps {
  orders: OrderRow[];
  onViewDetails: (order: OrderRow) => void;
}

export function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
  const columns = useMemo(() => buildColumns(onViewDetails), [onViewDetails]);

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
