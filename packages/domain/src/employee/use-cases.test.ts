import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmployeeUseCases } from './use-cases';
import type { EmployeeApi } from './ports';

// ════════════════════════════════════════════════════════════════
// Domain test — pure TypeScript, mock port, no React.
// ════════════════════════════════════════════════════════════════

const mockApi: EmployeeApi = {
  createEmployee: vi.fn(),
  getEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
  listEmployees: vi.fn(),
  getEmployeeStats: vi.fn(),
};

describe('EmployeeUseCases', () => {
  let employees: EmployeeUseCases;

  beforeEach(() => {
    vi.clearAllMocks();
    employees = new EmployeeUseCases(mockApi);
  });

  describe('createEmployee', () => {
    it('calls api.createEmployee with the request and returns the created employee', async () => {
      const req = {
        email: 'chioma@mega.com',
        name: 'Chioma',
        role: 'admin' as const,
      };
      const result = { id: 'emp-1', ...req };
      vi.mocked(mockApi.createEmployee).mockResolvedValue(result);

      const response = await employees.createEmployee(req);

      expect(mockApi.createEmployee).toHaveBeenCalledWith(req);
      expect(response).toEqual(result);
    });
  });

  describe('listEmployees', () => {
    it('calls api.listEmployees with optional params', async () => {
      const result = {
        items: [{ id: 'emp-1', name: 'Chioma', role: 'admin' }],
        total: 1,
        limit: 10,
        offset: 0,
      };
      vi.mocked(mockApi.listEmployees).mockResolvedValue(result);

      const response = await employees.listEmployees({ status: 'active', limit: 10 });

      expect(mockApi.listEmployees).toHaveBeenCalledWith({ status: 'active', limit: 10 });
      expect(response).toEqual(result);
    });
  });

  describe('getEmployeeStats', () => {
    it('returns stats from the api', async () => {
      const result = { total: 5, active: 3, inactive_accounts: 1, pending_invitations: 1 };
      vi.mocked(mockApi.getEmployeeStats).mockResolvedValue(result);

      const response = await employees.getEmployeeStats();

      expect(mockApi.getEmployeeStats).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('updateEmployee', () => {
    it('calls api.updateEmployee with id and request', async () => {
      const req = { name: 'Chioma Updated', role: 'manager' as const, status: 'suspended' as const };
      const result = { id: 'emp-1', ...req };
      vi.mocked(mockApi.updateEmployee).mockResolvedValue(result);

      const response = await employees.updateEmployee('emp-1', req);

      expect(mockApi.updateEmployee).toHaveBeenCalledWith('emp-1', req);
      expect(response).toEqual(result);
    });
  });

  describe('deleteEmployee', () => {
    it('calls api.deleteEmployee with id', async () => {
      vi.mocked(mockApi.deleteEmployee).mockResolvedValue(undefined);

      await employees.deleteEmployee('emp-1');

      expect(mockApi.deleteEmployee).toHaveBeenCalledWith('emp-1');
    });
  });
});
