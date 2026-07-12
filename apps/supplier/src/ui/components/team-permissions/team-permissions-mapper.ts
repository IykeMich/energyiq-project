import type { employee } from '@energyiq/domain';
import type { EmployeeRow, EmployeeStatus } from './team-permissions-mocks';

/**
 * Maps a backend Employee entity to the EmployeeRow view model used by the
 * Team & Permissions (Employee Management) UI.
 */
export function toEmployeeRow(source: employee.Employee): EmployeeRow {
  return {
    id: source.id ?? '',
    name: source.name ?? '',
    email: source.email ?? '',
    role: toDisplayRole(source.role),
    department: toDepartment(source.role),
    status: toEmployeeStatus(source.status),
    lastActive: formatLastActive(source.last_login_at ?? source.created_at),
    phone: source.phone ?? '',
    joined: formatDate(source.created_at),
    // Backend does not expose granular roles/permissions yet; keep defaults for UI.
    roles: [toDisplayRole(source.role)],
    permissions: [],
  };
}

export function toEmployeeStatus(status?: string): EmployeeStatus {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'suspended':
    case 'deleted':
    default:
      return 'Inactive';
  }
}

export function toDisplayRole(role?: string): string {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'Admin';
    case 'manager':
      return 'Manager';
    case 'finance':
      return 'Finance';
    case 'staff':
    default:
      return 'Staff';
  }
}

export function toDepartment(role?: string): string {
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

export function toDomainRole(role: string): employee.EmployeeRole {
  const normalized = role.toLowerCase();
  if (
    normalized === 'admin' ||
    normalized === 'manager' ||
    normalized === 'finance' ||
    normalized === 'staff'
  ) {
    return normalized;
  }
  return 'staff';
}

export function toDomainStatus(status: EmployeeStatus): employee.EmployeeStatus {
  return status === 'Active' ? 'active' : 'suspended';
}

export function formatLastActive(value?: string): string {
  if (!value) return 'Never';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function formatDate(value?: string): string {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return value;
  }
}
