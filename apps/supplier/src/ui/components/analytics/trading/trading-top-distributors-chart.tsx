import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { TOP_TRADING_DISTRIBUTORS_MOCK } from './trading-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';

const formatValue = (value: number) => `₦${(value / 1000000).toFixed(0)}M`;

export function TradingTopDistributorsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={TOP_TRADING_DISTRIBUTORS_MOCK}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
        >
          <XAxis type="number" tickFormatter={formatValue} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: '#FFFFFF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<AnalyticsChartTooltip valueSuffix="" />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {TOP_TRADING_DISTRIBUTORS_MOCK.map((_, index) => (
              <Cell key={index} fill="#FBC02D" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
