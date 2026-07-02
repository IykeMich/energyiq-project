import { COMPLAINT_RESOLUTION_TYPE_ANALYSIS_MOCK } from './complaint-analytics-mocks';

export function ComplaintResolutionTypeAnalysis() {
  return (
    <div className="space-y-5">
      {COMPLAINT_RESOLUTION_TYPE_ANALYSIS_MOCK.map((item) => (
        <div key={item.type}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">{item.type}</p>
            <span className="text-sm font-medium text-white">{item.percentage}%</span>
          </div>
          <div className="h-2 bg-[#6161611A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
