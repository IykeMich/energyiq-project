import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
}

export function TextField({ value, onChange, placeholder, type = 'text' }: TextFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-surface-card border border-border-strong h-[52px] rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
    />
  );
}

interface TextAreaProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-surface-card border border-border-strong rounded-[24px] p-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand resize-none"
    />
  );
}

interface SelectFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  options: readonly { value: string; label: string }[] | readonly string[];
}

export function SelectField({ value, onChange, placeholder, options }: SelectFieldProps) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? '')}>
      <SelectTrigger className="bg-surface-card border-border-strong h-[52px] rounded-[28px] text-foreground px-5 justify-between">
        <SelectValue placeholder={placeholder} />
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </SelectTrigger>
      <SelectContent>
        {normalized.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
