import { cn } from '@energyiq/shared';
import type { ComplaintStat } from './complaints-mocks';

/** Single KPI card in the "Today" strip: title, large value, and an optional delta pill or subtitle. */
export function ComplaintsStatCard({ title, value, delta, subtitle }: ComplaintStat) {
  return (
    <div className="flex flex-col justify-between gap-8 rounded-3xl bg-[#FFFFFF14] p-7">
      <h4 className="text-xl font-normal text-[#E5E5E5]">{title}</h4>
      <div className="flex items-end justify-between gap-4">
        <span className="text-4xl font-bold text-white">{value}</span>
        {delta && (
          <span
            className={cn(
              'text-sm font-medium',
              delta.trend === 'positive' ? 'text-[#388E3C]' : 'text-[#D30A0A]',
            )}
          >
            {delta.label}
          </span>
        )}
        {subtitle && <span className="text-sm font-medium text-[#FAFAFA]">{subtitle}</span>}
      </div>
    </div>
  );
}
