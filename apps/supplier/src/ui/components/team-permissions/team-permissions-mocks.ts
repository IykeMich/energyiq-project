// Replica data for the supplier Employee Management (Team & Permissions) page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type EmployeeStatus = 'Active' | 'Inactive';

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  /** Optional photo; falls back to gold initials when absent. */
  avatarUrl?: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  /** Display "last active" timestamp as shown in the design (e.g. "Today, 10:30 AM"). */
  lastActive: string;
  /** Contact phone shown in the details drawer. */
  phone: string;
  /** Join date shown in the details drawer (e.g. "Mar 12, 2024"). */
  joined: string;
  /** Assigned-role display tags shown as chips in the details/edit drawer. */
  roles: string[];
  /** Granted permission ids (see EMPLOYEE_PERMISSION_OPTIONS). */
  permissions: string[];
}

// The rows mirror the design exactly; the list repeats the sample so the footer
// reads "of 100 Entries". TODO(orval): replace with the employees query hook.
const EMPLOYEES_SAMPLE: Omit<EmployeeRow, 'id'>[] = [
  { name: 'John Doe', email: 'johndoe@yahoo.com', role: 'Admin', department: 'Executive', status: 'Active', lastActive: 'Today, 10:30 AM', phone: '+234 803 441 2291', joined: 'Mar 12, 2024', roles: ['Finance', 'Operations', 'Compliance'], permissions: ['view-orders', 'add-complaints', 'approve-messages'] },
  { name: 'Sandra Roberts', email: 'sandraroberts@yahoo.com', role: 'Finance Manager', department: 'Finance', status: 'Active', lastActive: 'Today, 10:30 AM', phone: '+234 803 552 1043', joined: 'Jan 08, 2024', roles: ['Finance'], permissions: ['view-orders', 'view-financials'] },
  { name: 'Ogbuefi Ikenna', email: 'ogbuefiikenna@yahoo.com', role: 'Operations Manager', department: 'Operations', status: 'Inactive', lastActive: 'Today, 10:30 AM', phone: '+234 802 119 8876', joined: 'Feb 20, 2024', roles: ['Operations'], permissions: ['view-orders'] },
  { name: 'Esther Jane', email: 'estherjane@yahoo.com', role: 'Operations Manager', department: 'Operations', status: 'Active', lastActive: 'Today, 10:30 AM', phone: '+234 805 667 4421', joined: 'Apr 02, 2024', roles: ['Operations', 'Compliance'], permissions: ['view-orders', 'add-complaints', 'approve-messages'] },
  { name: 'Ekemma Ekemma', email: 'ekemmaeke@yahoo.com', role: 'Operations Manager', department: 'Operations', status: 'Inactive', lastActive: 'Today, 10:30 AM', phone: '+234 807 223 9098', joined: 'May 15, 2024', roles: ['Operations'], permissions: ['add-complaints'] },
  { name: 'John Doe', email: 'johndoe@yahoo.com', role: 'Admin', department: 'Executive', status: 'Active', lastActive: 'Today, 10:30 AM', phone: '+234 803 441 2291', joined: 'Mar 12, 2024', roles: ['Finance', 'Operations', 'Compliance'], permissions: ['view-orders', 'add-complaints', 'view-financials', 'approve-messages'] },
  { name: 'Ogbuefi Ikenna', email: 'ogbuefiikenna@yahoo.com', role: 'Operations Manager', department: 'Operations', status: 'Inactive', lastActive: 'Today, 10:30 AM', phone: '+234 802 119 8876', joined: 'Feb 20, 2024', roles: ['Operations'], permissions: ['view-orders'] },
  { name: 'Ogbuefi Ikenna', email: 'ogbuefiikenna@yahoo.com', role: 'Operations Manager', department: 'Operations', status: 'Inactive', lastActive: 'Today, 10:30 AM', phone: '+234 802 119 8876', joined: 'Feb 20, 2024', roles: ['Operations'], permissions: [] },
];

export const EMPLOYEES_MOCK: EmployeeRow[] = Array.from({ length: 100 }, (_, index) => ({
  id: `EMP-${String(index + 1).padStart(3, '0')}`,
  ...EMPLOYEES_SAMPLE[index % EMPLOYEES_SAMPLE.length],
}));

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const EMPLOYEE_STATUS_COLOR: Record<EmployeeStatus, string> = {
  Active: '#388E3C',
  Inactive: '#D30A0A',
};

export interface EmployeeStat {
  title: string;
  value: string;
}

// The KPI cards above the employee table.
// TODO(orval): source these figures from the team summary endpoint.
export const EMPLOYEE_STATS: EmployeeStat[] = [
  { title: 'Total Employees:', value: '28' },
  { title: 'Active Employees:', value: '20' },
  { title: 'Pending Invitations:', value: '3' },
  { title: 'Inactive Accounts:', value: '5' },
];

export interface EmployeeFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdowns above the table.
// TODO(orval): source these option lists from their reference endpoints.
export const EMPLOYEE_FILTERS: EmployeeFilter[] = [
  { id: 'role', label: 'Role', options: ['Admin', 'Finance Manager', 'Operations Manager'] },
  { id: 'status', label: 'Status', options: ['Active', 'Inactive'] },
];

export interface EmployeeRoleOption {
  value: string;
  label: string;
  /** Short summary of what the role can do, shown under the label. */
  description: string;
}

// Assignable roles in the Invite Employee form (select all that apply).
// TODO(orval): source these from the roles endpoint once it lands.
export const EMPLOYEE_ROLE_OPTIONS: EmployeeRoleOption[] = [
  { value: 'admin', label: 'Admin', description: 'All ops except billing' },
  { value: 'manager', label: 'Manager', description: 'Distributors, orders, reports' },
  { value: 'finance', label: 'Finance', description: 'Financial reports & payments' },
  { value: 'staff', label: 'Staff', description: 'View-only, basic ops' },
];

export interface EmployeePermissionOption {
  id: string;
  label: string;
  /** Short explanation of what the permission grants. */
  description: string;
}

// Togglable permissions shown in the employee details/edit drawer.
// TODO(orval): source these from the permissions endpoint once it lands.
export const EMPLOYEE_PERMISSION_OPTIONS: EmployeePermissionOption[] = [
  { id: 'view-orders', label: 'View Orders', description: 'Can be able to view distributor orders' },
  { id: 'add-complaints', label: 'Add Complaints', description: 'Can be able to see and add distributor complaints' },
  { id: 'view-financials', label: 'View Financials', description: 'Access to account balances and transaction history' },
  { id: 'approve-messages', label: 'Approve Messages', description: 'Can be able to view and approve distributor messages' },
];
