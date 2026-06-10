import { useMemo } from 'react';
import { XCircle } from 'lucide-react';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { ComplaintsStatusBadge } from './complaints-status-badge';
import type { ComplaintRow } from './complaints-mocks';

function buildColumns(onCancel: (complaint: ComplaintRow) => void): Column<ComplaintRow>[] {
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
    {
      header: 'Action',
      accessor: 'id',
      align: 'center',
      render: (_value, row) => (
        <button
          type="button"
          onClick={(event) => {
            // Keep the cancel action from also opening the detail sheet.
            event.stopPropagation();
            onCancel(row);
          }}
          aria-label={`Cancel complaint ${row.id}`}
          className="tap-effect inline-flex items-center justify-center text-[#FBC02D]"
        >
          <XCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      ),
    },
  ];
}

interface ComplaintsTableProps {
  complaints: ComplaintRow[];
  onCancel: (complaint: ComplaintRow) => void;
  onRowClick: (complaint: ComplaintRow) => void;
}

export function ComplaintsTable({ complaints, onCancel, onRowClick }: ComplaintsTableProps) {
  const columns = useMemo(() => buildColumns(onCancel), [onCancel]);

  return (
    <DefaultTable
      columns={columns}
      data={complaints}
      itemsPerPage={8}
      getRowId={(row) => row.id}
      onRowClick={onRowClick}
      noDataMessage="No complaints match your filters"
    />
  );
}
