import { DashboardOverviewAssuranceBanner } from './dashboard-overview-assurance-banner';
import { DashboardOverviewKpiPanel } from './dashboard-overview-kpi-panel';
import { DashboardOverviewRecentActivity } from './dashboard-overview-recent-activity';
import { DashboardOverviewAlerts } from './dashboard-overview-alerts';
import { DashboardOverviewTierProgress } from './dashboard-overview-tier-progress';
import { DashboardOverviewOrderVolumeChart } from './dashboard-overview-order-volume-chart';
import { DashboardOverviewMonthlySpendChart } from './dashboard-overview-monthly-spend-chart';
import { DashboardOverviewQuickActions } from './dashboard-overview-quick-actions';
import { ASSURANCE_SUMMARY } from './dashboard-overview-mocks';

interface DashboardOverviewProps {
  /** Renders the no-data / loading state (zeroed KPIs and empty-state messages). */
  isEmpty?: boolean;
}

export function DashboardOverview({ isEmpty = false }: DashboardOverviewProps) {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3">
        <h1 className="text-[36px] font-semibold leading-tight text-white">Dashboard Overview</h1>
        <p className="mt-1 text-base text-white">
          Welcome back! Here&apos;s your business performance summary.
        </p>
      </header>

      <DashboardOverviewAssuranceBanner summary={ASSURANCE_SUMMARY} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardOverviewKpiPanel isEmpty={isEmpty} />
        <DashboardOverviewRecentActivity isEmpty={isEmpty} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col gap-6 lg:w-[42%]">
          <DashboardOverviewAlerts isEmpty={isEmpty} />
          <DashboardOverviewTierProgress isEmpty={isEmpty} />
        </div>
        <DashboardOverviewOrderVolumeChart isEmpty={isEmpty} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardOverviewMonthlySpendChart isEmpty={isEmpty} />
        <div className="lg:w-[42%]">
          <DashboardOverviewQuickActions />
        </div>
      </div>
    </section>
  );
}
