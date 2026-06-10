import type { ComplaintStat } from './complaints-mocks';

interface ComplaintsStatCardProps {
  stat: ComplaintStat;
}

/** A single KPI tile in the "Today" stats row. */
export function ComplaintsStatCard({ stat }: ComplaintsStatCardProps) {
  return (
    <div className="flex min-h-[120px] flex-col gap-4 rounded-2xl bg-[#FFFFFF1A] px-6 py-5">
      <p className="text-sm font-normal text-[#FFFFFFCC]">{stat.label}</p>
      <div className="mt-auto flex items-end justify-between gap-2">
        <p className="text-[32px] font-bold leading-none text-white">{stat.value}</p>
        <p className="text-xs text-[#FFFFFFCC]">
          {stat.noteHighlight && (
            <span className="font-semibold" style={{ color: stat.noteHighlightColor }}>
              {stat.noteHighlight}
            </span>
          )}
          {stat.note}
        </p>
      </div>
    </div>
  );
}
