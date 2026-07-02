import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { STOCK_LEVELS_MOCK } from './inventory-mocks';
import { AnalyticsChartTooltip } from '../../analytics/analytics-chart-tooltip';

export function StockLevelsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={STOCK_LEVELS_MOCK}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="0" stroke="#3f3f46" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${Number(value) / 1000}K`}
          />
          <YAxis
            dataKey="product"
            type="category"
            tick={{ fill: '#FAFAFA', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<AnalyticsChartTooltip valueSuffix="L" />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {STOCK_LEVELS_MOCK.map((entry) => (
              <Cell key={entry.product} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
