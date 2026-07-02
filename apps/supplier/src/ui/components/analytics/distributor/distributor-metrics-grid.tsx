import { DISTRIBUTOR_METRICS_MOCK } from './distributor-analytics-mocks';

export function DistributorMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {DISTRIBUTOR_METRICS_MOCK.map((group) => (
        <div key={group.title} className="bg-[#FFFFFF1A] rounded-2xl p-5">
          <h4 className="text-sm font-medium text-white mb-4">{group.title}</h4>
          <div className="space-y-4">
            {group.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-xs text-[#FFFFFFCC]">{metric.label}</p>
                <p className="text-lg font-bold text-white">{metric.value}</p>
                {metric.subtext && <p className="text-xs text-[#FFFFFFCC]">{metric.subtext}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
