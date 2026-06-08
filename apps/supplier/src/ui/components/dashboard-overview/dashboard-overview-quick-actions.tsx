import { DashboardOverviewSectionTitle } from './dashboard-overview-section-title';
import { DASHBOARD_QUICK_ACTIONS } from './dashboard-overview-mocks';

export function DashboardOverviewQuickActions() {
  return (
    <div className="flex flex-col rounded-[18px] bg-[#6161611A] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <DashboardOverviewSectionTitle title="Quick Actions" size="lg" />
      <div className="mt-6 grid grid-cols-2 gap-4">
        {DASHBOARD_QUICK_ACTIONS.map(({ title, Icon }) => (
          <button
            key={title}
            type="button"
            className="tap-effect flex h-[100px] flex-col items-center justify-center gap-2 rounded-2xl bg-[#FFFFFF1A] text-white"
          >
            <Icon className="h-7 w-7 text-[#FBC02D]" aria-hidden="true" />
            <span className="text-base font-semibold">{title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
