import { cn } from '@energyiq/shared';

interface InviteFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  optional?: boolean;
  currency?: boolean;
}

/** Comma-groups a raw digit string for display (e.g. "50000" -> "50,000"). */
function formatCurrency(digits: string): string {
  if (!digits) return '';
  const parts = digits.split('.');
  const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${whole}.${parts[1].slice(0, 2)}` : whole;
}

export function InviteFormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  optional,
  currency,
}: InviteFormFieldProps) {
  const handleChange = (raw: string) => {
    onChange(currency ? raw.replace(/[^\d.]/g, '') : raw);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
        {optional && <span className="text-warning ml-1 text-xs font-medium">(OPTIONAL)</span>}
      </label>

      <div className="relative">
        {currency && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
        )}
        <input
          id={id}
          type={currency ? 'text' : type}
          inputMode={currency ? 'decimal' : undefined}
          placeholder={placeholder}
          value={currency ? formatCurrency(value) : value}
          onChange={(event) => handleChange(event.target.value)}
          className={cn(
            'h-[52px] w-full rounded-[28px] border border-border-strong bg-surface-card px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand',
            currency && 'pl-9',
          )}
        />
      </div>
    </div>
  );
}
