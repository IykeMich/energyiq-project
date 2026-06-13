import { useMemo } from 'react';
import { XCircle } from 'lucide-react';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { ComplaintsStatusBadge } from './complaints-status-badge';
import { COMPLAINT_STATUS_COLOR, SEVERITY_COLOR } from './complaints-mocks';
import type { ComplaintRow } from './complaints-mocks';

function buildColumns(onCancel: (complaint: ComplaintRow) => void): Column<ComplaintRow>[] {
  return [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Distributor', accessor: 'distributor', sortable: true },
    { header: 'Order No', accessor: 'orderNo', sortable: true },
    { header: 'Product', accessor: 'product', sortable: true },
    { header: 'Issue Type', accessor: 'issueType', sortable: true },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (_value, row) => (
        <ComplaintsStatusBadge label={row.severity} color={SEVERITY_COLOR[row.severity]} />
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (_value, row) => (
        <ComplaintsStatusBadge label={row.status} color={COMPLAINT_STATUS_COLOR[row.status]} />
      ),
    },
    { header: 'Submitted', accessor: 'submitted', sortable: true },
    {
      header: 'Action',
      accessor: 'id',
      align: 'center',
      render: (_value, row) => (
        <button
          type="button"
          // Stop the click bubbling to the row navigation handler.
          onClick={(event) => {
            event.stopPropagation();
            onCancel(row);
          }}
          aria-label="Cancel complaint"
          className="tap-effect text-[#FBC02D]"
        >
          <XCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      ),
    },
  ];
}

interface ComplaintsTableProps {
  complaints: ComplaintRow[];
  isLoading?: boolean;
  onSelect: (complaint: ComplaintRow) => void;
  onCancel: (complaint: ComplaintRow) => void;
}

export function ComplaintsTable({ complaints, isLoading, onSelect, onCancel }: ComplaintsTableProps) {
  const columns = useMemo(() => buildColumns(onCancel), [onCancel]);

  return (
    <DefaultTable
      columns={columns}
      data={complaints}
      itemsPerPage={6}
      isLoading={isLoading}
      getRowId={(row, index) => `${row.id}-${row.orderNo}-${index}`}
      onRowClick={onSelect}
      noDataMessage="No complaints match your filters"
    />
  );
}
