import { Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '../mocks';

interface EmployeeActionsCellProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

export function EmployeeActionsCell({
  employee,
  onEdit,
  onDelete,
}: EmployeeActionsCellProps) {
  return (
    <div className="flex items-center justify-center gap-3 h-full">
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
        onClick={() => onDelete?.(employee)}
        aria-label={`Delete ${employee.name}`}
        className="text-foreground hover:text-danger"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}