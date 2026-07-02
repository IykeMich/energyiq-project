import { DISTRIBUTOR_TIER_DISTRIBUTION_MOCK } from './distributor-analytics-mocks';

export function DistributorTierDistribution() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {DISTRIBUTOR_TIER_DISTRIBUTION_MOCK.map((tier) => (
        <div
          key={tier.name}
          className="bg-[#FFFFFF1A] rounded-2xl p-5 border-t-4"
          style={{ borderTopColor: tier.highlightColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-white">{tier.name}</h4>
            <span className="text-xs text-[#FFFFFFCC]">{tier.count} Distributors</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#FFFFFFCC]">Average Monthly Volume</p>
              <p className="text-lg font-bold text-white">{tier.averageMonthlyVolume}</p>
            </div>
            <div>
              <p className="text-xs text-[#FFFFFFCC]">Payment Discipline</p>
              <p className="text-sm font-medium text-white">{tier.paymentDiscipline}</p>
            </div>
            <div>
              <p className="text-xs text-[#FFFFFFCC]">Trust Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#6161611A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${tier.trustScore}%`, backgroundColor: tier.highlightColor }}
                  />
                </div>
                <span className="text-xs text-white">{tier.trustScore}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#FFFFFFCC]">Top Distributor</p>
              <p className="text-sm font-medium text-white truncate">{tier.topDistributor}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
