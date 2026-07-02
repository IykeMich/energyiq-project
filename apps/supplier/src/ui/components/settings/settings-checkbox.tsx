import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';

interface SettingsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function SettingsCheckbox({
  checked,
  onCheckedChange,
  disabled,
  label,
  id,
}: SettingsCheckboxProps) {
  const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'inline-flex items-center justify-center w-5 h-5 rounded border transition-colors cursor-pointer',
        checked
          ? 'bg-[#FBC02D] border-[#FBC02D]'
          : 'bg-transparent border-[#616161B2] hover:border-[#FBC02D]/50',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="sr-only"
        aria-label={label}
      />
      {checked && <Check className="w-3.5 h-3.5 text-[#121212]" strokeWidth={3} />}
    </label>
  );
}
