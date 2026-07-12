// View-model shape used by the employee list table.
// Real data is fetched from the employee API and mapped in EmployeeListPage.

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

export interface EmployeeCounts {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export function buildEmployeeCounts(employees: Employee[]): EmployeeCounts {
  return employees.reduce(
    (acc, employeeItem) => {
      acc.total += 1;

      switch (employeeItem.status) {
        case 'active':
          acc.active += 1;
          break;
        case 'inactive':
          acc.inactive += 1;
          break;
        case 'pending':
          acc.pending += 1;
          break;
      }

      return acc;
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0,
    },
  );
}
