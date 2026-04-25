import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/select';
import { Label } from '../primitives/label';
import { cn } from '@energyiq/shared';

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select...',
  options,
  disabled,
  className,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>{label}</Label>
          <Select
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(error && 'border-destructive focus:ring-destructive')}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}
    />
  );
}
