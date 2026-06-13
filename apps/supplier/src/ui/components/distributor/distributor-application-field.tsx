import { cn } from '@energyiq/shared';

interface DistributorApplicationFieldProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

export function DistributorApplicationField({
  label,
  value,
  valueClassName,
}: DistributorApplicationFieldProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('text-right font-semibold text-foreground', valueClassName)}>{value}</dd>
    </div>
  );
}
