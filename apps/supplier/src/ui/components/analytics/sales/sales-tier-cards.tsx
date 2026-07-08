import { SALES_TIER_CARDS_MOCK } from './sales-analytics-mocks';

export function SalesTierCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {SALES_TIER_CARDS_MOCK.map((item) => (
        <div
          key={item.tier}
          className="flex items-center gap-4 rounded-2xl bg-[#FFFFFF1A] p-5"
        >
          <div
            className="h-12 w-12 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#FAFAFA]">{item.tier}</span>
            <span className="text-lg font-bold text-white">{item.sales}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
