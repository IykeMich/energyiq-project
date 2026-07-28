import type { ChangeEvent } from 'react';
import { cn, formatAmount } from '@energyiq/shared';

interface NumericTextFieldProps {
  /** Raw digit string, no commas (e.g. "30000") — safe to Number() directly. */
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  /** Unit label shown inside the field, right-aligned (e.g. "L"). */
  suffix?: string;
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
  className?: string;
}

/**
 * Plain value/onChange numeric input (not react-hook-form) that comma-groups the
 * display as the user types while keeping the value passed to `onChange` as a
 * clean digit string — so callers can `Number()` it straight into a payload.
 * Use `CurrencyField` instead inside react-hook-form forms.
 */
export function NumericTextField({ value, onChange, placeholder, suffix, error, className }: NumericTextFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/[^\d.]/g, '');
    onChange(digitsOnly);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value ? formatAmount(value) : ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full bg-surface-card border border-border-strong h-[52px] rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand',
            suffix && 'pr-12',
            error && 'border-destructive focus:border-destructive',
            className,
          )}
        />
        {suffix && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
