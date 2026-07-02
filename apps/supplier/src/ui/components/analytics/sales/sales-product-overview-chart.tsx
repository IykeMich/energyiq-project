import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PRODUCT_SALES_OVERVIEW_MOCK } from './sales-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';

export function SalesProductOverviewChart() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="w-full lg:w-1/2 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={PRODUCT_SALES_OVERVIEW_MOCK}
              cx="50%"
              cy="50%"
              innerRadius={50}
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
      <div className="w-full lg:w-1/2 space-y-3">
        {PRODUCT_SALES_OVERVIEW_MOCK.map((product) => (
          <div key={product.name} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: product.color }} />
            <span className="text-sm text-white">{product.name}</span>
            <span className="text-sm text-[#FFFFFFCC] ml-auto">{product.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
