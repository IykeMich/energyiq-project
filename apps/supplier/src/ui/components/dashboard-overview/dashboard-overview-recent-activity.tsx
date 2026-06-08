import { DashboardOverviewSectionTitle } from './dashboard-overview-section-title';
import {
  DASHBOARD_RECENT_ACTIVITY,
  RECENT_ACTIVITY_EMPTY_MESSAGE,
} from './dashboard-overview-mocks';

interface DashboardOverviewRecentActivityProps {
  isEmpty?: boolean;
}

export function DashboardOverviewRecentActivity({
  isEmpty = false,
}: DashboardOverviewRecentActivityProps) {
  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-[#6161611A] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <DashboardOverviewSectionTitle
        title="Recent Activity"
        size="lg"
        right={
          isEmpty ? undefined : (
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-light text-[#FBC02D] hover:underline"
            >
              See all
            </button>
          )
        }
      />
      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-sm text-[#9E9E9E]">{RECENT_ACTIVITY_EMPTY_MESSAGE}</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {DASHBOARD_RECENT_ACTIVITY.map((item, index) => {
            const isLast = index === DASHBOARD_RECENT_ACTIVITY.length - 1;
            return (
              <li key={item.description} className={isLast ? '' : 'border-b border-[#616161B2] pb-4'}>
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-white" />
                  <div className="flex flex-col gap-1">
                    <p className="text-base leading-snug text-white">{item.description}</p>
                    <p className="text-xs text-[#FFFFFFCC]">{item.timestamp}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
