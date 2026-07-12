import type { employee } from '@energyiq/domain';
import { TeamPermissionsStatCard } from './team-permissions-stat-card';
import type { EmployeeStat } from './team-permissions-mocks';

interface TeamPermissionsStatStripProps {
  /** Backend employee stats. When undefined or while loading, figures collapse to "-". */
  stats?: employee.EmployeeStats;
}

/** Zeroed counterpart of a KPI card, shown while no figures are available. */
function toPlaceholderStat(stat: EmployeeStat): EmployeeStat {
  return { title: stat.title, value: '-' };
}

const STAT_TITLES: EmployeeStat[] = [
  { title: 'Total Employees:', value: '0' },
  { title: 'Active Employees:', value: '0' },
  { title: 'Pending Invitations:', value: '0' },
  { title: 'Inactive Accounts:', value: '0' },
];

/** The Employee Management KPI strip: a row of four headline figures. */
export function TeamPermissionsStatStrip({ stats }: TeamPermissionsStatStripProps) {
  const figures: EmployeeStat[] = stats
    ? [
        { title: 'Total Employees:', value: String(stats.total ?? 0) },
        { title: 'Active Employees:', value: String(stats.active ?? 0) },
        { title: 'Pending Invitations:', value: String(stats.pending_invitations ?? 0) },
        { title: 'Inactive Accounts:', value: String(stats.inactive_accounts ?? 0) },
      ]
    : STAT_TITLES.map(toPlaceholderStat);

  return (
    <div className="rounded-[18px] bg-[#6161611A] p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((stat) => (
          <TeamPermissionsStatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
