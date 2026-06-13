import { cn } from '@energyiq/shared';

interface DistributorDetailsStatBoxProps {
  label: string;
  value: string | number;
  /** Override the value colour (e.g. gold for "Invite expired", green for KYC). */
  valueClassName?: string;
}

/** Compact bordered label/value box used by the Invite Details and KYC strips. */
export function DistributorDetailsStatBox({ label, value, valueClassName }: DistributorDetailsStatBoxProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[#FFFFFF1A] bg-[#6161611A] px-3 py-2.5">
      <span className="text-[10px] leading-tight text-[#FFFFFFCC]">{label}</span>
      <span className={cn('text-sm font-semibold text-[#FAFAFA]', valueClassName)}>{value}</span>
    </div>
  );
}
