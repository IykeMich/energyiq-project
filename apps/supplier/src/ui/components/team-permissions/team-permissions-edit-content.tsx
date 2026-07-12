import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { TeamPermissionsInviteField } from './team-permissions-invite-field';
import { TeamPermissionsRoleChip } from './team-permissions-role-chip';
import { TeamPermissionsStatusBadge } from './team-permissions-status-badge';
import { TeamPermissionsPermissionCard } from './team-permissions-permission-card';
import { EMPLOYEE_PERMISSION_OPTIONS, EMPLOYEE_STATUS_COLOR, EMPLOYEE_ROLE_OPTIONS } from './team-permissions-mocks';
import type { EmployeeRow } from './team-permissions-mocks';

const BRAND_GOLD = '#FBC02D';

interface TeamPermissionsEditContentProps {
  employee: EmployeeRow;
  onCancel: () => void;
  onSave: (employee: EmployeeRow) => void;
  onDeactivate: () => void;
}

/** Editable employee profile shown in the details drawer's edit mode. */
export function TeamPermissionsEditContent({
  employee,
  onCancel,
  onSave,
  onDeactivate,
}: TeamPermissionsEditContentProps) {
  const [fullName, setFullName] = useState(employee.name);
  const [phone, setPhone] = useState(employee.phone);
  const [role, setRole] = useState(employee.role);
  const [status, setStatus] = useState(employee.status);
  const [permissions, setPermissions] = useState<string[]>(employee.permissions);

  const togglePermission = (id: string) => {
    setPermissions((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id],
    );
  };

  const handleSave = () => {
    onSave({
      ...employee,
      name: fullName.trim(),
      phone: phone.trim(),
      role,
      status,
      permissions,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile row: avatar, name + badges. */}
      <div className="flex items-center gap-3 border-b border-border-subtle pb-5">
        <Avatar className="h-12 w-12">
          <AvatarImage src={employee.avatarUrl} alt={employee.name} />
          <AvatarFallback className="bg-[#FBC02D] text-[#121212]">
            {getInitials(employee.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-foreground">{employee.name}</span>
          <div className="flex items-center gap-2">
            <TeamPermissionsStatusBadge label={role} color={BRAND_GOLD} />
            <TeamPermissionsStatusBadge
              label={status}
              color={EMPLOYEE_STATUS_COLOR[status]}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
        <TeamPermissionsInviteField
          id="edit-full-name"
          label="Full Name:"
          value={fullName}
          onChange={setFullName}
        />
        <TeamPermissionsInviteField
          id="edit-email"
          label="Email Address:"
          type="email"
          value={employee.email}
          onChange={() => {}}
          disabled
        />
        <TeamPermissionsInviteField
          id="edit-phone"
          label="Phone Number:"
          type="tel"
          value={phone}
          onChange={setPhone}
        />
        <TeamPermissionsInviteField
          id="edit-department"
          label="Department:"
          value={employee.department}
          onChange={() => {}}
          disabled
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-foreground">Role</h3>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-border-strong bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand"
        >
          {EMPLOYEE_ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-foreground">Status</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as EmployeeRow['status'])}
          className="w-full rounded-lg border border-border-strong bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-foreground">Assigned Roles</h3>
        <div className="flex flex-wrap gap-2">
          {employee.roles.map((r) => (
            <TeamPermissionsRoleChip key={r} label={r} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-foreground">Permissions</h3>
        <div className="flex flex-col gap-3">
          {EMPLOYEE_PERMISSION_OPTIONS.map((permission) => (
            <TeamPermissionsPermissionCard
              key={permission.id}
              permission={permission}
              selected={permissions.includes(permission.id)}
              onToggle={() => togglePermission(permission.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDeactivate}
          className="tap-effect rounded-[28px] bg-danger px-6 py-2.5 text-sm font-semibold text-danger-foreground"
        >
          Deactivate
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="tap-effect rounded-[28px] bg-foreground/10 px-6 py-2.5 text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="tap-effect rounded-[28px] bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
