import { ArrowUpRight } from 'lucide-react';
import type { DashboardOverviewKpi } from './dashboard-overview-mocks';

type DashboardOverviewKpiCardProps = DashboardOverviewKpi & { isEmpty?: boolean };

export function DashboardOverviewKpiCard({
  title,
  value,
  emptyValue,
  Icon,
  trend,
  dueTag,
  payButton,
  statuses,
  isEmpty = false,
}: DashboardOverviewKpiCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#FFFFFF1A] p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-[#FBC02D]" aria-hidden="true" />
        <h4 className="text-lg font-medium text-white">{title}</h4>
      </div>

      <p className="text-[22px] font-semibold text-white">{isEmpty ? emptyValue : value}</p>

      {!isEmpty && (
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {trend && (
              <span className="flex items-center gap-1 text-xs text-[#388E3C]">
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                {trend}
              </span>
            )}
            {dueTag && <span className="text-xs text-[#FB8C1C]">{dueTag}</span>}
            {statuses?.map((status) => (
              <span key={status.label} className="flex items-center gap-1.5 text-xs text-[#FFFFFFCC]">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: status.dotColor }}
                />
                {status.label}
                {status.value && (
                  <span className="font-bold" style={{ color: status.valueColor }}>
                    {status.value}
                  </span>
                )}
              </span>
            ))}
          </div>
          {payButton && (
            <button
              type="button"
              className="tap-effect shrink-0 rounded-2xl bg-[#FBC02D] px-4 py-1 text-xs font-semibold text-[#121212]"
            >
              Pay Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
