import { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { SALES_REVENUE_VS_COSTS_MOCK } from './sales-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';
import { ReportFilterChips, type ReportFilterSelection } from '../../reports/report-filter-chips';

const FILTERS = [
  { id: 'region', label: 'Region', options: ['All Regions', 'Lagos', 'Abuja', 'Port Harcourt'] },
  { id: 'time', label: 'Time', options: ['This Year', 'Last Year', 'Last 6 Months'] },
  { id: 'product', label: 'Product', options: ['All Products', 'PMS', 'AGO', 'DPK', 'Lubricant'] },
];

export function SalesRevenueVsCostsChart() {
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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={SALES_REVENUE_VS_COSTS_MOCK}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip content={<AnalyticsChartTooltip valueSuffix="M" />} />
            <Bar dataKey="revenue" fill="#FBC02D" radius={[4, 4, 0, 0]} barSize={24} />
            <Line
              type="monotone"
              dataKey="costs"
              stroke="#1E88E5"
              strokeWidth={2}
              dot={{ fill: '#1E88E5', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[#1E88E5]">
        Revenue is consistently higher than costs + growth%
      </p>
    </div>
  );
}
