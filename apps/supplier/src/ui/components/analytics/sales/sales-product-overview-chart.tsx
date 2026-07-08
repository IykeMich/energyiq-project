import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PRODUCT_SALES_OVERVIEW_MOCK } from './sales-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';
import { ReportFilterChips, type ReportFilterSelection } from '../../reports/report-filter-chips';

const FILTERS = [
  { id: 'region', label: 'Region', options: ['All Regions', 'Lagos', 'Abuja', 'Port Harcourt'] },
  { id: 'time', label: 'Time', options: ['This Year', 'Last Year', 'Last 6 Months'] },
];

export function SalesProductOverviewChart() {
  const [filters, setFilters] = useState<ReportFilterSelection>({});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ReportFilterChips
          filters={FILTERS}
          selection={filters}
          onChange={(id, option) => setFilters((previous) => ({ ...previous, [id]: option }))}
        />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-1/2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PRODUCT_SALES_OVERVIEW_MOCK}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {PRODUCT_SALES_OVERVIEW_MOCK.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<AnalyticsChartTooltip valueSuffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
          {PRODUCT_SALES_OVERVIEW_MOCK.map((product) => (
            <div key={product.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: product.color }}
                  />
                  <span className="text-white">{product.name}</span>
                </div>
                <span className="text-[#FFFFFFCC]">{product.value}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#6161611A]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${product.value}%`, backgroundColor: product.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
