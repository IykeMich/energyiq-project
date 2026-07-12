import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { ConfirmDialog, SuccessModal, toast } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import {
  useEmployeesQuery,
  useEmployeeStatsQuery,
  useUpdateEmployeeMutation,
} from '@/hooks/use-employees';

import { TeamPermissionsSearchBar } from './team-permissions-search-bar';
import { TeamPermissionsStatStrip } from './team-permissions-stat-strip';
import {
  TeamPermissionsFilterChips,
  type EmployeeFilterSelection,
} from './team-permissions-filter-chips';
import { TeamPermissionsTable } from './team-permissions-table';
import { TeamPermissionsEmptyState } from './team-permissions-empty-state';
import {
  TeamPermissionsInviteModal,
  type InvitedEmployee,
} from './team-permissions-invite-modal';
import {
  TeamPermissionsEmployeeDrawer,
  type EmployeeDrawerMode,
} from './team-permissions-employee-drawer';
import { toEmployeeRow, toDomainRole, toDomainStatus } from './team-permissions-mapper';
import type { EmployeeRow } from './team-permissions-mocks';

export type TeamPermissionsStatus = 'ready' | 'loading' | 'empty';

interface TeamPermissionsOverviewProps {
  /** Defaults to the loaded design; flip to preview the loading/empty states. */
  status?: TeamPermissionsStatus;
}

/**
 * Supplier Employee Management page. Wires the Team & Permissions UI to the
 * real employee API endpoints.
 */
