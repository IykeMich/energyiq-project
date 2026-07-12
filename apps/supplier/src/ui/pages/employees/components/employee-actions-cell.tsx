import { Pencil, Power, Trash2 } from 'lucide-react';
import type { Employee } from '../mocks';

interface EmployeeActionsCellProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onToggleStatus?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

export function EmployeeActionsCell({
  employee,
  onEdit,
  onToggleStatus,
  onDelete,
}: EmployeeActionsCellProps) {
  const isActive = employee.status === 'active';

  return (
    <div className="flex items-center justify-center gap-2 h-full">
      <button
        type="button"
        onClick={() => onEdit?.(employee)}
        aria-label={`Edit ${employee.name}`}
        className="text-foreground hover:text-brand"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onToggleStatus?.(employee)}
        aria-label={isActive ? `Deactivate ${employee.name}` : `Activate ${employee.name}`}
        className={isActive ? 'text-foreground hover:text-yellow-500' : 'text-foreground hover:text-green-500'}
      >
        <Power className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete?.(employee)}
        aria-label={`Delete ${employee.name}`}
        className="text-foreground hover:text-danger"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
