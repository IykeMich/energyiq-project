import { useState } from 'react';
import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Input } from '../primitives/input';
import { Label } from '../primitives/label';
import { Button } from '../primitives/button';
import { cn } from '@energyiq/shared';

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  className,
}: PasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>{label}</Label>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={visible ? 'text' : 'password'}
              placeholder={placeholder}
              disabled={disabled}
              className={cn('pr-16', error && 'border-destructive focus-visible:ring-destructive')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setVisible(!visible)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {visible ? 'Hide' : 'Show'}
            </Button>
          </div>
          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}
    />
  );
}
