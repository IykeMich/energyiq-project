import { COMPLAINT_RESOLUTION_EFFECTIVENESS_MOCK } from './complaint-analytics-mocks';

export function ComplaintResolutionEffectiveness() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {COMPLAINT_RESOLUTION_EFFECTIVENESS_MOCK.map((item) => (
        <div key={item.label} className="bg-[#FFFFFF1A] rounded-2xl p-5">
          <p className="text-sm font-medium text-white mb-1">{item.label}</p>
          <p className="text-2xl font-bold text-white mb-2">{item.value}</p>
          <p className="text-xs text-[#FFFFFFCC]">{item.subtext}</p>
        </div>
      ))}
    </div>
  );
}
