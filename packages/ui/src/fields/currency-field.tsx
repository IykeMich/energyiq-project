import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Input } from '../primitives/input';
import { Label } from '../primitives/label';
import { cn } from '@energyiq/shared';

interface CurrencyFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencyField<T extends FieldValues>({
  control,
  name,
  label,
  currency = '₦',
  placeholder = '0.00',
  disabled,
  className,
}: CurrencyFieldProps<T>) {
  const formatCurrency = (value: string): string => {
    const digits = value.replace(/[^\d.]/g, '');
    const parts = digits.split('.');
    const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${whole}.${parts[1].slice(0, 2)}` : whole;
  };

  const parseCurrency = (formatted: string): number => {
    const cleaned = formatted.replace(/,/g, '');
    return parseFloat(cleaned) || 0;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>{label}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              {currency}
            </span>
            <Input
              id={name}
              type="text"
              inputMode="decimal"
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ? formatCurrency(String(field.value)) : ''}
              onChange={(e) => field.onChange(parseCurrency(e.target.value))}
              onBlur={field.onBlur}
              className={cn('pl-8', error && 'border-destructive focus-visible:ring-destructive')}
            />
          </div>
          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}
    />
  );
}
