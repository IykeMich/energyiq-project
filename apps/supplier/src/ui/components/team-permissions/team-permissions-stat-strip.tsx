import { TeamPermissionsStatCard } from './team-permissions-stat-card';
import { EMPLOYEE_STATS, type EmployeeStat } from './team-permissions-mocks';

interface TeamPermissionsStatStripProps {
  /** While loading or before any team exists, the figures collapse to a neutral "-". */
  placeholder?: boolean;
}

/** Zeroed counterpart of a KPI card, shown while no figures are available. */
function toPlaceholderStat(stat: EmployeeStat): EmployeeStat {
  return { title: stat.title, value: '-' };
}

/** The Employee Management KPI strip: a row of four headline figures. */
export function TeamPermissionsStatStrip({ placeholder = false }: TeamPermissionsStatStripProps) {
  const stats = placeholder ? EMPLOYEE_STATS.map(toPlaceholderStat) : EMPLOYEE_STATS;

  return (
    <div className="rounded-[18px] bg-[#6161611A] p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <TeamPermissionsStatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
