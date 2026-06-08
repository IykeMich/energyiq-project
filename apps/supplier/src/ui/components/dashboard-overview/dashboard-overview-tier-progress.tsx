import { DashboardOverviewSectionTitle } from './dashboard-overview-section-title';
import { TIER_PROGRESS, TIER_PROGRESS_EMPTY } from './dashboard-overview-mocks';

interface DashboardOverviewTierProgressProps {
  isEmpty?: boolean;
}

export function DashboardOverviewTierProgress({
  isEmpty = false,
}: DashboardOverviewTierProgressProps) {
  const { label, percent, footnote, inlineHint, nextHint, benefits } = isEmpty
    ? TIER_PROGRESS_EMPTY
    : TIER_PROGRESS;

  return (
    <div className="rounded-[15px] bg-[#6161611A] p-6">
      <DashboardOverviewSectionTitle title="Tier Progress" />
      {footnote && <p className="mt-2 text-[10px] italic text-[#FAFAFA]">{footnote}</p>}

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-base text-[#C0C0C0]">{label}</p>
        {inlineHint && <p className="text-sm text-[#FAFAFA]">{inlineHint}</p>}
      </div>

      <div className="mt-3 h-[17px] w-full overflow-hidden rounded-[7px] bg-[#616161B2]">
        <div
          className="h-full rounded-[7px]"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #FBC02D 0%, #0288D1 94.52%)',
          }}
        />
      </div>
      {nextHint && <p className="mt-2 text-right text-xs text-[#FAFAFA]">{nextHint}</p>}

      <p className="mt-4 text-sm font-medium text-[#C0C0C0]">Unlocks:</p>
      <ul className="mt-1 flex flex-col gap-1 text-xs text-[#C0C0C0]">
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </div>
  );
}
