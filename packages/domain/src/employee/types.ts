// ════════════════════════════════════════════════════════════════
// Employee domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type EmployeeRole = 'admin' | 'manager' | 'staff' | 'finance';

export type EmployeeStatus = 'active' | 'suspended' | 'deleted';

export type EmployeeListStatus = 'active' | 'suspended';

export interface Employee {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: EmployeeRole | string;
  role_id?: string;
  status?: EmployeeStatus | string;
  supplier_id?: string;
  entity_id?: string;
  entity_type?: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeCreateRequest {
  email: string;
  name: string;
  phone?: string;
  role: EmployeeRole;
  role_id?: string;
}

export interface EmployeeUpdateRequest {
  name: string;
  phone?: string;
  role: EmployeeRole;
  role_id?: string;
  status: EmployeeStatus;
}

export interface EmployeeListParams {
  role?: EmployeeRole;
  status?: EmployeeListStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface EmployeeListResult {
  items?: Employee[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface EmployeeStats {
  active?: number;
  inactive_accounts?: number;
  pending_invitations?: number;
  suspended?: number;
  total?: number;
}
