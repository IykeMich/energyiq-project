import { cn } from '@energyiq/shared';

interface DistributorDetailsRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

/** One label/value line used across the details sheet (email card, contact, performance). */
export function DistributorDetailsRow({ label, value, valueClassName }: DistributorDetailsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#FFFFFFCC]">{label}</span>
      <span className={cn('text-sm text-[#FAFAFA]', valueClassName)}>{value}</span>
    </div>
  );
}
