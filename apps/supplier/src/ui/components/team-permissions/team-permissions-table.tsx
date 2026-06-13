import { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { TeamPermissionsNoResults } from './team-permissions-no-results';
import { TeamPermissionsStatusBadge } from './team-permissions-status-badge';
import { EMPLOYEE_STATUS_COLOR } from './team-permissions-mocks';
import type { EmployeeRow } from './team-permissions-mocks';

function buildColumns(
  onEdit: (employee: EmployeeRow) => void,
  onDelete: (employee: EmployeeRow) => void,
): Column<EmployeeRow>[] {
  return [
    {
      header: 'Employee Name',
      accessor: 'name',
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatarUrl} alt={row.name} />
            <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#FAFAFA]">{row.name}</span>
            <span className="text-xs text-[#FFFFFFCC]">{row.email}</span>
          </div>
        </div>
      ),
    },
    { header: 'Role', accessor: 'role', sortable: true },
    { header: 'Department', accessor: 'department', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      render: (_value, row) => (
        <TeamPermissionsStatusBadge label={row.status} color={EMPLOYEE_STATUS_COLOR[row.status]} />
      ),
    },
    { header: 'Last Active', accessor: 'lastActive', sortable: true },
    {
      header: 'Action',
      accessor: 'id',
      render: (_value, row) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            // Stop the click bubbling to the row handler.
            onClick={(event) => {
              event.stopPropagation();
              onEdit(row);
            }}
            aria-label={`Edit ${row.name}`}
            className="tap-effect text-[#FBC02D]"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(row);
            }}
            aria-label={`Delete ${row.name}`}
            className="tap-effect text-[#D30A0A]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];
}

interface TeamPermissionsTableProps {
  employees: EmployeeRow[];
  isLoading?: boolean;
  onSelect: (employee: EmployeeRow) => void;
  onEdit: (employee: EmployeeRow) => void;
  onDelete: (employee: EmployeeRow) => void;
}

export function TeamPermissionsTable({
  employees,
  isLoading,
  onSelect,
  onEdit,
  onDelete,
}: TeamPermissionsTableProps) {
  const columns = useMemo(() => buildColumns(onEdit, onDelete), [onEdit, onDelete]);

  // No matches: show only the centered message (drops the column header), per the design.
  if (!isLoading && employees.length === 0) {
    return <TeamPermissionsNoResults />;
  }

  return (
    <DefaultTable
      columns={columns}
      data={employees}
      itemsPerPage={6}
      isLoading={isLoading}
      getRowId={(row, index) => `${row.id}-${index}`}
      onRowClick={onSelect}
      noDataMessage="No employees match your filters"
    />
  );
}
