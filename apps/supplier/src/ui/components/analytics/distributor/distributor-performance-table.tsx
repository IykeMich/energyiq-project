import { DefaultTable, type Column } from '../../table/default-table';
import { DISTRIBUTOR_PERFORMANCE_MOCK, type DistributorPerformanceRow } from './distributor-analytics-mocks';

const columns: Column<DistributorPerformanceRow>[] = [
  { header: 'Distributor', accessor: 'distributor' },
  { header: 'Tier', accessor: 'tier' },
  { header: 'Sales Volume', accessor: 'sales_volume' },
  { header: 'Order Frequency', accessor: 'order_frequency' },
  { header: 'Payment Discipline', accessor: 'payment_discipline' },
  { header: 'Complaint Rate', accessor: 'complaint_rate' },
];

export function DistributorPerformanceTable() {
  return (
    <DefaultTable
      columns={columns}
      data={DISTRIBUTOR_PERFORMANCE_MOCK}
      itemsPerPage={5}
      noDataMessage="No distributor performance data available"
      getRowId={(row) => row.id}
    />
  );
}
