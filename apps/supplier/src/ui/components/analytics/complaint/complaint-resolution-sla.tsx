import { COMPLAINT_RESOLUTION_SLA_MOCK } from './complaint-analytics-mocks';

export function ComplaintResolutionSla() {
  return (
    <div className="space-y-5">
      {COMPLAINT_RESOLUTION_SLA_MOCK.map((tier) => (
        <div key={tier.tier}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-white">{tier.tier}</p>
              <p className="text-xs text-[#FFFFFFCC]">Resolved within {tier.time}</p>
            </div>
            <span className="text-sm font-medium text-white">{tier.percentage}%</span>
          </div>
          <div className="h-2 bg-[#6161611A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
