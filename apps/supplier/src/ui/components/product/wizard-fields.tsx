import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({ label, required, children, className }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <label className="text-sm text-foreground">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

interface TextFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
}

export function TextField({ value, onChange, placeholder, type = 'text', error }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'bg-surface-card border border-border-strong h-[52px] rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand',
          error && 'border-destructive focus:border-destructive',
        )}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  /** When set, the control shows the destructive border and the message below it. */
  error?: string;
}

export function TextAreaField({ value, onChange, placeholder, rows = 4, error }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'bg-surface-card border border-border-strong rounded-[24px] p-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand resize-none',
          error && 'border-destructive focus:border-destructive',
        )}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  /** When set, the trigger shows the destructive border and the message below it. */
  error?: string;
}

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
}

export function CheckboxField({ checked, onChange, label }: CheckboxFieldProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 text-sm text-foreground"
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
}

/** Full-width status pill with a state label on the left and a green switch on the right. */
export function ToggleSwitch({
  checked,
  onChange,
  onLabel = 'Active',
  offLabel = 'Inactive',
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="bg-surface-card border border-border-strong h-[52px] rounded-[28px] px-5 w-full flex items-center justify-between transition-colors hover:border-brand"
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
  );
}

export type FormActionVariant = 'cancel' | 'forward';

const FORM_ACTION_VARIANT_CLASSES: Record<FormActionVariant, string> = {
  cancel: 'h-10.5 rounded-[28px] bg-[#616161B2] text-[#121212] font-semibold px-8',
  forward:
    'h-10.5 rounded-[28px] bg-brand text-brand-foreground font-semibold px-12 disabled:opacity-50 disabled:cursor-not-allowed',
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

export function SelectField({ value, onChange, placeholder, options, error }: SelectFieldProps) {
  const normalized = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));
  return (
    <div className="flex flex-col gap-1">
      <Select value={value} onValueChange={(v) => onChange(v ?? '')}>
        <SelectTrigger
          className={cn(
            'bg-surface-card border-border-strong data-[size=default]:h-13 w-full cursor-pointer rounded-[28px] text-foreground px-5 transition-colors hover:border-brand',
            error && 'border-destructive focus:ring-destructive',
          )}
        >
          <SelectValue placeholder={placeholder}>
            {(selectedValue: string) =>
              normalized.find((option) => option.value === selectedValue)?.label ?? selectedValue
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
  );
}
