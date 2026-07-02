import { DefaultTable, type Column } from '../../table/default-table';
import { DISTRIBUTOR_PERFORMANCE_MOCK, type DistributorPerformanceRow } from './distributor-mocks';
import { ReportStatusBadge } from '../report-status-badge';

function ProgressBar({ value, variant }: { value: number; variant: 'success' | 'warning' | 'danger' }) {
  const color =
    variant === 'success' ? '#FBC02D' : variant === 'warning' ? '#F57C00' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#6161611A]">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-[#FAFAFA]">{value}%</span>
    </div>
  );
}

const getVariant = (value: number): 'success' | 'warning' | 'danger' => {
  if (value >= 80) return 'success';
  if (value >= 50) return 'warning';
  return 'danger';
};

const columns: Column<DistributorPerformanceRow>[] = [
  { header: 'Distributor Name', accessor: 'distributor_name' },
  { header: 'Location', accessor: 'location' },
  {
    header: 'Tier',
    accessor: 'tier',
    render: (value) => <ReportStatusBadge status={String(value).toLowerCase()}>{String(value)}</ReportStatusBadge>,
  },
  { header: 'Volume', accessor: 'volume' },
  {
    header: 'Risk Score',
    accessor: 'risk_score',
    render: (value) => <span className="text-[#FAFAFA]">{value}</span>,
  },
  {
    header: 'Payment Discipline',
    accessor: 'payment_discipline',
    render: (value) => <ProgressBar value={Number(value)} variant={getVariant(Number(value))} />,
  },
  {
    header: 'Sales Consistency',
    accessor: 'sales_consistency',
    render: (value) => <ProgressBar value={Number(value)} variant={getVariant(Number(value))} />,
  },
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
