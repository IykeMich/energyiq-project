import type { AssuranceSummary } from './dashboard-overview-mocks';

interface DashboardOverviewAssuranceBannerProps {
  summary: AssuranceSummary;
}

export function DashboardOverviewAssuranceBanner({ summary }: DashboardOverviewAssuranceBannerProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[23px] border border-[#FBC02D] bg-[#FBC02D33] p-6 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[22px] font-semibold text-[#FAFAFA]">
            Assurance Balance: {summary.balance}
          </h2>
          <span className="rounded-[22px] bg-[#388E3C33] px-5 py-0.5 text-base font-medium text-[#388E3C]">
            Active
          </span>
        </div>
        <ul className="flex flex-col gap-1.5 text-sm font-medium text-[#FAFAFACC]">
          <li>Tier: {summary.tier}</li>
          <li>Discount: {summary.discount}</li>
          <li>Compliance: {summary.compliance}</li>
        </ul>
      </div>
      <button
        type="button"
        className="tap-effect shrink-0 rounded-2xl bg-[#FBC02D] px-7 py-1.5 text-xs font-semibold text-[#121212]"
      >
        Top-Up
      </button>
    </div>
  );
}
