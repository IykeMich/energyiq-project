import { useRef, type ReactNode } from 'react';
import { Calendar, Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';

function FieldLabel({
  label,
  required,
  optional,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm text-foreground">
      {label}
      {required && <span className="text-danger ml-1">*</span>}
      {optional && <span className="text-warning ml-1 text-xs font-medium">(OPTIONAL)</span>}
    </label>
  );
}

/** Comma-groups a raw digit string for display (e.g. "50000" -> "50,000"). */
function formatCurrency(digits: string): string {
  if (!digits) return '';
  const parts = digits.split('.');
  const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${whole}.${parts[1].slice(0, 2)}` : whole;
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/** Generic label+control wrapper for controls that don't accept a `label` prop directly (e.g. `@energyiq/ui`'s `NumericTextField`). Prefer passing `label` straight to `TextField`/`SelectField`/etc. when available. */
export function Field({ label, required, children, className }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <FieldLabel label={label} required={required} />
      {children}
    </div>
  );
}

interface TextFieldProps {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  label?: string;
  required?: boolean;
  /** Shows an "(OPTIONAL)" badge next to the label instead of a required asterisk. */
  optional?: boolean;
  disabled?: boolean;
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
  className?: string;
  /** Formats the value as comma-grouped digits and shows a ₦ prefix inside the field (e.g. an assurance amount). */
  currency?: boolean;
}

export function TextField({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  required,
  optional,
  disabled,
  error,
  className,
  currency,
}: TextFieldProps) {
  const handleChange = (raw: string) => {
    onChange(currency ? raw.replace(/[^\d.]/g, '') : raw);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} required={required} optional={optional} htmlFor={id} />}
      <div className="flex flex-col gap-1">
        <div className="relative">
          {currency && (
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
          )}
          <input
            id={id}
            type={currency ? 'text' : type}
            inputMode={currency ? 'decimal' : undefined}
            value={currency ? formatCurrency(value) : value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'bg-[#6161611A] focus:border border-border-strong h-13 rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed',
              currency && 'pl-9',
              error && 'border-destructive focus:border-destructive',
              className,
            )}
          />
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}

interface PrefixedTextFieldProps {
  prefix: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
  className?: string;
}

/** Numeric field with a glyph prefix inside the control, e.g. a currency symbol before a price. */
export function PrefixedTextField({
  prefix,
  value,
  onChange,
  placeholder,
  label,
  required,
  disabled,
  error,
  className,
}: PrefixedTextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} required={required} />}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'bg-[#6161611A] focus-within:border border-border-strong h-13 rounded-[28px] px-5 flex items-center gap-2 text-foreground transition-colors focus-within:border-brand',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-destructive focus-within:border-destructive',
            className,
          )}
        >
          <span className="text-muted-foreground text-sm">{prefix}</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}

interface DateFieldProps {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
  className?: string;
}

/** Native date input with a calendar icon on the right, matching the design's date fields. */
export function DateField({ value, onChange, label, required, disabled, error, className }: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (disabled) return;
    const input = inputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (input?.showPicker) {
      input.showPicker();
    } else {
      input?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} required={required} />}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            ref={inputRef}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
              // Hide the browser's own calendar-picker glyph so only the icon button below is visible/clickable.
              'bg-[#6161611A] border border-border-strong h-13 rounded-[28px] px-5 pr-12 w-full text-foreground outline-none focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:opacity-0',
              error && 'border-destructive focus:border-destructive',
              className,
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={openPicker}
            disabled={disabled}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground disabled:cursor-not-allowed"
          >
            <Calendar className="h-5 w-5" />
          </button>
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
  className?: string;
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 4,
  label,
  required,
  disabled,
  error,
  className,
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} required={required} />}
      <div className="flex flex-col gap-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={cn(
            'bg-[#6161611A] focus:border border-border-strong rounded-[24px] p-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand resize-none disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-destructive focus:border-destructive',
            className,
          )}
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}

interface SelectFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  /** When set, the trigger shows the destructive border and the message below it. */
  error?: string;
  /** Merged onto the trigger, e.g. to override the default height/radius. */
  className?: string;
}

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
}

export function CheckboxField({ checked, onChange, label, disabled }: CheckboxFieldProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className="flex items-center gap-2.5 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span
        className={cn(
          'w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 transition-colors',
          checked ? 'bg-brand border-brand text-brand-foreground' : 'border-border-strong bg-surface-card',
        )}
      >
        {checked && <Check className="w-3 h-3 tap-effect" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Full-width status pill with a state label on the left and a green switch on the right. */
export function ToggleSwitch({
  checked,
  onChange,
  onLabel = 'Active',
  offLabel = 'Inactive',
  label,
  required,
  disabled,
  className = '',
}: ToggleSwitchProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} required={required} />}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={cn(
          'bg-surface-card border border-border-strong h-13 rounded-[28px] px-5 w-full flex items-center justify-between transition-colors hover:border-brand disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border-strong',
          className,
        )}
      >
        <span className={cn('text-sm font-medium', checked ? 'text-success' : 'text-muted-foreground')}>
          {checked ? onLabel : offLabel}
        </span>
        <span
          className={cn(
            'w-11 h-6 rounded-full p-0.5 flex items-center transition-colors',
            checked ? 'bg-success' : 'bg-foreground/20',
          )}
        >
          <span
            className={cn(
              'w-5 h-5 rounded-full bg-white transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </span>
      </button>
    </div>
  );
}

interface ToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** Pill toggle: outline when unselected, filled brand + check icon when selected (certifications, tiers, return reasons, ...). */
export function ToggleChip({ label, selected, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'tap-effect flex h-9 items-center gap-1.5 rounded-full border px-4.5 text-xs font-semibold transition-colors',
        selected
          ? 'border-brand bg-brand text-brand-foreground'
          : 'border-border-strong text-foreground font-normal hover:border-brand/50',
      )}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      {label}
    </button>
  );
}

interface ToggleSwitchCardProps {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

/** Rounded row: title + subtitle on the left, a brand-colored switch on the right (promo pricing, return policy, distributor restriction, ...). */
export function ToggleSwitchCard({ title, subtitle, checked, onChange }: ToggleSwitchCardProps) {
  return (
    <div className="rounded-[19px] bg-[#6161611A] px-6 py-3.5 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'tap-effect h-4 w-8.25 shrink-0 rounded-full p-0.5 flex items-center transition-colors',
          checked ? 'bg-brand' : 'bg-[#616161B2]',
        )}
      >
        <span
          className={cn('h-3 w-3 rounded-full bg-[#121212] transition-transform', checked && 'translate-x-4')}
        />
      </button>
    </div>
  );
}

export type FormActionVariant = 'cancel' | 'forward';

const FORM_ACTION_VARIANT_CLASSES: Record<FormActionVariant, string> = {
  cancel:
    'tap-effect h-10.5 rounded-[28px] bg-[#616161B2] text-[#121212] font-semibold px-8 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed',
  forward:
    'tap-effect h-10.5 rounded-[28px] bg-brand text-brand-foreground font-semibold px-12 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
};

interface FormActionButtonProps {
  variant: FormActionVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  children: ReactNode;
}

/** Shared Cancel/Save-style pill button for wizard and modal forms — pick `variant` for the look. */
export function FormActionButton({ variant, type = 'button', children, ...props }: FormActionButtonProps) {
  return (
    <button type={type} className={FORM_ACTION_VARIANT_CLASSES[variant]} {...props}>
      {children}
    </button>
  );
}

export type ToolbarActionVariant = 'outline' | 'filled';

const TOOLBAR_ACTION_VARIANT_CLASSES: Record<ToolbarActionVariant, string> = {
  outline:
    'tap-effect h-[42px] px-6 rounded-full border border-brand text-brand font-semibold text-sm hover:bg-brand/10',
  filled: 'tap-effect h-[42px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:opacity-90',
};

interface ToolbarActionButtonProps {
  variant: ToolbarActionVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  children: ReactNode;
}

/** Shared page-header toolbar pill button (e.g. "Transfer Stock" / "Create Warehouse") — pick `variant` for the look. */
export function ToolbarActionButton({ variant, type = 'button', children, ...props }: ToolbarActionButtonProps) {
  return (
    <button type={type} className={TOOLBAR_ACTION_VARIANT_CLASSES[variant]} {...props}>
      {children}
    </button>
  );
}

export function SelectField({ value, onChange, placeholder, options, label, required, disabled, error, className }: SelectFieldProps) {
  const normalized = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));
  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} required={required} />}
      <div className="flex flex-col gap-1">
        <Select value={value} onValueChange={(v) => onChange(v ?? '')} disabled={disabled}>
          <SelectTrigger
            className={cn(
              'bg-[#6161611A] border-0! focus:border-border-strong data-[size=default]:h-13 w-full cursor-pointer rounded-[28px] text-foreground px-5 transition-colors hover:border-brand disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-destructive focus:ring-destructive',
              className,
            )}
          >
            <SelectValue placeholder={placeholder}>
              {(selectedValue: string) =>
                selectedValue ? (
                  (normalized.find((option) => option.value === selectedValue)?.label ?? selectedValue)
                ) : (
                  <span className="italic">{placeholder}</span>
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            align="start"
            sideOffset={6}
            alignItemWithTrigger={false}
            className="w-(--anchor-width) rounded-[20px] border border-border-strong bg-surface-modal p-1.5"
          >
            {normalized.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="h-11 rounded-[14px] pl-4 text-sm text-foreground transition-colors hover:bg-foreground/5
              cursor-pointer data-[highlighted]:bg-foreground/10 data-[highlighted]:text-foreground data-[state=checked]:bg-brand/10 data-[state=checked]:text-brand-foreground"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}
