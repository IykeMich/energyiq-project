import { TOP_DISTRIBUTORS_BY_SALES_MOCK } from './sales-analytics-mocks';

export function SalesTopDistributorsList() {
  return (
    <div className="space-y-4">
      {TOP_DISTRIBUTORS_BY_SALES_MOCK.map((distributor, index) => (
        <div key={distributor.name} className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFFFF1A] text-sm font-bold text-white">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{distributor.name}</p>
            <p className="text-xs text-[#FFFFFFCC]">{distributor.location}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{distributor.sales}</p>
            <p className="text-xs text-success">{distributor.growth}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
