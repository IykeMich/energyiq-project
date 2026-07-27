import { useMemo } from 'react';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { ComplaintsStatusBadge } from './complaints-status-badge';
import type { ComplaintRow } from './complaints-mocks';

function buildColumns(): Column<ComplaintRow>[] {
  return [
    { header: 'ID', accessor: 'id', sortable: true },
    {
      header: 'Complaint Type',
      accessor: 'type',
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[#FAFAFA]">{row.type}</span>
          <span className="text-xs text-[#FFFFFFCC]">{row.reference}</span>
        </div>
      ),
    },
    { header: 'Date Raised', accessor: 'dateRaised', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      render: (_value, row) => <ComplaintsStatusBadge status={row.status} />,
    },
    {
      header: 'SLA',
      accessor: 'sla',
      render: (value) => (
        <span className="text-sm text-[#FAFAFA]">{value as string}</span>
      ),
    },
  ];
}

interface ComplaintsTableProps {
  complaints: ComplaintRow[];
  isLoading?: boolean;
  onRowClick: (complaint: ComplaintRow) => void;
}

export function ComplaintsTable({ complaints, isLoading, onRowClick }: ComplaintsTableProps) {
  const columns = useMemo(() => buildColumns(), []);

  return (
    <DefaultTable
      columns={columns}
      data={complaints}
      itemsPerPage={8}
      isLoading={isLoading}
      getRowId={(row) => row.id}
      onRowClick={onRowClick}
      noDataMessage="No complaints match your filters"
    />
  );
}
