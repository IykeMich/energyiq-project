import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TOP_DISTRIBUTORS_MOCK } from './distributor-mocks';
import { AnalyticsChartTooltip } from '../../analytics/analytics-chart-tooltip';

export function TopDistributorsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={TOP_DISTRIBUTORS_MOCK} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `N${Number(value) / 1000}K`}
          />
          <Tooltip
            content={<AnalyticsChartTooltip valueSuffix="" />}
            formatter={(value: number) => [`N${(value / 1000000).toFixed(1)}M`, 'Sales']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {TOP_DISTRIBUTORS_MOCK.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === TOP_DISTRIBUTORS_MOCK.length - 1 ? '#FBC02D' : '#C49A1F'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
