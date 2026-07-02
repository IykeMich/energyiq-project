import { DefaultTable, type Column } from '../../table/default-table';
import { STOCK_MOVEMENT_MOCK, type StockMovementRow } from './inventory-mocks';
import { ReportStatusBadge } from '../report-status-badge';

const columns: Column<StockMovementRow>[] = [
  { header: 'SKU', accessor: 'sku' },
  { header: 'Product', accessor: 'product' },
  { header: 'Category', accessor: 'category' },
  { header: 'Type', accessor: 'type' },
  { header: 'Quantity', accessor: 'quantity' },
  { header: 'Distributor', accessor: 'distributor' },
  { header: 'Date', accessor: 'date' },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => {
      const status = String(value).toLowerCase();
      return (
        <ReportStatusBadge
          status={status === 'delivered' ? 'verified' : status === 'pending' ? 'pending' : 'active'}
        >
          {String(value)}
        </ReportStatusBadge>
      );
    },
  },
];

export function StockMovementTable() {
  return (
    <DefaultTable
      columns={columns}
      data={STOCK_MOVEMENT_MOCK}
      itemsPerPage={5}
      noDataMessage="No stock movement data available"
      getRowId={(row) => row.id}
    />
  );
}
