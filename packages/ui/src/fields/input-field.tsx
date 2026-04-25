import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Input } from '../primitives/input';
import { Label } from '../primitives/label';
import { cn } from '@energyiq/shared';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  optional?: boolean;
  disabled?: boolean;
  className?: string;
}

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  optional,
  disabled,
  className,
}: InputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>
            {label}
            {optional && <span className="text-muted-foreground ml-1 text-xs">(optional)</span>}
          </Label>
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
          />
          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}
    />
  );
}
