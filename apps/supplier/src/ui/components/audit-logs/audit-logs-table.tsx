import { useMemo } from 'react';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { AuditLogsActionCell } from './audit-logs-action-cell';
import { AuditLogsStatusBadge } from './audit-logs-status-badge';
import { AuditLogsUserCell } from './audit-logs-user-cell';
import { AUDIT_STATUS_COLOR } from './audit-logs-mocks';
import type { AuditLogRow } from './audit-logs-mocks';

// Gold-tinted header border to match the design (overrides DefaultTable's grey default).
const HEADER_CLASS = 'border-[#FBC02D80]';

function buildColumns(): Column<AuditLogRow>[] {
  return [
    {
      header: 'User',
      accessor: 'user',
      headerClassName: HEADER_CLASS,
      render: (_value, row) => <AuditLogsUserCell user={row.user} role={row.role} />,
    },
    {
      header: 'Action',
      accessor: 'action',
      headerClassName: HEADER_CLASS,
      render: (_value, row) => (
        <AuditLogsActionCell action={row.action} description={row.description} />
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      headerClassName: HEADER_CLASS,
      render: (_value, row) => (
        <AuditLogsStatusBadge label={row.status} color={AUDIT_STATUS_COLOR[row.status]} />
      ),
    },
    { header: 'Timestamp', accessor: 'timestamp', headerClassName: HEADER_CLASS, sortable: true },
  ];
}

interface AuditLogsTableProps {
  logs: AuditLogRow[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const columns = useMemo(() => buildColumns(), []);

  return (
    <DefaultTable
      columns={columns}
      data={logs}
      itemsPerPage={11}
      getRowId={(row) => row.id}
      noDataMessage="No log entries match your filters"
    />
  );
}
