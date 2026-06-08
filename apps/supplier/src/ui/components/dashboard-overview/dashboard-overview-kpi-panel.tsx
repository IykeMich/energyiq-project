import { DashboardOverviewKpiCard } from './dashboard-overview-kpi-card';
import { DASHBOARD_KPIS } from './dashboard-overview-mocks';

interface DashboardOverviewKpiPanelProps {
  isEmpty?: boolean;
}

export function DashboardOverviewKpiPanel({ isEmpty = false }: DashboardOverviewKpiPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[18px] bg-[#6161611A] p-5 lg:w-[65%]">
      <p className="text-sm font-light text-white">Updated 5 mins ago</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DASHBOARD_KPIS.map((kpi) => (
          <DashboardOverviewKpiCard key={kpi.title} {...kpi} isEmpty={isEmpty} />
        ))}
      </div>
    </div>
  );
}