export function TeamPermissionsOverview({ status = 'ready' }: TeamPermissionsOverviewProps) {
  const { data: listResult, isLoading: isListLoading } = useEmployeesQuery();
  const { data: stats, isLoading: isStatsLoading } = useEmployeeStatsQuery();
  const updateMutation = useUpdateEmployeeMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EmployeeFilterSelection>({});
  const [inviteOpen, setInviteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [invited, setInvited] = useState<InvitedEmployee | null>(null);
  const [selected, setSelected] = useState<EmployeeRow | null>(null);
  const [drawerMode, setDrawerMode] = useState<EmployeeDrawerMode>('view');
  const [pendingDeactivate, setPendingDeactivate] = useState<EmployeeRow | null>(null);

  const isLoading = status === 'loading' || isListLoading || isStatsLoading;
  const isEmpty = status === 'empty' || (!isListLoading && listResult?.items?.length === 0);

  const employees = useMemo<EmployeeRow[]>(() => {
    return (listResult?.items ?? []).map(toEmployeeRow);
  }, [listResult]);

  const filteredEmployees = useMemo(() => {
    if (isEmpty) return [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const roleFilter = filters.role;
    const statusFilter = filters.status;
    return employees.filter((employeeItem) => {
      const matchesQuery =
        normalizedQuery === '' ||
        employeeItem.name.toLowerCase().includes(normalizedQuery) ||
        employeeItem.email.toLowerCase().includes(normalizedQuery) ||
        employeeItem.role.toLowerCase().includes(normalizedQuery) ||
        employeeItem.department.toLowerCase().includes(normalizedQuery);
      const matchesRole = !roleFilter || employeeItem.role === roleFilter;
      const matchesStatus = !statusFilter || employeeItem.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [isEmpty, searchQuery, filters, employees]);

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const handleInvite = () => setInviteOpen(true);

  const handleInvited = (next: InvitedEmployee) => {
    setInviteOpen(false);
    setInvited(next);
    setSuccessOpen(true);
  };

  const openDrawer = (employee: EmployeeRow, mode: EmployeeDrawerMode) => {
    setDrawerMode(mode);
    setSelected(employee);
  };

  const handleSaved = (employee: EmployeeRow) => {
    if (!employee.id) return;
    updateMutation.mutate(
      {
        id: employee.id,
        req: {
          name: employee.name,
          phone: employee.phone || undefined,
          role: toDomainRole(employee.role),
          status: toDomainStatus(employee.status),
        },
      },
      {
        onSuccess: () => {
          setSelected(null);
          toast.success('Changes Saved', {
            description: 'Employee details updated successfully.',
          });
        },
        onError: (error) => {
          toast.error('Update failed', {
            description: (error as Error).message || 'Could not update employee.',
          });
        },
      },
    );
  };

  const handleDeactivate = (employee: EmployeeRow) => {
    if (!employee.id) return;
    setPendingDeactivate(employee);
  };

  const handleDeactivateConfirmed = () => {
    if (!pendingDeactivate?.id) return;
    updateMutation.mutate(
      {
        id: pendingDeactivate.id,
        req: {
          name: pendingDeactivate.name,
          role: toDomainRole(pendingDeactivate.role),
          status: 'suspended',
        },
      },
      {
        onSuccess: () => {
          setPendingDeactivate(null);
          toast.success('Employee De-activated', {
            description: 'This employee no longer has access.',
          });
        },
        onError: (error) => {
          setPendingDeactivate(null);
          toast.error('Deactivation failed', {
            description: (error as Error).message || 'Could not deactivate employee.',
          });
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Employee search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <TeamPermissionsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Employee Management</h1>

      <TeamPermissionsStatStrip stats={stats} />

      {isEmpty ? (
        <TeamPermissionsEmptyState
          onInvite={handleInvite}
          onReviewRoles={() => {
            // TODO: navigate to the roles overview once it lands.
          }}
        />
      ) : (
        <>
          {/* Toolbar: filter chips on the left, primary actions on the right. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TeamPermissionsFilterChips selection={filters} onChange={setFilter} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  // TODO: open the manage-access flow once the endpoint lands.
                }}
                className="tap-effect rounded-lg border border-[#FBC02D] px-4 py-2 text-sm font-medium text-[#FBC02D]"
              >
                Manage Access
              </button>
              <button
                type="button"
                onClick={handleInvite}
                className="tap-effect inline-flex items-center gap-1 rounded-lg bg-[#FBC02D] px-4 py-2 text-sm font-medium text-[#121212]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Invite Member
              </button>
            </div>
          </div>

          {/* Table card: "Employee List" header (hidden when there are no rows), then the table. */}
          <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
            {(isLoading || filteredEmployees.length > 0) && (
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />
                <h2 className="text-base font-semibold text-[#FAFAFA]">Employee List</h2>
              </div>
            )}
            <TeamPermissionsTable
              employees={filteredEmployees}
              isLoading={isLoading}
              onSelect={(employee) => openDrawer(employee, 'view')}
              onEdit={(employee) => openDrawer(employee, 'edit')}
              onDeactivate={handleDeactivate}
            />
          </div>
        </>
      )}

      <TeamPermissionsInviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmitted={handleInvited}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={(open) => !open && setSuccessOpen(false)}
        tone="brand"
        buttonLayout="row"
        title="Invitation sent!"
        subtitle={
          <>
            An invite email has been sent to{' '}
            <span className="font-semibold text-brand">{invited?.email}</span>. They'll join as{' '}
            <span className="font-semibold text-brand">{invited?.rolesLabel}</span>.
          </>
        }
        secondaryAction={{
          label: 'Invite another',
          onClick: () => {
            setSuccessOpen(false);
            setInviteOpen(true);
          },
        }}
        primaryAction={{ label: 'Done', onClick: () => setSuccessOpen(false) }}
      />

      <TeamPermissionsEmployeeDrawer
        employee={selected}
        initialMode={drawerMode}
        onOpenChange={(open) => !open && setSelected(null)}
        onSaved={handleSaved}
        onDeactivate={(employee) => {
          setSelected(null);
          setPendingDeactivate(employee);
        }}
      />

      <ConfirmDialog
        open={pendingDeactivate !== null}
        onOpenChange={(open) => !open && setPendingDeactivate(null)}
        title="Deactivate Employee"
        message={`Are you sure you want to deactivate ${pendingDeactivate?.name}? They will no longer be able to access the account.`}
        confirmLabel="Deactivate"
        intent="danger"
        onConfirm={handleDeactivateConfirmed}
      />
    </section>
  );
}
