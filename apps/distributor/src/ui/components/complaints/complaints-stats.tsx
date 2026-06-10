import { ComplaintsStatCard } from './complaints-stat-card';
import { COMPLAINT_STATS } from './complaints-mocks';

/** "Today" panel: the four complaint KPI tiles. */
export function ComplaintsStats() {
  return (
    <div className="flex flex-col gap-4 rounded-[18px] bg-[#6161611A] p-6">
      <p className="text-sm text-[#FAFAFA]">Today</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COMPLAINT_STATS.map((stat) => (
          <ComplaintsStatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
