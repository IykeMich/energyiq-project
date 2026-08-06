import { cn } from '@energyiq/shared';
import type { DistributorSummary } from '@/ui/pages/distributor/mocks';

interface StatCardProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

function StatCard({ label, value, valueClassName }: StatCardProps) {
  return (
    <div className="bg-[#FFFFFF1A] rounded-[14px] px-6 py-5 flex flex-col gap-3 min-h-25">
      <p className="text-sm text-foreground/80 font-normal">{label}</p>
      <p className={cn('text-[28px] font-semibold text-foreground leading-none', valueClassName)}>
        {value}
      </p>
    </div>
  );
}

interface DistributorSummaryStatsProps {
  summary: DistributorSummary;
}

export function DistributorSummaryStats({ summary }: DistributorSummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Distributors" value={summary.total} />
      <StatCard label="Active this Month" value={summary.activeThisMonth} valueClassName="text-success" />
      <StatCard label="Gold Tier:" value={summary.goldTier} />
      <StatCard label="Pending Approval" value={summary.pendingApproval} />
    </div>
  );
}
