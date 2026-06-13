import { cn } from '@energyiq/shared';

interface TeamPermissionsInviteFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  /** Appends a gold asterisk to the label. */
  required?: boolean;
  /** Muted helper text shown below the input when there is no error. */
  hint?: string;
  /** Validation message; when set, the input shows a red border and the message. */
  error?: string;
}

/** Large rounded-pill form field used inside the Invite Employee modal. */
export function TeamPermissionsInviteField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  required,
  hint,
  error,
}: TeamPermissionsInviteFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-brand">*</span>}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={cn(
          'h-[52px] w-full rounded-[28px] border border-border-strong bg-surface-card px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand',
          error && 'border-danger focus:border-danger',
        )}
      />

      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
