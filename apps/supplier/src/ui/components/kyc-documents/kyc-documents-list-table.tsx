import { useMemo } from 'react';
import { Avatar, AvatarFallback } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { DefaultTable, type Column } from '../table/default-table';
import { KycDocumentsTierBadge } from './kyc-documents-tier-badge';
import { KycDocumentsStatusBadge } from './kyc-documents-status-badge';
import { type DocumentListRow } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

function buildColumns(onAction: (row: DocumentListRow) => void): Column<DocumentListRow>[] {
  return [
    {
      header: 'Distributor',
      accessor: 'distributor',
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            aria-label={`Select ${row.distributor}`}
            onClick={(event) => event.stopPropagation()}
            className="h-4 w-4 shrink-0 cursor-pointer accent-[#FBC02D]"
          />
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-[#FBC02D] text-[10px] text-[#121212]">
              {getInitials(row.distributor)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[#FAFAFA]">{row.distributor}</span>
        </div>
      ),
    },
    {
      header: 'Tier',
      accessor: 'tier',
      render: (_value, row) => <KycDocumentsTierBadge tier={row.tier} />,
    },
    { header: 'Documents', accessor: 'documents' },
    { header: 'Last Updated', accessor: 'lastUpdated', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      render: (_value, row) => <KycDocumentsStatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (_value, row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAction(row);
          }}
          className="tap-effect text-sm font-medium text-[#FBC02D] underline-offset-2 hover:underline"
        >
          {row.status === 'In Review' ? 'Review' : 'View'}
        </button>
      ),
    },
  ];
}

interface KycDocumentsListTableProps {
  rows: DocumentListRow[];
  isLoading?: boolean;
  /** Message shown when there are no rows (e.g. no filter matches vs. no data). */
  noDataMessage?: string;
  onAction: (row: DocumentListRow) => void;
}

/** "Document Lists" card: the full distributor-documents table with status + tier badges. */
export function KycDocumentsListTable({
  rows,
  isLoading,
  noDataMessage = 'No distributor documents yet',
  onAction,
}: KycDocumentsListTableProps) {
  const columns = useMemo(() => buildColumns(onAction), [onAction]);

  return (
    <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />
        <h2 className="text-base font-semibold text-[#FAFAFA]">Document Lists</h2>
      </div>
      <DefaultTable
        columns={columns}
        data={rows}
        itemsPerPage={7}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        noDataMessage={noDataMessage}
      />
    </div>
  );
}
