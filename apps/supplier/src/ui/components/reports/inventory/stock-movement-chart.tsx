import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { STOCK_MOVEMENT_CHART_MOCK } from './inventory-mocks';
import { AnalyticsChartTooltip } from '../../analytics/analytics-chart-tooltip';

export function StockMovementChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={STOCK_MOVEMENT_CHART_MOCK} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value} Units`}
          />
          <Tooltip content={<AnalyticsChartTooltip valueSuffix=" Units" />} />
          <Bar dataKey="units" fill="#FBC02D" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
