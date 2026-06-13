import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, type ColDef } from '@energyiq/ui';
import { ORDERS_MOCK, buildStatusCounts, type Order } from './mocks';
import { OrderStatusTabs, type OrderStatusFilter } from '@/ui/components/order/order-status-tabs';
import { OrderFilterBar } from '@/ui/components/order/order-filter-bar';
import { OrderStatusBadge } from '@/ui/components/order/order-status-badge';
import { OrderActionsCell } from '@/ui/components/order/order-actions-cell';

const NGN = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function OrderListPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');

  const counts = useMemo(() => buildStatusCounts(ORDERS_MOCK), []);
  const rowData = useMemo(
    () => (statusFilter === 'all' ? ORDERS_MOCK : ORDERS_MOCK.filter((o) => o.status === statusFilter)),
    [statusFilter],
  );

  const columnDefs = useMemo<ColDef<Order>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 110, flex: 0 },
      { field: 'date', headerName: 'Date', width: 130, flex: 0 },
      { field: 'distributor', headerName: 'Distributor', minWidth: 200 },
      { field: 'items', headerName: 'Items', width: 90, flex: 0, type: 'numericColumn' },
      {
        field: 'amountNGN',
        headerName: 'Amount (₦)',
        width: 150,
        flex: 0,
        type: 'numericColumn',
        valueFormatter: (p) => (typeof p.value === 'number' ? NGN.format(p.value) : ''),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 140,
        flex: 0,
        cellRenderer: (p: { value: Order['status'] }) => <OrderStatusBadge value={p.value} />,
      },
      {
        field: 'payment',
        headerName: 'Payment',
        width: 140,
        flex: 0,
        cellRenderer: (p: { value: Order['payment'] }) => <OrderStatusBadge value={p.value} />,
      },
      {
        headerName: 'Action',
        width: 130,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: Order }) => (
          <OrderActionsCell
            order={p.data}
            onView={(o) => navigate(`/${slug}/orders/${o.id}`)}
            onEdit={() => undefined}
            onDelete={() => undefined}
          />
        ),
      },
    ],
    [navigate, slug],
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
      </header>

      <OrderStatusTabs counts={counts} value={statusFilter} onChange={setStatusFilter} />

      <OrderFilterBar />

      <DataGrid<Order>
        rowData={rowData}
        columnDefs={columnDefs}
        rowHeight={56}
        className="h-[640px] bg-surface-card rounded-[18px] overflow-hidden"
      />
    </section>
  );
}

