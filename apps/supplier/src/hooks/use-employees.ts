import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { employee } from '@energyiq/domain';
import { employeeUseCases } from '@/config/container';

const EMPLOYEES_QUERY_KEY = ['employees'] as const;

export function useEmployeesQuery(params?: employee.EmployeeListParams) {
  return useQuery({
    queryKey: [...EMPLOYEES_QUERY_KEY, 'list', params],
    queryFn: () => employeeUseCases.listEmployees(params),
  });
}

export function useEmployeeQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...EMPLOYEES_QUERY_KEY, id],
    queryFn: () => employeeUseCases.getEmployee(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useEmployeeStatsQuery() {
  return useQuery({
    queryKey: [...EMPLOYEES_QUERY_KEY, 'stats'],
    queryFn: () => employeeUseCases.getEmployeeStats(),
  });
}

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: employee.EmployeeCreateRequest) => employeeUseCases.createEmployee(req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY }),
  });
}

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: employee.EmployeeUpdateRequest }) =>
      employeeUseCases.updateEmployee(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY }),
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeUseCases.deleteEmployee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY }),
  });
}
