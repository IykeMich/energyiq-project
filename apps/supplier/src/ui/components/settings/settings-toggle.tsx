import { cn } from '@energyiq/shared';

interface SettingsToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
}

export function SettingsToggle({
  checked,
  onCheckedChange,
  disabled,
  id,
  label,
}: SettingsToggleProps) {
  const toggleId = id ?? `toggle-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        'relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors',
        checked ? 'bg-[#FBC02D]' : 'bg-[#616161B2]',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <input
        id={toggleId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="sr-only"
        aria-label={label}
      />
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
        style={{ marginTop: '2px' }}
      />
    </label>
  );
}
