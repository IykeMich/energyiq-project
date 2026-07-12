import { useMemo, useState } from 'react';
import { DataGrid, type ColDef } from '@energyiq/ui';
import type { employee } from '@energyiq/domain';

import ProfileImage from '@/assets/employee-image.png';

import {
  useEmployeesQuery,
  useEmployeeStatsQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from '@/hooks/use-employees';

import { EmployeeStatusBadge } from './components/employee-status-badge';
import { EmployeeActionsCell } from './components/employee-actions-cell';
import { InviteEmployeeModal } from './components/modal/invite-employee-modal';
import { InvitationSuccessModal } from './components/modal/invitation-success-modal';
import { EditEmployeeModal, type EmployeeViewModel } from './components/modal/edit-employee-modal';

export function EmployeeListPage() {
  const { data: listResult, isLoading, error } = useEmployeesQuery();
  const { data: stats } = useEmployeeStatsQuery();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeViewModel | null>(null);

  const employees = useMemo<EmployeeViewModel[]>(() => {
    return (listResult?.items ?? []).map(toViewModel);
  }, [listResult]);

  const counts = useMemo(
    () => ({
      total: stats?.total ?? 0,
      active: stats?.active ?? 0,
      pending: stats?.pending_invitations ?? 0,
      inactive: stats?.inactive_accounts ?? 0,
    }),
    [stats],
  );

  const handleDelete = (employeeItem: EmployeeViewModel) => {
    if (!employeeItem.id) return;
    if (!window.confirm(`Delete employee ${employeeItem.name}?`)) return;
    deleteMutation.mutate(employeeItem.id);
  };

  const handleToggleStatus = (employeeItem: EmployeeViewModel) => {
    if (!employeeItem.id) return;
    const newStatus: employee.EmployeeStatus =
      employeeItem.status === 'active' ? 'suspended' : 'active';
    const message =
      employeeItem.status === 'active'
        ? `Deactivate employee ${employeeItem.name}?`
        : `Activate employee ${employeeItem.name}?`;
    if (!window.confirm(message)) return;

    updateMutation.mutate({
      id: employeeItem.id,
      req: {
        name: employeeItem.name,
        role: roleToDomain(employeeItem.role),
        status: newStatus,
      },
    });
  };

  const handleSaveEdit = (
    id: string,
    req: employee.EmployeeUpdateRequest,
  ) => {
    updateMutation.mutate(
      { id, req },
      {
        onSuccess: () => setEditingEmployee(null),
      },
    );
  };

  const columnDefs = useMemo<ColDef<EmployeeViewModel>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Employee Name',
        minWidth: 290,
        flex: 2,
        cellRenderer: (p: { data?: EmployeeViewModel }) => (
          <div className="flex items-center gap-3">
            <img
              src={ProfileImage}
              alt="Employee"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="flex flex-col justify-center">
              <span className="font-medium text-foreground">
                {p.data?.name}
              </span>

              <span className="text-sm text-muted-foreground">
                {p.data?.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'department',
        headerName: 'Department',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 140,
        flex: 0,
        cellRenderer: (p: { value?: EmployeeViewModel['status'] }) => (
          <EmployeeStatusBadge status={p.value ?? 'inactive'} />
        ),
      },
      {
        field: 'lastActive',
        headerName: 'Last Active',
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Action',
        width: 140,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data?: EmployeeViewModel }) => (
          <EmployeeActionsCell
            employee={p.data!}
            onEdit={setEditingEmployee}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <section className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Employee Management
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Employees" value={counts.total} />
          <StatCard title="Active Employees" value={counts.active} />
          <StatCard title="Pending Invitations" value={counts.pending} />
          <StatCard title="Inactive Accounts" value={counts.inactive} />
        </div>

        <InviteEmployeeModal onInviteMember={() => console.log('Invite member (UI pending)')} />

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center rounded-[18px] bg-surface-card">
              <p className="text-muted-foreground">Loading employees…</p>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center rounded-[18px] bg-surface-card">
              <p className="text-danger">
                Failed to load employees. Please try again.
              </p>
            </div>
          ) : (
            <DataGrid<EmployeeViewModel>
              rowData={employees}
              columnDefs={columnDefs}
              rowHeight={64}
              className="h-[600px] rounded-[18px] bg-surface-card"
            />
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <EditEmployeeModal
        open={!!editingEmployee}
        employee={editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSave={handleSaveEdit}
        isSaving={updateMutation.isPending}
      />

      {/* Success Modal */}
      <InvitationSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}

/* ---------------- STAT CARD ---------------- */

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-[18px] bg-surface-card p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

/* ---------------- MAPPERS ---------------- */

function toViewModel(source: employee.Employee): EmployeeViewModel {
  return {
    id: source.id ?? '',
    name: source.name ?? '',
    email: source.email ?? '',
    role: normalizeRole(source.role),
    department: roleToDepartment(source.role),
    status: mapStatus(source.status),
    lastActive: formatLastActive(source.last_login_at ?? source.created_at),
  };
}

function normalizeRole(role?: string): string {
  if (!role) return 'Unknown';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function roleToDepartment(role?: string): string {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'Executive';
    case 'finance':
      return 'Finance';
    case 'manager':
      return 'Operations';
    case 'staff':
    default:
      return 'General';
  }
}

function roleToDomain(role: string): employee.EmployeeRole {
  const normalized = role.toLowerCase();
  if (
    normalized === 'admin' ||
    normalized === 'manager' ||
    normalized === 'staff' ||
    normalized === 'finance'
  ) {
    return normalized;
  }
  return 'staff';
}

function mapStatus(status?: string): EmployeeViewModel['status'] {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'active';
    case 'suspended':
      return 'inactive';
    case 'deleted':
      return 'inactive';
    default:
      return 'inactive';
  }
}

function formatLastActive(value?: string): string {
  if (!value) return 'Never';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}
