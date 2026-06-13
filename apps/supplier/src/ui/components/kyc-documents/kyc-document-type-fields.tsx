import { type Control, type FieldValues, type Path, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import { cn } from '@energyiq/shared';

const CONTROL_BASE =
  'h-[52px] w-full rounded-xl border bg-[#FFFFFF0F] px-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500';
const CONTROL_IDLE = 'border-[#27272A] focus:border-[#FBC02D]';
const CONTROL_ERROR = 'border-[#D30A0A] focus:border-[#D30A0A]';

interface FieldShellProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

/** Label + control + error text, shared by every field wrapper below. */
function FieldShell({ label, required, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300">
        {label}
        {required && <span className="ml-1 text-[#D30A0A]">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#D30A0A]">{error}</p>}
    </div>
  );
}

interface BaseFieldProps<FormValues extends FieldValues> {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
}

/** Single-line text input bound to react-hook-form. */
export function KycTextField<FormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
}: BaseFieldProps<FormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FieldShell label={label} required={required} error={error?.message}>
          <input
            {...field}
            placeholder={placeholder}
            className={cn(CONTROL_BASE, error ? CONTROL_ERROR : CONTROL_IDLE)}
          />
        </FieldShell>
      )}
    />
  );
}

/** Multi-line text input bound to react-hook-form. */
export function KycTextareaField<FormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
}: BaseFieldProps<FormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FieldShell label={label} required={required} error={error?.message}>
          <textarea
            {...field}
            placeholder={placeholder}
            rows={1}
            className={cn(
              CONTROL_BASE,
              'h-[52px] resize-none py-3.5',
              error ? CONTROL_ERROR : CONTROL_IDLE,
            )}
          />
        </FieldShell>
      )}
    />
  );
}

interface SelectFieldProps<FormValues extends FieldValues> extends BaseFieldProps<FormValues> {
  options: Array<{ value: string; label: string }>;
}

/** Dropdown select bound to react-hook-form, reusing the design-system Select primitive. */
export function KycSelectField<FormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select...',
  required,
  options,
}: SelectFieldProps<FormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FieldShell label={label} required={required} error={error?.message}>
          <Select value={field.value as string} onValueChange={(value) => field.onChange(value ?? '')}>
            <SelectTrigger
              onBlur={field.onBlur}
              className={cn(
                'data-[size=default]:h-[52px] w-full cursor-pointer rounded-xl bg-[#FFFFFF0F] px-4 text-white',
                error ? 'border-[#D30A0A]' : 'border-[#27272A] hover:border-[#FBC02D]',
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="start" sideOffset={6} alignItemWithTrigger={false}>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}
