import { CHART_EMPTY_MESSAGE } from './dashboard-overview-mocks';

/** Centered "No data yet…" message shown in place of a chart in the empty/loading state. */
export function DashboardOverviewEmptyChart() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <p className="max-w-md whitespace-pre-line text-center text-sm italic text-[#FFFFFFCC]">
        {CHART_EMPTY_MESSAGE}
      </p>
    </div>
  );
}
