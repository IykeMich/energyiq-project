import { TrendingUp } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { DistributorSummary } from '@/ui/pages/distributor/mocks';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  valueClassName?: string;
}

function StatCard({ label, value, trend, valueClassName }: StatCardProps) {
  return (
    <div className="bg-foreground/10 rounded-2xl px-6 py-5 flex flex-col gap-3 min-h-[100px]">
      <p className="text-sm text-foreground/80 font-normal">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className={cn('text-[28px] font-semibold text-foreground leading-none', valueClassName)}>
          {value}
        </p>
        {trend === 'up' && (
          <TrendingUp className="w-5 h-5 text-success shrink-0 mb-1" />
        )}
      </div>
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
      <StatCard label="Active This Month" value={summary.activeThisMonth} trend="up" valueClassName="text-success" />
      <StatCard label="Cold Tier" value={summary.coldTier} />
      <StatCard label="Pending Approval" value={summary.pendingApproval} valueClassName="text-warning" />
    </div>
  );
}
