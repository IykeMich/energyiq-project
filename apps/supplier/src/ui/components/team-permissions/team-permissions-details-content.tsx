import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { TeamPermissionsStatusBadge } from './team-permissions-status-badge';
import { EMPLOYEE_PERMISSION_OPTIONS, EMPLOYEE_STATUS_COLOR } from './team-permissions-mocks';
import type { EmployeeRow } from './team-permissions-mocks';

const BRAND_GOLD = '#FBC02D';

/** A labelled value cell in the Contacts grid. */
function ContactCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-[14px] border border-border-strong p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={accent ? 'text-sm font-medium text-brand' : 'text-sm text-foreground'}>
        {value}
      </span>
    </div>
  );
}

interface TeamPermissionsDetailsContentProps {
  employee: EmployeeRow;
  onEdit: () => void;
}

/** Read-only employee profile shown in the details drawer's view mode. */
export function TeamPermissionsDetailsContent({
  employee,
  onEdit,
}: TeamPermissionsDetailsContentProps) {
  const grantedPermissions = EMPLOYEE_PERMISSION_OPTIONS.filter((permission) =>
    employee.permissions.includes(permission.id),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Profile row: avatar, name + badges, and the Edit action. */}
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            <AvatarFallback className="bg-[#FBC02D] text-[#121212]">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <span className="text-base font-semibold text-foreground">{employee.name}</span>
            <div className="flex items-center gap-2">
              <TeamPermissionsStatusBadge label={employee.role} color={BRAND_GOLD} />
              <TeamPermissionsStatusBadge
                label={employee.status}
                color={EMPLOYEE_STATUS_COLOR[employee.status]}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="tap-effect rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground"
        >
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Contacts:</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ContactCell label="Email Address:" value={employee.email} />
          <ContactCell label="Phone Number:" value={employee.phone} />
          <ContactCell label="Department:" value={employee.department} accent />
          <ContactCell label="Joined:" value={employee.joined} />
          <ContactCell label="Last Active:" value={employee.lastActive} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Permissions:</h3>
        {grantedPermissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No permissions granted yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {grantedPermissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-brand/40 bg-brand/10 px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">{permission.label}</span>
                <span className="rounded-full bg-brand/20 px-3 py-0.5 text-[10px] font-medium text-brand">
                  Granted
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
