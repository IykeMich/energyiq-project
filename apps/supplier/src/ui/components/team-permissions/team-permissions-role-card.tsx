import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { EmployeeRoleOption } from './team-permissions-mocks';

interface TeamPermissionsRoleCardProps {
  role: EmployeeRoleOption;
  selected: boolean;
  onToggle: () => void;
}

/** Selectable role card with a gold checkbox, used in the Assign Roles grid. */
export function TeamPermissionsRoleCard({ role, selected, onToggle }: TeamPermissionsRoleCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        'tap-effect flex items-center justify-between gap-3 rounded-[18px] border border-border-strong p-4 text-left',
        selected && 'border-brand',
      )}
    >
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{role.label}</span>
        <span className="text-xs text-muted-foreground">{role.description}</span>
      </span>

      <span
        className={cn(
          'relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border',
          selected ? 'border-brand bg-brand' : 'border-border-strong',
        )}
      >
        {selected && <Check className="h-3.5 w-3.5 text-brand-foreground" strokeWidth={3} />}
      </span>
    </button>
  );
}
