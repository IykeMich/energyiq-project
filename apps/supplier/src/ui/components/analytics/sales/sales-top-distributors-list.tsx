import { TOP_DISTRIBUTORS_BY_SALES_MOCK } from './sales-analytics-mocks';

export function SalesTopDistributorsList() {
  return (
    <div className="space-y-4">
      {TOP_DISTRIBUTORS_BY_SALES_MOCK.map((distributor) => (
        <div key={distributor.name} className="flex items-center gap-3">
          <span className="text-[#FBC02D] text-sm">•</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{distributor.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{distributor.sales}</p>
            <p className="text-xs text-emerald-500">{distributor.growth}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
