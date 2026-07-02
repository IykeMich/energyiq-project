import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { COMPLAINTS_OVER_TIME_MOCK } from './complaint-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';

export function ComplaintsOverTimeChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={COMPLAINTS_OVER_TIME_MOCK} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<AnalyticsChartTooltip />} />
          <Line
            type="monotone"
            dataKey="complaints"
            stroke="#FFFFFF"
            strokeWidth={2}
            dot={{ fill: '#FFFFFF', r: 4, strokeWidth: 2, stroke: '#FBC02D' }}
            activeDot={{ r: 6, fill: '#FBC02D', strokeWidth: 2, stroke: '#FFFFFF' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
