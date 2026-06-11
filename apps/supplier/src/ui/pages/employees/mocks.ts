






export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}


export const EMPLOYEES_MOCK: Employee[] = [
  {
    id: 'EMP-001',
    name: 'John Doe',
    email: 'johndoe@yahoo.com',
    role: 'Admin',
    department: 'Executive',
    status: 'active',
    lastActive: 'Today, 10:30 AM',
  },
  {
    id: 'EMP-002',
    name: 'Sandra Roberts',
    email: 'sandraroberts@yahoo.com',
    role: 'Finance Manager',
    department: 'Finance',
    status: 'active',
    lastActive: 'Today, 10:30 AM',
  },
  {
    id: 'EMP-003',
    name: 'Ogbuefi Ikenna',
    email: 'ogbuefiikenna@yahoo.com',
    role: 'Operations Manager',
    department: 'Operations',
    status: 'inactive',
    lastActive: 'Today, 10:30 AM',
  },
];

export interface EmployeeCounts {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export function buildEmployeeCounts(
  employees: Employee[],
): EmployeeCounts {
  return employees.reduce(
    (acc, employee) => {
      acc.total += 1;

      switch (employee.status) {
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