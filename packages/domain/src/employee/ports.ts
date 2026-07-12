import type {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  EmployeeListParams,
  EmployeeListResult,
  EmployeeStats,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the employee domain needs.
// Implemented by the EmployeeApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface EmployeeApi {
  createEmployee(req: EmployeeCreateRequest): Promise<Employee>;
  getEmployee(id: string): Promise<Employee>;
  updateEmployee(id: string, req: EmployeeUpdateRequest): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  listEmployees(params?: EmployeeListParams): Promise<EmployeeListResult>;
  getEmployeeStats(): Promise<EmployeeStats>;
}
