import { useMemo, useState } from 'react';
import { DataGrid, type ColDef } from '@energyiq/ui';

import ProfileImage from '@/assets/employee-image.png';


import { EmployeeStatusBadge } from './components/employee-status-badge';
import { EmployeeActionsCell } from './components/employee-actions-cell';

import {InviteEmployeeModal} from './components/modal/invite-employee-modal';
import { InvitationSuccessModal } from './components/modal/invitation-success-modal';


import {
  EMPLOYEES_MOCK,
  buildEmployeeCounts,
  type Employee,
} from './mocks';

export function EmployeeListPage() {
  const counts = useMemo(
    () => buildEmployeeCounts(EMPLOYEES_MOCK),
    []
  );

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'name',
        headerName: 'Employee Name',
        minWidth: 290,
        flex: 2,
        cellRenderer: (p: { data: Employee }) => (
          <div className="flex items-center gap-3">
            <img
              src={ProfileImage}
              alt="Employee"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="flex flex-col justify-center">
              <span className="font-medium text-foreground">
                {p.data.name}
              </span>

              <span className="text-sm text-muted-foreground">
                {p.data.email}
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
        cellRenderer: (p: { value: Employee['status'] }) => (
          <EmployeeStatusBadge status={p.value} />
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
        width: 120,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: Employee }) => (
          <EmployeeActionsCell
            employee={p.data}
            onEdit={(employee) => console.log('Edit', employee)}
            onDelete={(employee) => console.log('Delete', employee)}
          />
        ),
      },
    ],
    []
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Employees" value={counts.total} />
          <StatCard title="Active Employees" value={counts.active} />
          <StatCard title="Pending Invitations" value={counts.pending} />
          <StatCard title="Inactive Accounts" value={counts.inactive} />
        </div>

        {/* Filters */}
        <InviteEmployeeModal
          onInviteMember={() => setIsInviteModalOpen(true)}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <DataGrid<Employee>
            rowData={EMPLOYEES_MOCK}
            columnDefs={columnDefs}
            rowHeight={64}
            className="h-[162.5] rounded-[18px] bg-surface-card"
          />
        </div>

      </section>

      {/* Invite Modal */}
     

      {/* Success Modal */}
      <InvitationSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        // onInviteAnother={() => {
        //   setIsSuccessModalOpen(false);
        //   setIsInviteModalOpen(true);
        // }}
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
      <p className="mt-2 text-3xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}