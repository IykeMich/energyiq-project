import { ComplaintsStatCard } from './complaints-stat-card';
import type { ComplaintStat } from './complaints-mocks';

interface ComplaintsStatsProps {
  stats: ComplaintStat[];
}

/** "Today" panel: the four complaint KPI tiles. */
export function ComplaintsStats({ stats }: ComplaintsStatsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[18px] bg-[#6161611A] p-6">
      <p className="text-sm text-[#FAFAFA]">Today</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <ComplaintsStatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
