import { cn } from '@energyiq/shared';
import type { TankSummary } from '../mocks';

interface StatCardProps {
  label: string;
  value: string;
  valueClassName?: string;
  footer?: string;
  footerClassName?: string;
}

function StatCard({ label, value, valueClassName, footer, footerClassName }: StatCardProps) {
  return (
    <div className="bg-[#FFFFFF1A] rounded-2xl px-6 py-5 flex flex-col gap-2 min-h-[100px]">
      <p className="text-base text-white font-normal">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className={cn('text-[22px] font-semibold text-white leading-none', valueClassName)}>
          {value}
        </p>
        {footer && (
          <p className={cn('text-[10px] font-medium text-[#FAFAFA]', footerClassName)}>{footer}</p>
        )}
      </div>
    </div>
  );
}

interface TankSummaryStatsProps {
  summary: TankSummary;
}

export function TankSummaryStats({ summary }: TankSummaryStatsProps) {
  return (
    <div className="bg-[#6161611A] rounded-[18px] p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total tanks:"
          value={String(summary.totalTanks)}
          footer={`${summary.totalProducts} Products`}
        />
        <StatCard
          label="Alerts:"
          value={String(summary.alerts)}
          valueClassName="text-[#D30A0A]"
          footer="Needs attention"
          footerClassName="text-[#388E3C]"
        />
        <StatCard
          label="Last Dip:"
          value={summary.lastDip}
          footer={`Last: ${summary.lastDipTime}`}
          footerClassName="text-[#9E9E9E]"
        />
        <StatCard label="Avg Days left:" value={String(summary.avgDaysLeft)} />
      </div>
    </div>
  );
}
