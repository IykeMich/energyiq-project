import { SlidersHorizontal } from 'lucide-react';
import { DashboardOverviewFilterChip } from './dashboard-overview-filter-chip';
import { DASHBOARD_FILTERS } from './dashboard-overview-mocks';
import type { DashboardFilterKey } from './dashboard-overview-mocks';

interface DashboardOverviewFilterChipsProps {
  filters: DashboardFilterKey[];
}

/** The row of pill-style filter dropdowns shown in a chart panel header. */
export function DashboardOverviewFilterChips({ filters }: DashboardOverviewFilterChipsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      {filters.map((key) => (
        <DashboardOverviewFilterChip key={key} {...DASHBOARD_FILTERS[key]} />
      ))}
    </div>
  );
}
