import { useMemo } from 'react';
import type { AppDistributorComplaintListItem, GetV1DistributorComplaintListStatus } from '@energyiq/api/generated/schemas';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { ComplaintsStatusBadge } from './complaints-status-badge';

function buildColumns(): Column<AppDistributorComplaintListItem>[] {
  return [
    { header: 'ID', accessor: 'distributor_complaint_code', sortable: true },
    {
      header: 'Complaint Type',
      accessor: 'distributor_complaint_type_title',
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[#FAFAFA]">{row.distributor_complaint_type_title}</span>
          <span className="text-xs text-[#FFFFFFCC]">{row.distributor_complaint_type_subtitle}</span>
        </div>
      ),
    },
    { header: 'Date Raised', accessor: 'distributor_complaint_date_raised_label', sortable: true },
    {
      header: 'Status',
      accessor: 'distributor_complaint_status',
      render: (_value, row) => (
        <ComplaintsStatusBadge
          statusCode={(row.distributor_complaint_status_code ?? 'open') as GetV1DistributorComplaintListStatus}
          label={row.distributor_complaint_status}
        />
      ),
    },
    {
      header: 'SLA',
      accessor: 'distributor_complaint_sla_label',
      render: (value) => <span className="text-sm text-[#FAFAFA]">{value as string}</span>,
    },
    {
      header: 'Action',
      accessor: 'distributor_complaint_action_label',
      align: 'center',
      render: (value) => <span className="text-sm text-[#FBC02D]">{value as string}</span>,
    },
  ];
}

interface ComplaintsTableProps {
  complaints: AppDistributorComplaintListItem[];
  onRowClick: (complaint: AppDistributorComplaintListItem) => void;
}

export function ComplaintsTable({ complaints, onRowClick }: ComplaintsTableProps) {
  const columns = useMemo(() => buildColumns(), []);

  return (
    <DefaultTable
      columns={columns}
      data={complaints}
      itemsPerPage={8}
      getRowId={(row) => row.distributor_complaint_id ?? row.distributor_complaint_code ?? ''}
      onRowClick={onRowClick}
      noDataMessage="No complaints match your filters"
    />
  );
}
