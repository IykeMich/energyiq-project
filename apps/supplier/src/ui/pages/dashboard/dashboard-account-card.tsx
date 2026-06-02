import { cn } from '@energyiq/shared';

interface DashboardAccountCardProps {
  label: string;
  value: string;
  className?: string;
}

export function DashboardAccountCard({ label, value, className }: DashboardAccountCardProps) {
  return (
    <div className={cn('bg-[#FFFFFF1A] rounded-lg py-6 px-4 gap-3 flex flex-col', className)}>
      <p className="text-sm font-normal text-white mb-1">{label}</p>
      <p className="text-xl lg:text-[22px] 2xl:text-[24px] font-semibold text-white leading-[100%] tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}
