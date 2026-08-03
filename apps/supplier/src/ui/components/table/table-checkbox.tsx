import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';

interface TableCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'aria-label': string;
}

/**
 * Small square checkbox styled to the design (transparent unless checked, gold fill when
 * checked). The shared @energyiq/ui package has no Checkbox primitive yet, so this is the
 * canonical checkbox used across `DefaultTable`-based tables.
 */
export function TableCheckbox({ checked, onChange, 'aria-label': ariaLabel }: TableCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      // Stop the click from triggering the column's header sort / row click.
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        'tap-effect flex h-4 w-4 items-center justify-center rounded-[4px] border border-[#FBC02D80] transition-colors',
        checked ? 'bg-[#FBC02D80]' : 'bg-transparent',
      )}
    >
      {checked && <Check className="h-3 w-3 text-[#121212]" strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}
