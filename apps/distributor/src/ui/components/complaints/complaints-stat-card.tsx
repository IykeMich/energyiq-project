import type { AppDistributorComplaintSummaryCard } from '@energyiq/api/generated/schemas';

interface ComplaintsStatCardProps {
  stat: AppDistributorComplaintSummaryCard;
}

/** A single KPI tile in the "Today" stats row. */
export function ComplaintsStatCard({ stat }: ComplaintsStatCardProps) {
  return (
    <div className="flex min-h-[120px] flex-col gap-4 rounded-2xl bg-[#FFFFFF1A] px-6 py-5">
      <p className="text-sm font-normal text-[#FFFFFFCC]">{stat.label}</p>
      <p className="mt-auto text-[32px] font-bold leading-none text-white">{stat.value}</p>
    </div>
  );
}
