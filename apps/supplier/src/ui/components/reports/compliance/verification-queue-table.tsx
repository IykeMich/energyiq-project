import { Pencil, Trash2 } from 'lucide-react';
import { DefaultTable, type Column } from '../../table/default-table';
import { VERIFICATION_QUEUE_MOCK, type VerificationQueueRow } from './compliance-mocks';
import { ReportStatusBadge } from '../report-status-badge';

const columns: Column<VerificationQueueRow>[] = [
  { header: 'Distributor', accessor: 'distributor' },
  { header: 'Document Type', accessor: 'document_type' },
  { header: 'Upload Date', accessor: 'upload_date' },
  { header: 'Expiry Date', accessor: 'expiry_date' },
  { header: 'Verified by', accessor: 'verified_by' },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => {
      const status = String(value).toLowerCase();
      return (
        <ReportStatusBadge
          status={status === 'verified' ? 'verified' : status === 'expiring soon' ? 'expiring-soon' : 'pending'}
        >
          {String(value)}
        </ReportStatusBadge>
      );
    },
  },
  {
    header: 'Action',
    accessor: 'id',
    render: () => (
      <div className="flex items-center gap-2">
        <button type="button" className="tap-effect text-[#FBC02D] hover:text-[#FBC02D]/80">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" className="tap-effect text-red-500 hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

export function VerificationQueueTable() {
  return (
    <DefaultTable
      columns={columns}
      data={VERIFICATION_QUEUE_MOCK}
      itemsPerPage={5}
      noDataMessage="No verification queue data available"
      getRowId={(row) => row.id}
    />
  );
}
