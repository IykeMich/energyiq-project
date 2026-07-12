import type { EmployeeApi } from './ports';
import type {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  EmployeeListParams,
  EmployeeListResult,
  EmployeeStats,
} from './types';

// ════════════════════════════════════════════════════════════════
// Employee use cases — thin orchestration over the EmployeeApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class EmployeeUseCases {
  private api: EmployeeApi;

  constructor(api: EmployeeApi) {
    this.api = api;
  }

  async createEmployee(req: EmployeeCreateRequest): Promise<Employee> {
    return this.api.createEmployee(req);
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.api.getEmployee(id);
  }

  async updateEmployee(id: string, req: EmployeeUpdateRequest): Promise<Employee> {
    return this.api.updateEmployee(id, req);
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.api.deleteEmployee(id);
  }

  async listEmployees(params?: EmployeeListParams): Promise<EmployeeListResult> {
    return this.api.listEmployees(params);
  }

  async getEmployeeStats(): Promise<EmployeeStats> {
    return this.api.getEmployeeStats();
  }
}
