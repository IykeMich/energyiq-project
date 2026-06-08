import { DashboardOverviewSectionTitle } from './dashboard-overview-section-title';
import { DASHBOARD_ALERTS, ALERTS_EMPTY_MESSAGE } from './dashboard-overview-mocks';

const DOT_COLOR: Record<'critical' | 'warning', string> = {
  critical: '#D30A0A',
  warning: '#FB8C1C',
};

interface DashboardOverviewAlertsProps {
  isEmpty?: boolean;
}

export function DashboardOverviewAlerts({ isEmpty = false }: DashboardOverviewAlertsProps) {
  return (
    <div className="rounded-[15px] bg-[#6161611A] p-6">
      <DashboardOverviewSectionTitle title="Alerts" />
      {isEmpty ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-[#9E9E9E]">{ALERTS_EMPTY_MESSAGE}</p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-4">
          {DASHBOARD_ALERTS.map((alert) => (
            <li key={alert.description} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: DOT_COLOR[alert.level] }}
              />
              <div className="flex flex-col gap-1">
                <p className="text-base leading-snug text-white">{alert.description}</p>
                <p className="text-xs text-[#FFFFFFCC]">{alert.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
