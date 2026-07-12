import type { employee } from '@energyiq/domain';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

// ════════════════════════════════════════════════════════════════
// Employee API adapter — implements EmployeeApi port via HTTP.
// Used by the employee use-cases in @energyiq/domain/employee.
// ════════════════════════════════════════════════════════════════

export class EmployeeApiAdapter implements employee.EmployeeApi {
  async createEmployee(req: employee.EmployeeCreateRequest): Promise<employee.Employee> {
    return apiPost<employee.Employee>('v1/employee/create', req);
  }

  async getEmployee(id: string): Promise<employee.Employee> {
    return apiGet<employee.Employee>(`v1/employee/read/${id}`);
  }

  async updateEmployee(
    id: string,
    req: employee.EmployeeUpdateRequest,
  ): Promise<employee.Employee> {
    return apiPut<employee.Employee>(`v1/employee/update/${id}`, req);
  }

  async deleteEmployee(id: string): Promise<void> {
    await apiDelete(`v1/employee/delete/${id}`);
  }

  async listEmployees(
    params?: employee.EmployeeListParams,
  ): Promise<employee.EmployeeListResult> {
    return apiGet<employee.EmployeeListResult>('v1/employee/list', {
      searchParams: toSearchParams(params),
    });
  }

  async getEmployeeStats(): Promise<employee.EmployeeStats> {
    return apiGet<employee.EmployeeStats>('v1/employee/list/stats');
  }
}

function toSearchParams(
  params?: object,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;
  const entries: [string, string | number | boolean][] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) entries.push([key, value as string | number | boolean]);
  }
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
