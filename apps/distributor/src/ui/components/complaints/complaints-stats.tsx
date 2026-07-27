import type { AppDistributorComplaintSummary } from '@energyiq/api/generated/schemas';
import { ComplaintsStatCard } from './complaints-stat-card';

interface ComplaintsStatsProps {
  summary: AppDistributorComplaintSummary | undefined;
  isLoading?: boolean;
}

/** "Today" panel: the four complaint KPI tiles. */
export function ComplaintsStats({ summary, isLoading }: ComplaintsStatsProps) {
  const cards = [
    summary?.total_complaints,
    summary?.open_in_review,
    summary?.resolved,
    summary?.average_resolution_time,
  ].filter((card) => card !== undefined);

  return (
    <div className="flex flex-col gap-4 rounded-[18px] bg-[#6161611A] p-6">
      <p className="text-sm text-[#FAFAFA]">Today</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[120px] animate-pulse rounded-2xl bg-[#FFFFFF1A]" />
            ))
          : cards.map((stat, index) => <ComplaintsStatCard key={stat?.label ?? index} stat={stat!} />)}
      </div>
    </div>
  );
}
