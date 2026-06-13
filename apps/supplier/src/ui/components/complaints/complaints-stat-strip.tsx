import { ComplaintsStatCard } from './complaints-stat-card';
import { COMPLAINT_STATS, type ComplaintStat } from './complaints-mocks';

interface ComplaintsStatStripProps {
  /** When there are no complaints yet, the figures collapse to a neutral zero state. */
  isEmpty?: boolean;
}

/** Zeroed counterparts of the KPI cards, shown while no complaints exist. */
function toEmptyStat(stat: ComplaintStat): ComplaintStat {
  return { title: stat.title, value: stat.value.includes('%') ? '0%' : '0' };
}

/** The "Today" panel: a labelled strip of four complaint KPIs. */
export function ComplaintsStatStrip({ isEmpty = false }: ComplaintsStatStripProps) {
  const stats = isEmpty ? COMPLAINT_STATS.map(toEmptyStat) : COMPLAINT_STATS;

  return (
    <div className="flex flex-col gap-4 rounded-[18px] bg-[#6161611A] p-6">
      <p className="text-sm font-medium text-[#FAFAFA]">Today</p>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <ComplaintsStatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
