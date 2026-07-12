import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Label } from '@energyiq/ui';
import type { employee } from '@energyiq/domain';

interface EditEmployeeModalProps {
  open: boolean;
  employee: EmployeeViewModel | null;
  onClose: () => void;
  onSave: (id: string, req: employee.EmployeeUpdateRequest) => void;
  isSaving?: boolean;
}

export interface EmployeeViewModel {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

const ROLES: { label: string; value: employee.EmployeeRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Staff', value: 'staff' },
  { label: 'Finance', value: 'finance' },
];

export function EditEmployeeModal({
  open,
  employee,
  onClose,
  onSave,
  isSaving,
}: EditEmployeeModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<employee.EmployeeRole>('staff');
  const [status, setStatus] = useState<employee.EmployeeStatus>('active');

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setPhone('');
      setRole(roleToDomain(employee.role));
      setStatus(statusToDomain(employee.status));
    }
  }, [employee]);

  if (!open || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(employee.id, {
      name: name.trim(),
      phone: phone.trim() || undefined,
      role,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#111111] p-6 text-left">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Employee</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm text-zinc-400">Full Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Employee name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-zinc-400">Email</Label>
            <Input value={employee.email} disabled className="mt-1 opacity-60" />
          </div>

          <div>
            <Label className="text-sm text-zinc-400">Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-zinc-400">Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as employee.EmployeeRole)}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm text-zinc-400">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as employee.EmployeeStatus)}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
            >
              <option value="active">Active</option>
              <option value="suspended">Inactive</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400"
              disabled={isSaving || !name.trim()}
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function roleToDomain(role: string): employee.EmployeeRole {
  const normalized = role.toLowerCase();
  if (
    normalized === 'admin' ||
    normalized === 'manager' ||
    normalized === 'staff' ||
    normalized === 'finance'
  ) {
    return normalized;
  }
  return 'staff';
}

function statusToDomain(status: EmployeeViewModel['status']): employee.EmployeeStatus {
  if (status === 'active') return 'active';
  if (status === 'pending') return 'suspended';
  return 'suspended';
}
