import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Textarea } from '../primitives/textarea';
import { Label } from '../primitives/label';
import { cn } from '@energyiq/shared';

interface TextareaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  optional?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  optional,
  disabled,
  className,
}: TextareaFieldProps<T>) {
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
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
          />
          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}
    />
  );
}
