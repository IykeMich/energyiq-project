import { TrendingUp } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { SalesKpi } from './sales-entry-mocks';

/** Coloured change indicator beside the value: green/up trend or a muted "stable" dot. */
function KpiDelta({ label, trend }: NonNullable<SalesKpi['delta']>) {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-[#388E3C]">
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-[#9E9E9E]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#9E9E9E]" aria-hidden="true" />
      {label}
    </span>
  );
}

/** One KPI card in the Sales Entry summary strip: label, large value and an optional delta. */
export function SalesEntryKpiCard({ label, value, delta }: SalesKpi) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#616161B2] bg-[#FFFFFF1A] px-5 py-4">
      <span className="text-xs font-normal text-[#9E9E9E]">{label}</span>
      <div className={cn('flex items-end justify-between gap-3', !delta && 'min-h-[1.75rem]')}>
        <span className="text-2xl font-semibold text-[#FAFAFA]">{value}</span>
        {delta && <KpiDelta {...delta} />}
      </div>
    </div>
  );
}
