import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';

interface AuditLogsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'aria-label': string;
}

/** Small square checkbox styled to the design (gold fill when checked). */
export function AuditLogsCheckbox({
  checked,
  onChange,
  'aria-label': ariaLabel,
}: AuditLogsCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        'tap-effect flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors',
        checked ? 'border-[#FBC02D] bg-[#FBC02D]' : 'border-[#616161B2] bg-transparent',
      )}
    >
      {checked && <Check className="h-3 w-3 text-[#121212]" strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}
