import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '../primitives/input-otp';
import { Label } from '../primitives/label';
import { cn } from '@energyiq/shared';

interface OtpFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function OtpField<T extends FieldValues>({
  control,
  name,
  label,
  length = 6,
  disabled,
  className,
}: OtpFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label && <Label>{label}</Label>}
          <div className="flex justify-center">
            <InputOTP
              maxLength={length}
              value={field.value as string}
              onChange={field.onChange}
              disabled={disabled}
            >
              <InputOTPGroup>
                {Array.from({ length: Math.floor(length / 2) }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {Array.from({ length: Math.ceil(length / 2) }, (_, i) => (
                  <InputOTPSlot key={i + Math.floor(length / 2)} index={i + Math.floor(length / 2)} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <p className="text-destructive text-xs text-center">{error.message}</p>}
        </div>
      )}
    />
  );
}
