import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { COMPLAINTS_BY_PRODUCT_MOCK } from './complaint-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';

export function ComplaintByProductChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={COMPLAINTS_BY_PRODUCT_MOCK}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
        >
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            dataKey="product"
            type="category"
            tick={{ fill: '#FFFFFF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<AnalyticsChartTooltip />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
            {COMPLAINTS_BY_PRODUCT_MOCK.map((_, index) => (
              <Cell key={index} fill={index === 0 ? '#D30A0A' : '#FB8C1C'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
